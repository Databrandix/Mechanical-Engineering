import { cache } from 'react';
import { prisma } from '@/lib/db';

// React.cache() makes the per-request fetch deduplicated across
// every Server Component that calls it during a single render
// pass. Layout + page + sections share ONE DB hit.

export const getDepartmentIdentity = cache(async () => {
  const dept = await prisma.departmentIdentity.findUnique({
    where: { id: 'singleton' },
  });
  if (!dept) {
    throw new Error(
      'DepartmentIdentity row missing (id="singleton"). Run `npm run db:seed`.',
    );
  }
  return dept;
});

export const getUniversityIdentity = cache(async () => {
  const uni = await prisma.universityIdentity.findUnique({
    where: { id: 'singleton' },
  });
  if (!uni) {
    throw new Error(
      'UniversityIdentity row missing (id="singleton"). Run `npm run db:seed`.',
    );
  }
  return uni;
});

// List entities — return arrays (possibly empty; no throw). Sorted by
// displayOrder ascending; admin reorder UI writes this column. The
// explicit `select` keeps the payload narrow (drops createdAt /
// updatedAt Date fields that would otherwise need serialization
// when these arrays cross into client components).

export const getPrograms = cache(async () => {
  return prisma.program.findMany({
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      programName: true,
      degreeCode: true,
      duration: true,
      description: true,
      imageUrl: true,
      specializations: true,
      cta: true,
    },
  });
});

export const getResearchAreas = cache(async () => {
  return prisma.researchArea.findMany({
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      iconName: true,
      iconUrl: true,
      areaName: true,
      description: true,
      isFeatured: true,
      featuredHeading: true,
      featuredImageUrl: true,
      featuredDescription: true,
      featuredCtaHref: true,
    },
  });
});

// Programs — extended in Phase 3 to include ctaHref. The
// original getPrograms select stays narrow (drops ctaHref) for
// backward compat where callers only need the visible content;
// new helper getProgramsForHome includes ctaHref for the
// homepage Programs CTA render.
export const getProgramsWithCta = cache(async () => {
  return prisma.program.findMany({
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      programName: true,
      degreeCode: true,
      duration: true,
      description: true,
      imageUrl: true,
      specializations: true,
      cta: true,
      ctaHref: true,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
//  Chrome — Phase 3
//    Navbar (top_link, quick_access_item, main_nav_group + items)
//    Footer (4 link tables)
//    All cache()-wrapped so layout + children share one DB hit each.
// ─────────────────────────────────────────────────────────────────

export const getTopLinks = cache(async () => {
  return prisma.topLink.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
  });
});

export const getQuickAccessItems = cache(async () => {
  return prisma.quickAccessItem.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, iconName: true, isExternal: true, isDisabled: true },
  });
});

export const getMainNav = cache(async () => {
  return prisma.mainNavGroup.findMany({
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      name: true,
      href: true,
      hasDropdown: true,
      title: true,
      items: {
        orderBy: { displayOrder: 'asc' },
        select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
      },
    },
  });
});

export const getFooterUsefulLinks = cache(async () => {
  return prisma.footerUsefulLink.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
  });
});

export const getFooterGetInTouchLinks = cache(async () => {
  return prisma.footerGetInTouchLink.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
  });
});

export const getFooterQuickLinks = cache(async () => {
  return prisma.footerQuickLink.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
  });
});

export const getFooterLegalLinks = cache(async () => {
  return prisma.footerLegalLink.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, href: true, isExternal: true, isDisabled: true },
  });
});

// ─────────────────────────────────────────────────────────────────
//  About pages — Phase 4 (3 singletons)
//    Each is a full row including the Json content fields so the
//    public page can render without further DB calls.
// ─────────────────────────────────────────────────────────────────

export const getAboutOverview = cache(async () => {
  return prisma.aboutOverview.findUnique({ where: { id: 'singleton' } });
});

export const getAboutMissionVision = cache(async () => {
  return prisma.aboutMissionVision.findUnique({ where: { id: 'singleton' } });
});

export const getAboutMechaClub = cache(async () => {
  return prisma.aboutMechaClub.findUnique({ where: { id: 'singleton' } });
});

// Faculty (Phase 2). Full rows are returned — including Json
// section content + Dean/Head message extras — so the public
// pages can render every section without per-page Prisma calls.
// React.cache wraps each helper so multiple Server Components
// in the same request share a single DB hit.

export const getFacultyList = cache(async () => {
  return prisma.faculty.findMany({
    orderBy: { displayOrder: 'asc' },
  });
});

export const getFacultyBySlug = cache(async (slug: string) => {
  return prisma.faculty.findUnique({ where: { slug } });
});

export const getFacultySlugs = cache(async () => {
  const rows = await prisma.faculty.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
});

export const getDean = cache(async () => {
  return prisma.faculty.findFirst({ where: { isDean: true } });
});

export const getHead = cache(async () => {
  return prisma.faculty.findFirst({ where: { isHead: true } });
});
