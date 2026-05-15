import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import Sidebar from '@/components/admin/Sidebar';

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const role = (session.user.role ?? 'admin') as 'super_admin' | 'admin';

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role,
        }}
      />
      <main className="flex-1 p-6 md:p-10 max-w-6xl">{children}</main>
    </div>
  );
}
