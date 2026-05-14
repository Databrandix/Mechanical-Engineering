import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';

export const metadata = { title: 'Manage Admins' };

export default async function UsersPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const role = (session.user.role ?? 'admin') as 'super_admin' | 'admin';

  if (role !== 'super_admin') {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h1 className="text-xl font-display font-bold text-red-700">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          The “Manage Admins” area is restricted to <strong>super_admin</strong>{' '}
          users. Your account has the <code>admin</code> role.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900">
        Manage Admins
      </h1>
      <p className="mt-2 text-sm text-gray-500 italic">
        List, create, edit, delete admin users with safety-rule enforcement —
        coming in Sub-step 5.3.
      </p>
    </div>
  );
}
