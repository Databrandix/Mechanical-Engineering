import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import LandingForm from './LandingForm';
import SectionForm from './SectionForm';
import StandardsEditor from './StandardsEditor';

export const metadata = { title: 'Service Charter (CMS)' };

export default async function ServiceCharterAdminPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const [sections, standards, landing] = await Promise.all([
    prisma.serviceCharterSection.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.serviceStandard.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.serviceCharterLanding.findUnique({ where: { id: 'singleton' } }),
  ]);

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="font-display text-2xl font-bold text-gray-900">Service Charter</h1>
        <p className="mt-1 text-sm text-gray-500">
          The charter on <code className="font-mono">/student-society/service-charter</code> — its
          sections, the service standards table, and the document itself.
        </p>
      </header>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Page and document
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
          <LandingForm
            row={{
              intro: landing?.intro ?? '',
              pdfUrl: landing?.pdfUrl ?? null,
              pdfFileName: landing?.pdfFileName ?? null,
            }}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Service standards
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {standards.length} {standards.length === 1 ? 'service' : 'services'} · the table inside
            section 8
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
          <StandardsEditor standards={standards} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Sections</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {sections.length} sections · open one to edit it
          </p>
        </div>
        <div className="space-y-2">
          {sections.map((s) => (
            <SectionForm
              key={s.id}
              row={{
                id: s.id,
                serial: s.serial,
                title: s.title,
                paragraphs: s.paragraphs,
                bullets: s.bullets,
                groups: s.groups,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
