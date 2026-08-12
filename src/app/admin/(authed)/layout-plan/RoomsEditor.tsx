'use client';

import { useActionState, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  createRoomAction,
  deleteRoomAction,
  updateRoomAction,
  type ActionResult,
} from '@/lib/admin-actions/layout-plan';

export type RoomRow = {
  id: string;
  name: string;
  room: string;
  building: string;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

const initial = { ok: null } as ActionResult | { ok: null };

function Feedback({ state }: { state: ActionResult | { ok: null } }) {
  if (state.ok === null) return null;
  return state.ok ? (
    <span className="text-xs font-medium text-green-700">Saved</span>
  ) : (
    <span className="text-xs font-medium text-red-600">{state.error}</span>
  );
}

function RoomRowForm({ row }: { row: RoomRow }) {
  const [state, action, pending] = useActionState(updateRoomAction.bind(null, row.id), initial);
  const [deleting, setDeleting] = useState(false);

  return (
    <form action={action} className="grid grid-cols-1 gap-2 border-b border-gray-100 py-3 md:grid-cols-[1fr_130px_190px_auto] md:items-center">
      <input name="name" defaultValue={row.name} className={inputClass} aria-label="Room name" />
      <input name="room" defaultValue={row.room} className={inputClass} aria-label="Room number" />
      <input name="building" defaultValue={row.building} className={inputClass} aria-label="Building" />
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
            if (!confirm(`Remove "${row.name}" from the layout plan?`)) return;
            setDeleting(true);
            const result = await deleteRoomAction(row.id);
            if (!result.ok) {
              alert(result.error);
              setDeleting(false);
            }
          }}
          className="rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
          aria-label={`Delete ${row.name}`}
        >
          <Trash2 size={14} />
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

function AddRoomForm() {
  const [state, action, pending] = useActionState(createRoomAction, initial);

  return (
    <form
      action={action}
      key={state.ok === true ? 'reset' : 'form'}
      className="grid grid-cols-1 gap-2 pt-4 md:grid-cols-[1fr_130px_190px_auto] md:items-center"
    >
      <input name="name" placeholder="Office of the Registrar" className={inputClass} aria-label="Room name" required />
      <input name="room" placeholder="507" className={inputClass} aria-label="Room number" required />
      <input name="building" placeholder="147/I Green Road" className={inputClass} aria-label="Building" required />
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

export default function RoomsEditor({ rooms }: { rooms: RoomRow[] }) {
  return (
    <div>
      <div className="hidden gap-2 border-b border-gray-200 pb-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase md:grid md:grid-cols-[1fr_130px_190px_auto]">
        <span>Offices and Classrooms</span>
        <span>Room No</span>
        <span>Building</span>
        <span />
      </div>

      {rooms.map((row) => (
        <RoomRowForm key={row.id} row={row} />
      ))}

      <AddRoomForm />
    </div>
  );
}
