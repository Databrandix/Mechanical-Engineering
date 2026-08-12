/**
 * Add publications to the research page from the department's template.
 *
 *   node --env-file=.env scripts/import-research-publications.mjs <xlsx> [--apply] [--replace]
 *
 * The file is one row per researcher, not per paper: each "Publication Title"
 * cell holds that person's whole list, numbered, with every entry a full
 * citation. So the cells are split into entries and each entry read.
 *
 * Reports by default. Parsing citations written by hand is guesswork at the
 * edges, and the run prints what it made of every one so the guesses can be
 * read before anything is saved.
 *
 * --replace clears the publications a previous run added (anything with a
 * link, or matching a title in the sheet) before writing. Without it, papers
 * already on the site are matched by title and left alone.
 */
import { existsSync } from 'node:fs';
import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const [, , xlsxArg] = process.argv;
const APPLY = process.argv.includes('--apply');
const REPLACE = process.argv.includes('--replace');

if (!xlsxArg || !existsSync(xlsxArg)) {
  console.error('usage: node --env-file=.env scripts/import-research-publications.mjs <xlsx> [--apply] [--replace]');
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

/**
 * "1. …  2. …" — one citation per numbered entry.
 *
 * A fragment that is only a DOI is a continuation of the entry above it, not
 * a publication of its own; an earlier run stored three of those as papers
 * whose whole title was a URL. They are folded back into the previous entry.
 */
function entries(blob) {
  const raw = String(blob ?? '')
    .split(/(?=\b\d{1,2}\s*[.)]\s*[A-Z“"])/)
    .map((s) => text(s).replace(/^\d{1,2}\s*[.)]\s*/, ''))
    .filter(Boolean);

  const out = [];
  for (const part of raw) {
    const isFragment = /^(doi|https?:)/i.test(part) || part.length < 40;
    if (isFragment && out.length > 0) out[out.length - 1] += ` ${part}`;
    else if (!isFragment) out.push(part);
  }
  return out;
}

const yearIn = (s) => {
  const years = [...String(s).matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]));
  return years.length > 0 ? years[years.length - 1] : null;
};

/** DOIs and article links, pulled out so the page can offer them as links. */
function links(citation) {
  const found = [...citation.matchAll(/https?:\/\/[^\s,;)]+/gi)].map((m) =>
    m[0].replace(/[.,;]+$/, ''),
  );
  return [...new Set(found)].map((value) => ({
    label: /doi\.org|dx\.doi/i.test(value) ? 'DOI' : 'Article',
    value,
  }));
}

/** Everything from the first link onwards is trailing apparatus, not prose. */
function withoutLinks(citation) {
  return text(citation.replace(/(doi\s*:)?\s*https?:\/\/\S+.*$/i, '')).replace(/[,;.\s]+$/, '');
}

/**
 * Four styles appear in these cells:
 *
 *   authors, “Title”, venue                   quoted
 *   Authors (2024). Title. Venue.             APA
 *   Authors (2022): Title, Venue, pages       colon
 *   Title. Authors. Venue (2022).             title first
 *
 * Each marks the title differently, so each is matched separately rather than
 * by one rule that would half-fit them all.
 */
