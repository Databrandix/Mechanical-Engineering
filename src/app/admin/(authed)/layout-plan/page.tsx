import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import DocumentForm from './DocumentForm';
import RoomsEditor from './RoomsEditor';

export const metadata = { title: 'Layout Plan (CMS)' };

export default async function LayoutPlanAdminPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const [rooms, document] = await Promise.all([
    prisma.officeLocation.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.departmentLayout.findFirst({ orderBy: { displayOrder: 'asc' } }),
  ]);

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="font-display text-2xl font-bold text-gray-900">Layout Plan</h1>
        <p className="mt-1 text-sm text-gray-500">
          The rooms table and the downloadable plan on{' '}
          <code className="font-mono">/about/layout-plan</code>.
        </p>
      </header>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Rooms</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} · shown in this order on the page
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
          <RoomsEditor rooms={rooms} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            The document
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            The card beneath the table, with the plan itself.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
          {document ? (
            <DocumentForm
              row={{
                id: document.id,
                title: document.title,
                shortTitle: document.shortTitle,
                coverUrl: document.coverUrl,
                pdfUrl: document.pdfUrl,
                pdfFileName: document.pdfFileName,
              }}
            />
          ) : (
            /* Created by the build script rather than here: it is the script
               that copies the PDF in and names it after its own contents. */
            <p className="text-sm text-gray-500">
              No document yet. Run{' '}
              <code className="font-mono">
                node --env-file=.env scripts/build-layout-plan.mjs &lt;plan.pdf&gt;
              </code>{' '}
              to add one.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
