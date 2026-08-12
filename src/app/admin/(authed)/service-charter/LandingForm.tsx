'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateCharterLandingAction, type ActionResult } from '@/lib/admin-actions/service-charter';

export type LandingRow = {
  intro: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

export default function LandingForm({ row }: { row: LandingRow }) {
  const [state, action, pending] = useActionState(
    updateCharterLandingAction,
    { ok: null } as ActionResult | { ok: null },
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="intro" className="mb-1 block text-xs font-medium text-gray-700">
          Intro — the line under the page title
        </label>
        <textarea id="intro" name="intro" rows={3} defaultValue={row.intro} className={inputClass} />
      </div>

      <div>
        <label htmlFor="pdfUrl" className="mb-1 block text-xs font-medium text-gray-700">
          PDF URL
        </label>
        <input id="pdfUrl" name="pdfUrl" defaultValue={row.pdfUrl ?? ''} className={`${inputClass} font-mono`} />
        <p className="mt-1 text-xs text-gray-400">
          The file name carries a hash of its contents, so a new charter means a new name. Run{' '}
          <code className="font-mono">scripts/import-service-charter.mjs</code> with the new PDF and
          it writes the path here.
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
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          Save
        </button>
        {state.ok === true && <span className="text-sm text-green-700">Saved</span>}
        {state.ok === false && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
