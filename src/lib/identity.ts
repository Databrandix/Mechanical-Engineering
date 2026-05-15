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
