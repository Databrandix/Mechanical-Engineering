'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateLayoutDocumentAction, type ActionResult } from '@/lib/admin-actions/layout-plan';

export type DocumentRow = {
  id: string;
  title: string;
  shortTitle: string;
  coverUrl: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

export default function DocumentForm({ row }: { row: DocumentRow }) {
  const [state, action, pending] = useActionState(
    updateLayoutDocumentAction.bind(null, row.id),
    { ok: null } as ActionResult | { ok: null },
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-medium text-gray-700">
          Title
        </label>
        <input id="title" name="title" defaultValue={row.title} className={inputClass} />
      </div>

      <div>
        <label htmlFor="shortTitle" className="mb-1 block text-xs font-medium text-gray-700">
          Short title — shown on the card
        </label>
        <input id="shortTitle" name="shortTitle" defaultValue={row.shortTitle} className={inputClass} />
      </div>

      <div>
        <label htmlFor="coverUrl" className="mb-1 block text-xs font-medium text-gray-700">
          Cover image URL
        </label>
        <input id="coverUrl" name="coverUrl" defaultValue={row.coverUrl} className={`${inputClass} font-mono`} />
      </div>

      <div>
        <label htmlFor="pdfUrl" className="mb-1 block text-xs font-medium text-gray-700">
          PDF URL
        </label>
        <input
          id="pdfUrl"
          name="pdfUrl"
          defaultValue={row.pdfUrl ?? ''}
          className={`${inputClass} font-mono`}
        />
        <p className="mt-1 text-xs text-gray-400">
          The file name carries a hash of its contents, so replacing the plan means a new name.
          Run <code className="font-mono">scripts/build-layout-plan.mjs</code> with the new PDF and
          it writes the path here for you.
        </p>
      </div>

      <div>
        <label htmlFor="pdfFileName" className="mb-1 block text-xs font-medium text-gray-700">
          Saved as
        </label>
        <input
          id="pdfFileName"
          name="pdfFileName"
          defaultValue={row.pdfFileName ?? ''}
          className={`${inputClass} font-mono`}
        />
        <p className="mt-1 text-xs text-gray-400">
          What a visitor&apos;s browser names the download — readable, without the hash.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          Save document
        </button>
        {state.ok === true && <span className="text-sm text-green-700">Saved</span>}
        {state.ok === false && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