function parse(citation) {
  const body = withoutLinks(citation);
  const year = yearIn(citation);

  const quoted = body.match(/[“"”]([^“”"]{10,})[”"“]/);
  if (quoted) {
    return {
      style: 'quoted',
      title: text(quoted[1]).replace(/[,;.]\s*$/, ''),
      authors: text(body.slice(0, quoted.index)).replace(/[,;]\s*$/, ''),
      venue: text(body.slice(quoted.index + quoted[0].length)).replace(/^[,;.\s]+/, ''),
      year,
    };
  }

  const apa = body.match(/^(.{10,}?)\((?:19|20)\d{2}[a-z]?\)\.\s*([^.]{15,}?)\.\s*(.*)$/);
  if (apa) {
    return {
      style: 'APA',
      title: text(apa[2]),
      authors: text(apa[1]).replace(/[,;&\s]+$/, ''),
      venue: text(apa[3]),
      year,
    };
  }

  /* "Authors (2022): Title, Venue, 5(8), 107-118" — the venue follows the
     title, separated by a comma in some entries and a full stop in others, so
     the title ends at whichever comes first. A title containing either would
     be cut short; none in this file is, and the run prints every title so a
     truncated one is visible. */
  const colon = body.match(/^(.{10,}?)\((?:19|20)\d{2}[a-z]?\)\s*:\s*(.+)$/);
  if (colon) {
    const rest = text(colon[2]);
    const breaks = [rest.indexOf(', '), rest.indexOf('. ')].filter((i) => i > 15);
    const at = breaks.length > 0 ? Math.min(...breaks) : -1;
    return {
      style: 'colon',
      title: at > 0 ? rest.slice(0, at) : rest,
      authors: text(colon[1]).replace(/[,;&\s]+$/, ''),
      venue: at > 0 ? text(rest.slice(at + 1)).replace(/^[,.\s]+/, '') : '',
      year,
    };
  }

  /* "Title. Authors. Venue (2022)." — sentence-delimited, title first. Only
     taken when the opening sentence looks like a title rather than a name
     list: long, and with no year or initials in it. */
  const parts = body.split(/\.\s+/);
  const first = text(parts[0] ?? '');
  const looksLikeTitle =
    parts.length >= 2 && first.length > 30 && !/\(\d{4}\)/.test(first) && !/\b[A-Z]\.\s?[A-Z]?\./.test(first);
  if (looksLikeTitle) {
    return {
      style: 'title first',
      title: first,
      authors: text(parts[1] ?? ''),
      venue: text(parts.slice(2).join('. ')),
      year,
    };
  }

  return { style: 'unparsed', title: body, authors: '', venue: '', year };
}

const normalize = (title) => text(title).toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  const wb = XLSX.readFile(xlsxArg);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

  const parsed = [];
  const counts = {};
  const untrustworthy = [];

  for (const row of rows) {
    const researcher = text(cell(row, 'researcher name'));
    const department = text(cell(row, 'department'));
    if (researcher === '') continue;

    for (const citation of entries(cell(row, 'publication title'))) {
      const p = parse(citation);

      /* One researcher's cell is not a citation list at all but a filled-in
         template — "Journal Paper 1 Publisher Paper title : …" — describing
         several papers at once. Every rule above finds something in it, and
         what they find is nonsense: an author field hundreds of characters
         long. An author list that long is a parse that went wrong, so the
         entry is reported for hand entry instead of published. */
      if (p.authors.length > 150) {
        untrustworthy.push(`${researcher}: ${citation.slice(0, 80)}…`);
        continue;
      }

      counts[p.style] = (counts[p.style] ?? 0) + 1;
      parsed.push({
        title: p.title,
        authors: p.authors || researcher,
        area: p.venue || department,
        date: p.year ? String(p.year) : null,
        publicationYear: p.year,
        links: links(citation),
        style: p.style,
      });
    }
  }

  for (const p of parsed) {
    console.log(`[${p.style}] ${p.publicationYear ?? '????'}  ${p.title}`);
    console.log(`         by ${p.authors}`);
    if (p.area) console.log(`         in ${p.area.slice(0, 100)}`);
    if (p.links.length) console.log(`         ${p.links.map((l) => l.value).join(' ')}`);
  }

  console.log(`\nStyles: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  console.log(`${APPLY ? 'Writing' : 'Would write'} ${parsed.length} publications.`);

  if (!APPLY) {
    console.log('\nNothing was written. Re-run with --apply (add --replace to redo a previous import).');
    return;
  }

  const titles = new Set(parsed.map((p) => normalize(p.title)));
  const existing = await prisma.researchPaper.findMany();

  if (REPLACE) {
    /* Anything a previous run of this importer left behind: a paper whose
       title the sheet still names, or one whose whole title is a URL. */
    const stale = existing.filter(
      (p) => titles.has(normalize(p.title)) || /^DOI:|^https?:/i.test(p.title.trim()),
    );
    if (stale.length > 0) {
      await prisma.researchPaper.deleteMany({ where: { id: { in: stale.map((p) => p.id) } } });
      console.log(`  removed ${stale.length} rows from the previous import`);
    }
  }

  const kept = await prisma.researchPaper.findMany({ select: { title: true, displayOrder: true } });
  const seen = new Set(kept.map((p) => normalize(p.title)));
  let order = kept.reduce((n, p) => Math.max(n, p.displayOrder), -1) + 1;

  const toAdd = parsed.filter((p) => {
    if (seen.has(normalize(p.title))) return false;
    seen.add(normalize(p.title));
    return true;
  });

  await prisma.researchPaper.createMany({
    data: toAdd.map(({ style: _style, ...p }) => ({ ...p, displayOrder: order++ })),
  });
  console.log(`  added ${toAdd.length}, skipped ${parsed.length - toAdd.length} already present`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
