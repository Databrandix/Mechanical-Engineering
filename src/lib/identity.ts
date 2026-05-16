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
    },
  });
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
