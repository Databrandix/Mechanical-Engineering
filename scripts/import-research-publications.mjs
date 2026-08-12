/**
 * Add publications to the research page from the department's template.
 *
 *   node --env-file=.env scripts/import-research-publications.mjs <xlsx> [--apply]
 *
 * The file is one row per researcher, not per paper: each "Publication Title"
 * cell holds that person's whole list, numbered, with every entry a full
 * citation — authors, the title in quotes, then the venue and year. So the
 * cells are split into entries and each entry parsed into the three fields
 * the page shows.
 *
 * Reports by default. Parsing citations written by hand is guesswork at the
 * edges, and the run prints every title it extracted so the guesses can be
 * read before anything is saved. An entry whose title is not in quotes is
 * reported and skipped rather than stored half-parsed.
 *
 * Existing papers are matched by title and left alone, so re-running adds
 * only what is new.
 */
import { existsSync } from 'node:fs';
import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const [, , xlsxArg] = process.argv;
const APPLY = process.argv.includes('--apply');

if (!xlsxArg || !existsSync(xlsxArg)) {
  console.error('usage: node --env-file=.env scripts/import-research-publications.mjs <xlsx> [--apply]');
  process.exit(1);
}

const prisma = new PrismaClient();

const text = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

/** Find a column by the start of its heading — headings carry stray spaces. */
function cell(row, prefix) {
  for (const [key, value] of Object.entries(row)) {
    if (key.replace(/\s+/g, ' ').trim().toLowerCase().startsWith(prefix)) return value;
  }
  return '';
}

/** "1. …  2. …" — one citation per numbered entry. */
function entries(blob) {
  return String(blob ?? '')
    .split(/(?=\b\d{1,2}\s*[.)]\s*[A-Z“"])/)
    .map((s) => text(s).replace(/^\d{1,2}\s*[.)]\s*/, ''))
    .filter((s) => s.length > 40);
}

const yearIn = (s) => {
  const years = [...String(s).matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]));
  return years.length > 0 ? years[years.length - 1] : null;
};

/**
 * These citations are written in at least three styles, and only two of them
 * mark where the title ends:
 *
 *   authors, “Title”, venue          — quoted, whatever the quote character
 *   Authors (2024). Title. Venue.    — APA, sentence-delimited
 *   Title. Authors. Venue (2022).    — title first, nothing to delimit it
 *
 * The first two are split into title, authors and venue. The third is not
 * guessed at: splitting on the first full stop would cut "…: a case study
 * based on real data" off the title of one of these, and a research page that
 * mis-attributes work is worse than one that lists a citation whole. Those
 * entries are kept intact as the title, with the researcher named as the
 * author, which is what the faculty pages already do with the same text.
 */
function parse(citation) {
  const quoted = citation.match(/[“"”]([^“”"]{10,})[”"“]/);
  if (quoted) {
    const venue = text(citation.slice(quoted.index + quoted[0].length)).replace(/^[,;.\s]+/, '');
    return {
      split: true,
      title: text(quoted[1]).replace(/[,;.]\s*$/, ''),
      authors: text(citation.slice(0, quoted.index)).replace(/[,;]\s*$/, ''),
      venue,
      year: yearIn(venue) ?? yearIn(citation),
    };
  }

  /* APA: everything up to "(year)." is authors, the sentence after it is the
     title, the rest is where it appeared. */
  const apa = citation.match(/^(.{10,}?)\((?:19|20)\d{2}[a-z]?\)\.\s*([^.]{15,}?)\.\s*(.*)$/);
  if (apa) {
    return {
      split: true,
      title: text(apa[2]),
      authors: text(apa[1]).replace(/[,;&\s]+$/, ''),
      venue: text(apa[3]),
      year: yearIn(citation),
    };
  }

  return { split: false, year: yearIn(citation) };
}

const normalize = (title) => text(title).toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  const wb = XLSX.readFile(xlsxArg);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

  const existing = await prisma.researchPaper.findMany({ select: { title: true } });
  const seen = new Set(existing.map((p) => normalize(p.title)));

  const toAdd = [];
  const unparsed = [];
  let duplicates = 0;

  for (const row of rows) {
    const researcher = text(cell(row, 'researcher name'));
    const department = text(cell(row, 'department'));
    if (researcher === '') continue;

    for (const citation of entries(cell(row, 'publication title'))) {
      const parsed = parse(citation);

      /* A citation kept whole is stored as the title; the researcher is named
         as its author, because they are one and the citation lists the rest. */
      const paper = parsed.split
        ? {
            title: parsed.title,
            authors: parsed.authors || researcher,
            area: parsed.venue || department,
          }
        : { title: citation, authors: researcher, area: department };

      if (seen.has(normalize(paper.title))) {
        duplicates += 1;
        continue;
      }
      seen.add(normalize(paper.title));

      if (!parsed.split) unparsed.push(`${researcher}: ${citation.slice(0, 80)}…`);

      toAdd.push({
        ...paper,
        date: parsed.year ? String(parsed.year) : null,
        publicationYear: parsed.year,
      });
    }
  }

  for (const paper of toAdd) {
    console.log(`${paper.publicationYear ?? '????'}  ${paper.title.slice(0, 90)}`);
    console.log(`        ${paper.authors.slice(0, 90)}`);
  }

  console.log(`\n${APPLY ? 'Added' : 'Would add'} ${toAdd.length} publications.`);
  if (duplicates > 0) console.log(`  ${duplicates} already on the site — left alone.`);
  if (unparsed.length > 0) {
    console.log(`\n${unparsed.length} entries had no quoted title and were skipped:`);
    for (const u of unparsed) console.log(`  ${u}`);
  }

  if (APPLY && toAdd.length > 0) {
    const last = await prisma.researchPaper.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });
    let order = (last?.displayOrder ?? -1) + 1;
    await prisma.researchPaper.createMany({
      data: toAdd.map((p) => ({ ...p, displayOrder: order++ })),
    });
  }
  if (!APPLY) console.log(`\nNothing was written. Re-run with --apply.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
