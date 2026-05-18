'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AdmissionNotice } from '@prisma/client';
import SortableList from '@/components/admin/SortableList';
import {
  deleteAdmissionNoticeAction,
  reorderAdmissionNoticesAction,
} from '@/lib/admin-actions/admission-notices';

export default function AdmissionNoticeList({ items }: { items: AdmissionNotice[] }) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    const res = await deleteAdmissionNoticeAction(id);
    if (res.ok) { toast.success('Notice deleted'); router.refresh(); }
    else toast.error(res.error);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No admission notices yet.</p>
        <Link href="/admin/admission-notices/new" className="text-accent hover:underline font-medium text-sm mt-2 inline-block">
          Add the first notice
        </Link>
      </div>
    );
  }

  return (
    <SortableList
      items={items}
      getId={(n) => n.id}
      onReorder={async (ids) => {
        const res = await reorderAdmissionNoticesAction(ids);
        if (!res.ok) throw new Error(res.error);
      }}
      renderItem={(n) => (
        <div className="flex items-center justify-between gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${n.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {n.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-[10px] font-mono text-gray-500">{n.refNo}</span>
              {n.fileUrl && <FileText size={14} className="text-accent" />}
            </div>
            <div className="font-medium text-gray-900 text-sm truncate">{n.subject}</div>
            <div className="text-xs text-gray-500 truncate">
              <span className="font-mono">/{n.slug}</span> · {n.displayDate ?? new Date(n.publishedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link href={`/admin/admission-notices/${n.id}`} aria-label="Edit notice"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40">
              <Pencil size={16} />
            </Link>
            <button type="button" onClick={() => handleDelete(n.id, n.subject)} aria-label="Delete notice"
                    className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    />
  );
}
