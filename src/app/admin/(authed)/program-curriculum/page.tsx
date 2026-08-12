import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import CurriculumDocumentForm from './CurriculumDocumentForm';

export const metadata = { title: 'Course Curriculum (CMS)' };

type Course = { code?: unknown; title?: unknown; total?: unknown };
type Semester = { name?: unknown; credits?: unknown; courses?: unknown };

export default async function ProgramCurriculumAdminPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');

  const rows = await prisma.programCurriculum.findMany({
    include: { program: { select: { programName: true, degreeCode: true } } },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold text-gray-900">Course Curriculum</h1>
        <p className="mt-1 text-sm text-gray-500">
          The semester tables on <code className="font-mono">/programs/[degree code]</code>, and
          the PDF beneath them.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No curriculum yet. Run{' '}
          <code className="font-mono">
            node --env-file=.env scripts/import-curriculum.mjs &lt;guide book.docx&gt;
          </code>
          .
        </div>
      ) : (
        rows.map((row) => {
          const semesters = (Array.isArray(row.semesters) ? row.semesters : []) as Semester[];
          const courses = semesters.reduce(
            (n, s) => n + (Array.isArray(s.courses) ? s.courses.length : 0),
            0,
          );

          return (
            <section key={row.id} className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="font-display text-base font-bold text-primary">
                  {row.program.programName}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {row.program.degreeCode} · {semesters.length} semesters · {courses} courses
                </p>

                {/* Read-only on purpose. These tables are transcribed from the
                    department's guide book by the importer, and a seventy-row
                    course list edited by hand in a browser is how a credit
                    total quietly stops matching the document. Issue a new
                    guide book and re-run the importer. */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Semesters as imported
                  </summary>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                    {semesters.map((s, i) => (
                      <li key={String(s.name ?? i)} className="flex justify-between gap-4">
                        <span>{String(s.name ?? '')}</span>
                        <span className="shrink-0 tabular-nums text-gray-400">
                          {Array.isArray(s.courses) ? s.courses.length : 0} courses ·{' '}
                          {String(s.credits ?? '')} credits
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                    Course tables come from the guide book, not from this screen. To change them,
                    re-run{' '}
                    <code className="font-mono">scripts/import-curriculum.mjs</code> with the new
                    document — it re-reads every semester and reports any table whose credits do
                    not add up.
                  </p>
                </details>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  The PDF
                </h3>
                <CurriculumDocumentForm
                  row={{ id: row.id, pdfUrl: row.pdfUrl, pdfFileName: row.pdfFileName }}
                />
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
