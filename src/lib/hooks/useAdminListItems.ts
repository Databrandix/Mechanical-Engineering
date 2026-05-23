'use client';

import { useEffect, useState } from 'react';

type WithId = { id: string };

// Admin list pattern — Server Component fetches rows via Prisma and
// passes them to a client list. After a successful delete we used to
// rely on router.refresh() alone, but Next.js 15 + Vercel routing
// cache occasionally serves a stale RSC payload so the deleted row
// stayed visible until the user hit reload (chair-reported).
//
// This hook holds a local mirror of the items prop and exposes
// removeById() for instant optimistic removal. The useEffect resync
// pulls in any fresh data once router.refresh() (still called by
// callers for server-side cache invalidation) does return, and also
// catches navigation-back / create-then-redirect flows where new
// items appear in props.
export function useAdminListItems<T extends WithId>(initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  function removeById(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return { items, setItems, removeById };
}
