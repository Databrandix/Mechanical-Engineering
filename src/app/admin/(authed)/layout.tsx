import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
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

  // Phase 9 — sidebar badge count for unread contact submissions.
  // Single count() per admin nav render; cached via React server
  // component dedup if any child layer re-fetches.
  const newSubmissionCount = await prisma.contactSubmission.count({
    where: { status: 'new' },
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role,
        }}
        newSubmissionCount={newSubmissionCount}
      />
      <main className="flex-1 p-6 md:p-10 max-w-6xl">{children}</main>
    </div>
  );
}
