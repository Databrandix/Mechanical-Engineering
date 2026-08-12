'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import {
  departmentLayoutUpdateSchema,
  officeLocationCreateSchema,
  officeLocationUpdateSchema,
} from '@/lib/validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

function getStr(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

async function requireAuth(): Promise<ActionResult | null> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'Not authenticated' };
  return null;
}

function revalidateLayoutSurfaces() {
  revalidatePath('/about/layout-plan');
  revalidatePath('/admin/layout-plan');
  revalidatePath('/admin');
}

/* zod reports a path as PropertyKey[] — a symbol never appears for these
   object schemas, but the type admits one, so it is stringified rather than
   narrowed away. */
function issues(error: { issues: readonly { path: PropertyKey[]; message: string }[] }) {
  return error.issues
    .map((i) => `${i.path.map(String).join('.') || '(root)'}: ${i.message}`)
    .join('; ');
}

function readRoom(formData: FormData) {
  return {
    name: getStr(formData, 'name'),
    room: getStr(formData, 'room'),
    building: getStr(formData, 'building'),
  };
}

export async function createRoomAction(
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = officeLocationCreateSchema.safeParse(readRoom(formData));
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  const last = await prisma.officeLocation.findFirst({
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true },
  });

  try {
    await prisma.officeLocation.create({
      data: { ...parsed.data, displayOrder: (last?.displayOrder ?? 0) + 1 },
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateLayoutSurfaces();
  return { ok: true };
}

export async function updateRoomAction(
  id: string,
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = officeLocationUpdateSchema.safeParse(readRoom(formData));
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  try {
    await prisma.officeLocation.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Room not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateLayoutSurfaces();
  return { ok: true };
}

export async function deleteRoomAction(id: string): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    await prisma.officeLocation.delete({ where: { id } });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Room not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateLayoutSurfaces();
  return { ok: true };
}

/**
 * Reorder is all-or-nothing: the list has to name exactly the rooms that
 * exist, so a stale tab cannot renumber a table someone else has changed.
 */
export async function reorderRoomsAction(ids: string[]): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const existing = await prisma.officeLocation.findMany({ select: { id: true } });
  const existingIds = new Set(existing.map((r) => r.id));
  if (ids.length !== existingIds.size || !ids.every((id) => existingIds.has(id))) {
    return { ok: false, error: 'Reorder list must include exactly the existing rooms' };
  }

  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.officeLocation.update({ where: { id }, data: { displayOrder: index + 1 } }),
      ),
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateLayoutSurfaces();
  return { ok: true };
}

/**
 * The document card. The PDF itself is a bundled file whose name carries a
 * hash of its contents — replacing it means running
 * scripts/build-layout-plan.mjs, which writes the new path here. This form
 * edits what surrounds it.
 */
export async function updateLayoutDocumentAction(
  id: string,
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = departmentLayoutUpdateSchema.safeParse({
    title: getStr(formData, 'title'),
    shortTitle: getStr(formData, 'shortTitle'),
    coverUrl: getStr(formData, 'coverUrl'),
    pdfUrl: emptyToNull(formData.get('pdfUrl')),
    pdfFileName: emptyToNull(formData.get('pdfFileName')),
  });
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  try {
    await prisma.departmentLayout.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Document not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateLayoutSurfaces();
  return { ok: true };
}
