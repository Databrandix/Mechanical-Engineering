/**
 * The Layout Plan page: its rooms, its downloadable plan, its cover, and its
 * place in the About menu.
 *
 *   node --env-file=.env scripts/build-layout-plan.mjs <path to the plan PDF>
 *
 * The rows come from the department's own layout plan — nine offices,
 * classrooms and labs against their room numbers. They are seeded here once;
 * after that the admin panel owns them, and re-running this leaves existing
 * rows alone rather than overwriting an edit.
 *
 * The download is the department's signed document, copied in as a bundled
 * asset. Its name carries a hash of its contents because Next.js serves
 * public/ as `immutable` for a year: a plan replaced at the same path would
 * never reach anyone who had already opened the old one.
 *
 * sharp is a devDependency: the cover is drawn here, written into
 * public/assets, and served statically. Nothing runs at request time.
 *
 * Safe to run again: it replaces the PDF, keeps a cover that is already set
 * (pass --redraw-cover to replace one deliberately), and leaves the menu
 * alone if the entry is there.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const [, , pdfArg] = process.argv;
if (!pdfArg) {
  console.error('usage: node --env-file=.env scripts/build-layout-plan.mjs <path to the plan PDF>');
  process.exit(1);
}
if (!existsSync(pdfArg)) {
  console.error(`No such file: ${pdfArg}`);
  process.exit(1);
}

const prisma = new PrismaClient();

const NAVY = '#2b3175';
const MAGENTA = '#cc1579';
const INK = '#1f2333';
const MUTED = '#6b6f85';
const RULE = '#dcdfeb';

const SLUG = 'department-layout-plan';
const PDF_STEM = 'layout-plan-me';
const COVER_STEM = 'layout-plan-me-cover';

/** The department's layout plan, as the document lists it. */
const ROOMS = [
  { name: 'Office of the Vice Chancellor', room: '507', building: '147/I Green Road' },
  { name: 'Office of the Pro-Vice Chancellor', room: '202', building: '147/I Green Road' },
  { name: 'Office of the Dean of the Faculty of Science & Engineering', room: '107', building: '147/I Green Road' },
  { name: 'Office of the Head of the Department', room: '307', building: '147/I Green Road' },
  { name: 'Office of the Coordinator', room: '514', building: '147/I Green Road' },
  { name: 'Teachers Room', room: '101', building: 'Anarkali Bhaban' },
  { name: 'Classroom', room: '08', building: '147/I Green Road' },
  { name: 'Drawing Lab', room: '701', building: '147/I Green Road' },
  { name: 'Laboratory', room: 'UG001-UG005', building: '147/I Green Road' },
];

const digest = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 8);

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clip = (s, max) => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`);

/** Drop earlier builds of an asset so public/assets does not silt up. */
async function pruneOlder(dir, stem, keep) {
  const pattern = new RegExp(`^${stem}(-[0-9a-f]{8})?\\.[a-z]+$`);
  for (const name of await readdir(dir)) {
    if (name !== keep && pattern.test(name)) {
      await unlink(path.join(dir, name));
      console.log(`  removed stale ${name}`);
    }
  }
}

/**
 * The card wants a cover. Rasterising a PDF needs tooling this project does
 * not carry, so the cover is drawn from the same rows the document lists — a
 * preview of what is inside, not an imitation of a scan.
 */
async function buildCover(dept, rooms) {
  const preview = rooms.slice(0, 9);
  const lines = preview
    .map((r, i) => {
      const y = 300 + i * 34;
      return `
    <line x1="56" y1="${y - 20}" x2="544" y2="${y - 20}" stroke="${RULE}" stroke-width="1"/>
    <text x="56" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="${INK}">${esc(clip(r.name, 46))}</text>
    <text x="544" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="${MUTED}" text-anchor="end">${esc(r.room)}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#ffffff"/>
  <rect width="600" height="10" fill="${NAVY}"/>
  <text x="56" y="96" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="${MAGENTA}">SONARGAON UNIVERSITY</text>
  <text x="56" y="126" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="${MUTED}">${esc(clip(dept.name, 62))}</text>
  <text x="56" y="196" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="${NAVY}">Layout Plan</text>
  <line x1="56" y1="222" x2="200" y2="222" stroke="${MAGENTA}" stroke-width="3"/>
  <text x="56" y="256" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="${MUTED}">${rooms.length} rooms · offices, classrooms and laboratories</text>
  ${lines}
  <rect y="790" width="600" height="10" fill="${MAGENTA}"/>
