'use client';

import { useActionState, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  createServiceStandardAction,
  deleteServiceStandardAction,
  updateServiceStandardAction,
  type ActionResult,
} from '@/lib/admin-actions/service-charter';

export type StandardRow = {
  id: string;
  service: string;
  responsibleOffice: string;
  processingTime: string;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

const initial = { ok: null } as ActionResult | { ok: null };
const grid = 'grid grid-cols-1 gap-2 md:grid-cols-[1fr_210px_210px_auto] md:items-center';

function Feedback({ state }: { state: ActionResult | { ok: null } }) {
  if (state.ok === null) return null;
  return state.ok ? (
    <span className="text-xs font-medium text-green-700">Saved</span>
  ) : (
    <span className="text-xs font-medium text-red-600">{state.error}</span>
  );
}

function StandardRowForm({ row }: { row: StandardRow }) {
  const [state, action, pending] = useActionState(
    updateServiceStandardAction.bind(null, row.id),
    initial,
  );
  const [deleting, setDeleting] = useState(false);

  return (
    <form action={action} className={`${grid} border-b border-gray-100 py-3`}>
      <input name="service" defaultValue={row.service} className={inputClass} aria-label="Service" />
      <input
        name="responsibleOffice"
        defaultValue={row.responsibleOffice}
        className={inputClass}
        aria-label="Responsible office"
      />
      <input
        name="processingTime"
        defaultValue={row.processingTime}
        className={inputClass}
        aria-label="Processing time"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={async () => {
            if (!confirm(`Remove "${row.service}" from the service standards?`)) return;
            setDeleting(true);
            const result = await deleteServiceStandardAction(row.id);
            if (!result.ok) {
              alert(result.error);
              setDeleting(false);
            }
          }}
          className="rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
          aria-label={`Delete ${row.service}`}
        >
          <Trash2 size={14} />
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

function AddStandardForm() {
  const [state, action, pending] = useActionState(createServiceStandardAction, initial);

  return (
    <form action={action} key={state.ok === true ? 'reset' : 'form'} className={`${grid} pt-4`}>
      <input name="service" placeholder="Bonafide / Student Certificate" className={inputClass} aria-label="Service" required />
      <input name="responsibleOffice" placeholder="Department Office" className={inputClass} aria-label="Responsible office" required />
      <input name="processingTime" placeholder="2 working days" className={inputClass} aria-label="Processing time" required />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export default function StandardsEditor({ standards }: { standards: StandardRow[] }) {
  return (
    <div>
      <div className={`${grid} hidden border-b border-gray-200 pb-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase md:grid`}>
        <span>Service</span>
        <span>Responsible Office</span>
        <span>Processing Time</span>
        <span />
      </div>
      {standards.map((row) => (
        <StandardRowForm key={row.id} row={row} />
      ))}
      <AddStandardForm />
    </div>
  );
}
