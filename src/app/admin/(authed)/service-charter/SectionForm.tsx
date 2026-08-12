'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import HeadingBodyListEditor from '@/components/admin/HeadingBodyListEditor';
import ParagraphsEditor from '@/components/admin/ParagraphsEditor';
import { updateCharterSectionAction, type ActionResult } from '@/lib/admin-actions/service-charter';

export type SectionRow = {
  id: string;
  serial: number;
  title: string;
  paragraphs: unknown;
  bullets: unknown;
  groups: unknown;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

export default function SectionForm({ row }: { row: SectionRow }) {
  const [state, action, pending] = useActionState(
    updateCharterSectionAction.bind(null, row.id),
    { ok: null } as ActionResult | { ok: null },
  );

  return (
    <details className="rounded-xl border border-gray-200 bg-white">
      <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-800">
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
          {row.serial}
        </span>
        {row.title}
      </summary>

      <form action={action} className="space-y-5 border-t border-gray-100 px-4 py-5">
        <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">No.</label>
            <input name="serial" type="number" defaultValue={row.serial} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Title</label>
            <input name="title" defaultValue={row.title} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Paragraphs — the prose before any list
          </label>
          <ParagraphsEditor name="paragraphs" initialValue={asStrings(row.paragraphs)} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Bullets — a flat list of points
          </label>
          <ParagraphsEditor name="bullets" initialValue={asStrings(row.bullets)} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Named lists — a heading with one item per line
          </label>
          <HeadingBodyListEditor
            name="groups"
            initialValue={row.groups}
            headingPlaceholder="Academic Services"
            bodyPlaceholder={'One item per line\nCourse registration support\nExamination management'}
            addButtonLabel="Add a named list"
            emptyHint="No named lists in this section."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {pending && <Loader2 size={15} className="animate-spin" />}
            Save section
          </button>
          {state.ok === true && <span className="text-sm text-green-700">Saved</span>}
          {state.ok === false && <span className="text-sm text-red-600">{state.error}</span>}
        </div>
      </form>
    </details>
  );
}