</svg>`;

  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer();
}

/** Put Layout Plan in the About menu, after the entries already there. */
async function addMenuEntry(href) {
  const about = await prisma.mainNavGroup.findFirst({ where: { name: 'About' } });
  if (!about) {
    console.log('  no About menu group — skipped the menu entry');
    return;
  }
  const existing = await prisma.mainNavItem.findFirst({ where: { groupId: about.id, href } });
  if (existing) {
    console.log(`  menu: "${existing.name}" already points at ${href}`);
    return;
  }
  const last = await prisma.mainNavItem.findFirst({
    where: { groupId: about.id },
    orderBy: { displayOrder: 'desc' },
  });
  await prisma.mainNavItem.create({
    data: { groupId: about.id, name: 'Layout Plan', href, displayOrder: (last?.displayOrder ?? 0) + 1 },
  });
  console.log('  menu: added About → Layout Plan');
}

async function main() {
  const dept = await prisma.departmentIdentity.findUnique({ where: { id: 'singleton' } });

  // ── The rooms ───────────────────────────────────────────────────
  const already = await prisma.officeLocation.count();
  if (already > 0) {
    console.log(`  rooms: ${already} already in the database — left alone`);
  } else {
    await prisma.officeLocation.createMany({
      data: ROOMS.map((r, i) => ({ ...r, displayOrder: i + 1 })),
    });
    console.log(`  rooms: seeded ${ROOMS.length}`);
  }
  const rooms = await prisma.officeLocation.findMany({ orderBy: { displayOrder: 'asc' } });

  const assets = path.join(process.cwd(), 'public', 'assets');
  await mkdir(assets, { recursive: true });

  // ── The document ────────────────────────────────────────────────
  const pdf = await readFile(pdfArg);
  const pdfFile = `${PDF_STEM}-${digest(pdf)}.pdf`;
  await writeFile(path.join(assets, pdfFile), pdf);
  await pruneOlder(assets, PDF_STEM, pdfFile);

  const existing = await prisma.departmentLayout.findUnique({ where: { slug: SLUG } });
  const needsCover = process.argv.includes('--redraw-cover') || !existing?.coverUrl;
  let coverUrl = existing?.coverUrl;
  if (needsCover) {
    const cover = await buildCover(dept ?? { name: '' }, rooms);
    const coverFile = `${COVER_STEM}-${digest(cover)}.jpg`;
    await writeFile(path.join(assets, coverFile), cover);
    await pruneOlder(assets, COVER_STEM, coverFile);
    coverUrl = `/assets/${coverFile}`;
  }

  const row = {
    title: `${dept?.name ?? 'Department'} — Layout Plan`,
    shortTitle: 'Departmental Layout Plan',
    coverUrl,
    pdfUrl: `/assets/${pdfFile}`,
    /* What the browser saves it as — readable, unlike the hashed URL. */
    pdfFileName: 'SU-ME-Layout-Plan.pdf',
    displayOrder: 1,
  };
  await prisma.departmentLayout.upsert({
    where: { slug: SLUG },
    create: { slug: SLUG, ...row, coverUrl },
    update: row,
  });

  await addMenuEntry('/about/layout-plan');

  console.log(`copied ${path.basename(pdfArg)} → public/assets/${pdfFile}`);
  console.log(
    needsCover ? `  drew a cover previewing ${rooms.length} rooms` : `  kept the cover already set`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
