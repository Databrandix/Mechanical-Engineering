'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUserAction } from '@/lib/admin-actions/users';

export default function DeleteUserButton({
  userId,
  userName,
  isSelf,
}: {
  userId: string;
  userName: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const prompt = isSelf
      ? `Delete YOUR OWN account (${userName})?\n\nIf you are the only active super_admin this will be blocked. Otherwise you will be signed out immediately.\n\nThis cannot be undone.`
      : `Delete admin "${userName}"?\n\nAll of their sessions will be revoked and the credential account removed.\n\nThis cannot be undone.`;
    if (!window.confirm(prompt)) return;

    startTransition(async () => {
      const res = await deleteUserAction(userId);
      if (res.ok) {
        toast.success('Admin deleted');
        // Navigate back to the list. If self-deleted, middleware will
        // redirect to /admin/login on the next protected fetch.
        router.push('/admin/users');
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      <Trash2 size={16} />
      {pending ? 'Deleting…' : isSelf ? 'Delete my account' : 'Delete admin'}
    </button>
  );
}
