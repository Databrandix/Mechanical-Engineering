// NOTE: this module imports Prisma — it MUST NOT be imported from
// any client component. Client code (Navbar, SearchOverlay) must
// import SearchItem + search() from '@/lib/search' instead.
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { faqs } from './faq-data';
import { clubs } from './clubs-data';
import { alumni } from './alumni-data';
import { researchPapers } from './research-data';
import { busRoutes } from './transport-data';
import type { SearchItem } from './search';

// Re-export the type from the pure module so existing server-side
// consumers can keep importing it from here. Client components
// must import from '@/lib/search' (no Prisma transitive dep).
export type { SearchItem } from './search';

// ─────────────────────────────────────────────────────────────────
//  Search index — Phase 6 (Decision F2) — server-only
//
//  The root layout calls getSearchIndex() once per request and
//  passes the SearchItem[] down through Navbar → SearchOverlay as
//  a client prop. Filtering runs locally via search(query, items)
//  defined in '@/lib/search'.
//
//  DB-driven entities (Phase 2/3/5/6):
//    Faculty, Programs, Research Areas, Labs, News, Events,
//    Notices, Gallery
//
//  Still file-based (Phase 7+ will migrate):
//    FAQs, Clubs, Alumni, Research Papers, Transport (bus routes)
//
//  Static pages: hand-maintained route metadata; cheaper than
//  trying to derive from the router tree.
// ─────────────────────────────────────────────────────────────────

const staticPages: SearchItem[] = [
  // About
  { title: 'Overview', type: 'Page', href: '/about/overview', description: 'Department overview and history' },
  { title: 'Message from Head', type: 'Page', href: '/about/message-from-head', description: "Head of Department's welcome message" },
  { title: "Dean's Message", type: 'Page', href: '/about/deans-message', description: "Dean's welcome message" },
  { title: 'Mission & Vision', type: 'Page', href: '/about/mission-vision', description: "Department's mission and long-term vision" },
  { title: 'Laboratory Facility', type: 'Page', href: '/about/laboratory-facility', description: 'Departmental labs and equipment' },
  { title: 'Lab Facility', type: 'Page', href: '/about/lab-facility', description: 'List of all departmental labs' },
  { title: 'Mecha Club', type: 'Page', href: '/about/mecha-club', description: 'Sonargaon University Mecha Club (SUMEC)' },

  // Faculty
  { title: 'Faculty Members', type: 'Page', href: '/faculty-member', description: 'List of all faculty members' },

  // Admission
  { title: 'Admission Requirements', type: 'Page', href: '/admission/requirements', description: 'Eligibility and requirements for admission' },
  { title: 'Tuition Fees', type: 'Page', href: '/admission/tuition-fees', description: 'Program tuition fees and payment schedule' },
  { title: 'Transfer Credits', type: 'Page', href: '/admission/transfer-credits', description: 'Credit transfer policy and procedure' },
  { title: 'Waiver & Scholarship', type: 'Page', href: '/admission/waiver-scholarship', description: 'Tuition waivers and merit scholarships' },
  { title: 'Admission Notice', type: 'Page', href: '/admission/notice', description: 'Current admission notice and deadlines' },
  { title: 'Prospectus', type: 'Page', href: '/admission/prospectus', description: 'Department prospectus' },

  // Student Society
  { title: 'Notice Board', type: 'Page', href: '/student-society/notice-board', description: 'Department notices and announcements' },
  { title: 'Events', type: 'Page', href: '/student-society/events', description: 'Department events and activities' },
  { title: 'Alumni', type: 'Page', href: '/student-society/alumni', description: 'Notable alumni from the department' },
  { title: 'FAQ', type: 'Page', href: '/student-society/faq', description: 'Frequently asked questions' },
  { title: 'Syllabus', type: 'Page', href: '/student-society/syllabus', description: 'Department syllabus and curriculum' },
  { title: 'Club List', type: 'Page', href: '/student-society/club-list', description: 'Student clubs and societies' },

  // Other
  { title: 'Research Publications', type: 'Page', href: '/research', description: 'Research papers and publications' },
  { title: 'News', type: 'Page', href: '/news', description: 'Latest news and updates' },
  { title: 'Gallery', type: 'Page', href: '/gallery', description: 'Campus life photo gallery' },
  { title: 'Transport Service', type: 'Page', href: '/transport-service', description: 'Free university bus service routes and timings' },
  { title: 'Contact Us', type: 'Page', href: '/contact', description: 'Get in touch — phone, email, campus addresses' },
];

