'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import {
  serviceCharterLandingUpdateSchema,
  serviceCharterSectionUpdateSchema,
  serviceStandardCreateSchema,
  serviceStandardUpdateSchema,
} from '@/lib/validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

function getStr(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function getAll(fd: FormData, key: string): string[] {
  return fd.getAll(key).filter((v): v is string => typeof v === 'string' && v.trim() !== '');
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

function revalidateCharterSurfaces() {
  revalidatePath('/student-society/service-charter');
  revalidatePath('/admin/service-charter');
  revalidatePath('/admin');
}

/* zod reports a path as PropertyKey[]; a symbol never appears for these
   schemas, but the type admits one, so it is stringified. */
function issues(error: { issues: readonly { path: PropertyKey[]; message: string }[] }) {
  return error.issues
    .map((i) => `${i.path.map(String).join('.') || '(root)'}: ${i.message}`)
    .join('; ');
}

export async function updateCharterSectionAction(
  id: string,
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  /* HeadingBodyListEditor posts the whole list as one JSON field. A malformed
     value is treated as an empty list and then rejected by the schema, rather
     than throwing out of the action with a parse error. */
  let groups: unknown = [];
  try {
    groups = JSON.parse(getStr(formData, 'groups') || '[]');
  } catch {
    return { ok: false, error: 'groups: could not be read' };
  }

  const parsed = serviceCharterSectionUpdateSchema.safeParse({
    serial: getStr(formData, 'serial'),
    title: getStr(formData, 'title'),
    paragraphs: getAll(formData, 'paragraphs'),
    bullets: getAll(formData, 'bullets'),
    groups,
  });
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  try {
    await prisma.serviceCharterSection.update({
      where: { id },
      data: {
        serial: parsed.data.serial,
        title: parsed.data.title,
        paragraphs: parsed.data.paragraphs,
        bullets: parsed.data.bullets,
        groups: parsed.data.groups,
      },
    });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Section not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateCharterSurfaces();
  return { ok: true };
}

function readStandard(formData: FormData) {
  return {
    service: getStr(formData, 'service'),
    responsibleOffice: getStr(formData, 'responsibleOffice'),
    processingTime: getStr(formData, 'processingTime'),
  };
}

export async function createServiceStandardAction(
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = serviceStandardCreateSchema.safeParse(readStandard(formData));
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  const last = await prisma.serviceStandard.findFirst({
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true },
  });

  try {
    await prisma.serviceStandard.create({
      data: { ...parsed.data, displayOrder: (last?.displayOrder ?? 0) + 1 },
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateCharterSurfaces();
  return { ok: true };
}

export async function updateServiceStandardAction(
  id: string,
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = serviceStandardUpdateSchema.safeParse(readStandard(formData));
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  try {
    await prisma.serviceStandard.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Service not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateCharterSurfaces();
  return { ok: true };
}

export async function deleteServiceStandardAction(id: string): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    await prisma.serviceStandard.delete({ where: { id } });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') return { ok: false, error: 'Service not found' };
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateCharterSurfaces();
  return { ok: true };
}

export async function updateCharterLandingAction(
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return denied;

  const parsed = serviceCharterLandingUpdateSchema.safeParse({
    intro: getStr(formData, 'intro'),
    pdfUrl: emptyToNull(formData.get('pdfUrl')),
    pdfFileName: emptyToNull(formData.get('pdfFileName')),
  });
  if (!parsed.success) return { ok: false, error: issues(parsed.error) };

  try {
    await prisma.serviceCharterLanding.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...parsed.data },
      update: parsed.data,
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }
  revalidateCharterSurfaces();
  return { ok: true };
}
