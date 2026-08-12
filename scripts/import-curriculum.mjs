/**
 * The programme's course structure, read out of the department's guide book.
 *
 *   node --env-file=.env scripts/import-curriculum.mjs <guide book .docx> [degree code]
 *
 * Part D of that document lists twelve semesters as tables — serial, course
 * code, title, theory credits and contact hours, sessional credits and
 * contact hours, total. This reads those tables rather than asking anyone to
 * retype seventy-odd courses, because a transcription slip in a credit total
 * is the kind of error nobody notices until a student plans a semester
 * around it.
 *
 * A .docx is a zip of XML. Only the table rows of Part D are of interest,
 * and their shape is regular enough to read directly: cells in order,
 * separated by the marker this puts between them.
 *
 * Safe to run again — the curriculum row is keyed by programme and replaced
 * whole. It reports what it found so an unparsed table shows up as a missing
 * semester rather than as silence.
 */
import AdmZip from 'adm-zip';
import { existsSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const [, , docxArg, degreeArg] = process.argv;
if (!docxArg || !existsSync(docxArg)) {
  console.error('usage: node --env-file=.env scripts/import-curriculum.mjs <guide book .docx> [degree code]');
  process.exit(1);
}

const prisma = new PrismaClient();

/** Turn the document into one line per table row, cells separated by "|". */
function rows(docxPath) {
  const xml = new AdmZip(docxPath).readAsText('word/document.xml');
  return xml
    .replace(/<w:tr[ >]/g, '\n@@ROW@@<w:tr ')
    .replace(/<w:tc[ >]/g, '@@CELL@@<w:tc ')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .filter((line) => line.startsWith('@@ROW@@'))
    .map((line) =>
      line
        .replace('@@ROW@@', '')
        .split('@@CELL@@')
        .map((cell) =>
          cell
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim(),
        )
        .filter((cell) => cell !== ''),
    )
    .filter((cells) => cells.length > 0);
}

const SEMESTER_HEADING = /^(First|Second|Third|Fourth) Year: (\d)(?:st|nd|rd|th) Semester \[([\d.]+) Credits\]$/;
/**
 * "ME 1101", "Chem 1102", "Shop 1100" — a department code then four digits.
 *
 * Two shapes in the fourth year are not that, and dropping them cost fifteen
 * credits before the mismatch check caught it: "ME 4000-1", the thesis split
 * across semesters, and "ME 41XX", a placeholder for a course the student
 * chooses from an option list.
 */
const COURSE_CODE = /^[A-Za-z]{2,5} ?[\dX]{4}(-\d+)?$/i;

const number = (cell) => {
  const value = Number(String(cell).replace(/[^\d.]/g, ''));
  return Number.isFinite(value) && String(cell).trim() !== '--' ? value : 0;
};

function parse(docxPath) {
  const semesters = [];
  let current = null;

  for (const cells of rows(docxPath)) {
    const heading = cells[0].match(SEMESTER_HEADING);
    if (heading) {
      current = { name: `${heading[1]} Year: ${heading[2]}${['st', 'nd', 'rd'][Number(heading[2]) - 1] ?? 'th'} Semester`, credits: Number(heading[3]), courses: [] };
      semesters.push(current);
      continue;
    }
    if (!current) continue;

    /* A course row is: serial, code, title, then the six numeric columns. */
    if (cells.length >= 8 && /^\d+$/.test(cells[0]) && COURSE_CODE.test(cells[1])) {
      current.courses.push({
        serial: Number(cells[0]),
        code: cells[1],
        title: cells[2],
        theory: number(cells[3]),
        theoryHours: number(cells[4]),
        sessional: number(cells[5]),
        sessionalHours: number(cells[6]),
        total: number(cells[7]),
      });
    }
  }

  return semesters.filter((s) => s.courses.length > 0);
}

async function main() {
  const semesters = parse(docxArg);
  if (semesters.length === 0) {
    throw new Error('no semester tables were recognised — has the document changed shape?');
  }

  /* The credit summary is derived, not read: the document prints a Total row
     per table, but a figure computed from the courses shown is the one that
     matches what a visitor can count on the page. */
  let cumulative = 0;
  const creditRows = semesters.map((s) => {
    const theory = s.courses.reduce((n, c) => n + c.theory, 0);
    const sessional = s.courses.reduce((n, c) => n + c.sessional, 0);
    const total = s.courses.reduce((n, c) => n + c.total, 0);
    cumulative += total;
    return {
      semester: s.name,
      theory: Number(theory.toFixed(2)),
      sessional: Number(sessional.toFixed(2)),
      total: Number(total.toFixed(2)),
      cumulative: Number(cumulative.toFixed(2)),
    };
  });

  const program = degreeArg
    ? await prisma.program.findFirst({ where: { degreeCode: { equals: degreeArg, mode: 'insensitive' } } })
    : await prisma.program.findFirst({ orderBy: { displayOrder: 'asc' } });
  if (!program) throw new Error(degreeArg ? `no programme with degree code "${degreeArg}"` : 'no programmes');

  await prisma.programCurriculum.upsert({
    where: { programId: program.id },
    create: { programId: program.id, semesters, creditRows },
    update: { semesters, creditRows },
  });

  console.log(`${program.programName}`);
  for (const [i, s] of semesters.entries()) {
    const stated = s.credits;
    const counted = creditRows[i].total;
    const mismatch = Math.abs(stated - counted) > 0.001 ? `  ⚠ document says ${stated}` : '';
    console.log(`  ${s.name}: ${s.courses.length} courses, ${counted} credits${mismatch}`);
  }
  console.log(`  total: ${cumulative.toFixed(2)} credits across ${semesters.length} semesters`);
}

main()
  .catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