// React.cache so callers in the same render tree share one query
// burst. The layout calls getSearchIndex() once per request.
export const getSearchIndex = cache(async (): Promise<SearchItem[]> => {
  const [
    facultyRows,
    programRows,
    researchAreaRows,
    labRows,
    newsRows,
    eventRows,
    noticeRows,
    galleryRows,
  ] = await Promise.all([
    prisma.faculty.findMany({
      select: { slug: true, name: true, designation: true, secondaryTitle: true },
    }),
    prisma.program.findMany({
      select: { programName: true, degreeCode: true, description: true },
    }),
    prisma.researchArea.findMany({
      select: { areaName: true, description: true },
    }),
    prisma.lab.findMany({
      select: { slug: true, name: true, tagline: true },
    }),
    prisma.news.findMany({
      select: { slug: true, title: true, shortTitle: true, summary: true },
    }),
    prisma.event.findMany({
      select: { slug: true, shortTitle: true, summary: true },
    }),
    prisma.notice.findMany({
      select: { slug: true, title: true, description: true, fileUrl: true },
    }),
    prisma.galleryImage.findMany({
      select: { alt: true },
    }),
  ]);

  // Faculty (Phase 2 — DB)
  const facultyItems: SearchItem[] = facultyRows.map((f) => ({
    title: f.name,
    description: [f.designation, f.secondaryTitle].filter(Boolean).join(' · '),
    href: `/faculty-member/${f.slug}`,
    type: 'Faculty',
  }));

  // Programs (Phase 1 — DB). All link to /admission/requirements
  // since there's no per-program public page.
  const programItems: SearchItem[] = programRows.map((p) => ({
    title: `${p.programName} (${p.degreeCode})`,
    description: p.description ?? undefined,
    href: '/admission/requirements',
    type: 'Program',
  }));

  // Research areas — link to /research (no per-area public page).
  const researchAreaItems: SearchItem[] = researchAreaRows.map((r) => ({
    title: r.areaName,
    description: r.description ?? undefined,
    href: '/research',
    type: 'ResearchArea',
  }));

  // Labs (Phase 5 — DB). Hash-fragment for the slug-based detail UX.
  const labItems: SearchItem[] = labRows.map((l) => ({
    title: l.name,
    description: l.tagline,
    href: `/about/lab-facility#${l.slug}`,
    type: 'Lab',
  }));

  // News (Phase 6 — DB)
  const newsItems: SearchItem[] = newsRows.map((n) => ({
    title: n.title,
    description: n.summary,
    href: `/news/${n.slug}`,
    type: 'News',
  }));

  // Events (Phase 6 — DB)
  const eventItems: SearchItem[] = eventRows.map((e) => ({
    title: e.shortTitle,
    description: e.summary,
    href: `/student-society/events/${e.slug}`,
    type: 'Event',
  }));

  // Notices (Phase 6 — DB). href prefers the file attachment when
  // present (matches the public render's "View Full Notice" link);
  // falls back to the notice-board list page when no file uploaded.
  const noticeItems: SearchItem[] = noticeRows.map((n) => ({
    title: n.title,
    description: n.description,
    href: n.fileUrl ?? '/student-society/notice-board',
    type: 'Notice',
  }));

  // Gallery (Phase 6 — DB). Alt text is searchable; href goes to the
  // gallery list since there's no per-image detail page.
  const galleryItems: SearchItem[] = galleryRows
    .filter((g) => g.alt && g.alt.trim().length > 0)
    .map((g) => ({
      title: g.alt,
      href: '/gallery',
      type: 'Gallery',
    }));

  // Still file-based (Phase 7+ will migrate these)
  const faqItems: SearchItem[] = faqs.map((q) => ({
    title: q.question,
    description: q.answer,
    href: '/student-society/faq',
    type: 'FAQ',
  }));

  const clubItems: SearchItem[] = clubs.map((c) => ({
    title: `${c.name} (${c.abbreviation})`,
    description: c.description,
    href: '/student-society/club-list',
    type: 'Club',
  }));

  const alumniItems: SearchItem[] = alumni.map((a) => ({
    title: a.name,
    description: `${a.designation} · ${a.company}`,
    href: '/student-society/alumni',
    type: 'Alumni',
  }));

  const researchItems: SearchItem[] = researchPapers.map((r) => ({
    title: r.title,
    description: r.authors,
    href: '/research',
    type: 'Research',
  }));

  const transportItems: SearchItem[] = busRoutes.map((r) => ({
    title: r.routeName,
    description: `Bus ${r.busNumber} · Contact ${r.contact}`,
    href: '/transport-service',
    type: 'Transport',
  }));

  return [
    ...staticPages,
    ...facultyItems,
    ...programItems,
    ...researchAreaItems,
    ...labItems,
    ...newsItems,
    ...eventItems,
    ...noticeItems,
    ...galleryItems,
    ...faqItems,
    ...clubItems,
    ...alumniItems,
    ...researchItems,
    ...transportItems,
  ];
});

// search() lives in '@/lib/search' so client bundles can use it
// without pulling the Prisma transitive dep from this file.
