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
