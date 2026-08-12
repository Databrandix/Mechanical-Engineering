'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import { programCurriculumDocumentUpdateSchema } from '@/lib/validation';

export type ActionResult = { ok: true } | { ok: false; error: string };

function emptyToNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

/**
 * The course tables are not editable here — they are transcribed from the
 * department's guide book by scripts/import-curriculum.mjs, which also
 * generates this PDF and writes its path. This action edits the two fields
 * around it, so a hand-placed file can still be pointed at.
 */
export async function updateCurriculumDocumentAction(
  id: string,
  _prev: ActionResult | { ok: null },
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: 'Not authenticated' };

  const parsed = programCurriculumDocumentUpdateSchema.safeParse({
    pdfUrl: emptyToNull(formData.get('pdfUrl')),
    pdfFileName: emptyToNull(formData.get('pdfFileName')),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.map(String).join('.') || '(root)'}: ${i.message}`)
        .join('; '),
    };
  }

  try {
    await prisma.programCurriculum.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if ((e as { code?: string })?.code === 'P2025') {
      return { ok: false, error: 'Curriculum not found' };
    }
    return { ok: false, error: e instanceof Error ? e.message : 'Database error' };
  }

  revalidatePath('/admin/program-curriculum');
  revalidatePath('/programs', 'layout');
  revalidatePath('/admin');
  return { ok: true };
}
