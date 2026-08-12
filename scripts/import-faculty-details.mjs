/**
 * Fill in faculty detail sections from the department's contact spreadsheet.
 *
 *   node --env-file=.env scripts/import-faculty-details.mjs <xlsx path> [--apply]
 *
 * Without --apply it only reports what it would change, which is the way to
 * run it first: the spreadsheet names people slightly differently from the
 * site ("A M M Shamsul Alam" against "AMM Shamsul Alam", "Md. Mostofa
 * Hossain" against "Prof. Md. Mostofa Hossain"), so the matching deserves a
 * look before anything is written.
 *
 * Only non-empty cells are written. A teacher the spreadsheet leaves blank
 * keeps whatever the site already has — the sheet is a source of additions,
 * not a replacement, and a blank cell in it means "not collected yet" rather
 * than "delete what is there".
 *
 * Two columns are deliberately not imported; see BIOGRAPHY and JOINING_DATE
 * below.
 */
import { existsSync } from 'node:fs';
import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const [, , xlsxArg] = process.argv;
const APPLY = process.argv.includes('--apply');

if (!xlsxArg || !existsSync(xlsxArg)) {
  console.error('usage: node --env-file=.env scripts/import-faculty-details.mjs <xlsx path> [--apply]');
  process.exit(1);
}

const prisma = new PrismaClient();

/**
 * Short Biography has nowhere to go: Faculty has no biography column and the
 * detail page renders eight fixed sections, none of them prose about the
 * person. Rather than fold a paragraph into "Training & Experience", where it
 * would read as a mistake, it is left out and reported.
 */
const BIOGRAPHY = 'short biography';

/**
 * Joining Date is not imported either. The column mixes Excel serial numbers
 * (42443) with two incompatible written formats — "26-02-2019" is day-first
 * and "02-25-2023" is month-first — so any single rule silently mangles some
 * of them, and nothing on the site displays a joining date today.
 */
const JOINING_DATE = 'joining date';

/**
 * Spreadsheet column → Faculty column, matched on the start of the heading
 * rather than the whole of it.
 *
 * The headings carry whitespace nobody can see: "Short Biography " ends in a
 * space, and "Academic Background\r\n(HSC,B.Sc. , M.Sc. Ph.D) " has a
 * carriage return in the middle and a space at the end. Matching them
 * literally worked for five columns and silently skipped two — the academic
 * background of every teacher went missing without a word. A prefix, compared
 * with whitespace collapsed, survives the sheet being re-saved.
 */
const SECTIONS = [
  ['academic background', 'academicQualification'],
  ['professional experience', 'trainingExperience'],
  ['publication', 'publications'],
  ['awards and achievement', 'awards'],
  ['field of specialisation', 'teachingArea'],
  ['field of interest', 'research'],
  ['fellowship/membership', 'membership'],
];

const RESEARCH_LINKS = 'google scholar';

/** Find a row's value by the start of its column heading. */
function cell(row, prefix) {
  for (const [key, value] of Object.entries(row)) {
    const heading = key.replace(/\s+/g, ' ').trim().toLowerCase();
    if (heading.startsWith(prefix)) return value;
  }
  return '';
}

const text = (v) => String(v ?? '').replace(/\r/g, '').trim();

/**
 * Titles and honorifics differ between the two lists, and so does spacing.
 * Matching on what is left after stripping both is what pairs "A M M Shamsul
 * Alam" with "AMM Shamsul Alam".
 */
function normalizeName(name) {
  return text(name)
    .toLowerCase()
    .replace(/\b(prof|professor|engr|dr|mr|mrs|ms|brig|gen|retd|ndc|psc)\b\.?/g, '')
    .replace(/[^a-z]/g, '');
}

/**
 * A cell is one section's worth of content. Newlines separate items where the
 * writer used them; where they did not, a numbered list is still a list.
 */
function items(cell) {
  const value = text(cell);
  if (value === '') return [];
  const lines = value.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  const numbered = value.split(/(?=\b\d{1,2}\.\s)/).map((l) => l.trim()).filter(Boolean);
  return numbered.length > 1 ? numbered : [value];
}

/** "1769005367" is a Bangladeshi mobile missing its leading zero. */
function phone(cell) {
  const value = text(cell).replace(/\s+/g, '');
  if (/^1\d{9}$/.test(value)) return `0${value}`;
  return value;
}

async function main() {
  const wb = XLSX.readFile(xlsxArg);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

  const faculty = await prisma.faculty.findMany();
  const byName = new Map(faculty.map((f) => [normalizeName(f.name), f]));

  const unmatched = [];
  const noBiographyHome = [];
  let changed = 0;

  for (const row of rows) {
    const name = text(cell(row, 'name'));
    if (name === '') continue;

    const person = byName.get(normalizeName(name));
    if (!person) {
      unmatched.push(name);
      continue;
    }

    const data = {};
    const designation = text(cell(row, 'position')).replace(/\s+/g, ' ');
    if (designation) data.designation = designation;
    if (text(cell(row, 'mail'))) data.email = text(cell(row, 'mail'));
    if (phone(cell(row, 'mobile number'))) data.phone = phone(cell(row, 'mobile number'));
    if (text(cell(row, 'su id'))) data.suId = text(cell(row, 'su id'));

    for (const [column, field] of SECTIONS) {
      const list = items(cell(row, column));
      if (list.length > 0) data[field] = list;
    }

    /* Scholar and ResearchGate links belong with the research interests they
       document, and the page has no separate slot for them. */
    const links = items(cell(row, RESEARCH_LINKS));
    if (links.length > 0) {
      data.research = [...(data.research ?? items(person.research) ?? []), ...links];
    }

    if (text(cell(row, BIOGRAPHY))) noBiographyHome.push(name);

    const fields = Object.keys(data);
    if (fields.length === 0) continue;

    console.log(`${person.name}`);
    console.log(`  ${fields.join(', ')}`);
    changed += 1;

    if (APPLY) await prisma.faculty.update({ where: { id: person.id }, data });
  }

  console.log(`\n${APPLY ? 'Updated' : 'Would update'} ${changed} of ${rows.filter((r) => text(cell(r, 'name'))).length} people in the sheet.`);
  if (unmatched.length > 0) {
    console.log(`\nNot on the site — no row to update, none created:`);
    for (const n of unmatched) console.log(`  ${n}`);
  }
  if (noBiographyHome.length > 0) {
    console.log(`\n"${BIOGRAPHY}" supplied for ${noBiographyHome.length} people but not imported —`);
    console.log(`Faculty has no biography column and the detail page has no section for one.`);
  }
  console.log(`\n"${JOINING_DATE}" is not imported: the column mixes Excel serials with both`);
  console.log(`day-first and month-first written dates, and nothing on the site shows it.`);
  if (!APPLY) console.log(`\nNothing was written. Re-run with --apply.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
