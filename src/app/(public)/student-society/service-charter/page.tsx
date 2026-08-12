import { Download, FileText } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import {
  getPageHero,
  getServiceCharterLanding,
  getServiceCharterSections,
  getServiceStandards,
} from '@/lib/identity';
import { withAttachmentDownload } from '@/lib/pdf-helpers';

export const metadata = {
  title: 'Service Charter — Department of Mechanical Engineering',
  description:
    'What the Department of Mechanical Engineering commits to: its services, who is responsible for each, how long they take, and how to raise a concern.',
};

/** The serial the department gives its service-standards table. */
const STANDARDS_SECTION = 8;

type Group = { heading: string; body: string };

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim() !== '');
}

function groups(value: unknown): Group[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null)
    .map((v) => ({
      heading: typeof v.heading === 'string' ? v.heading : '',
      body: typeof v.body === 'string' ? v.body : '',
    }))
    .filter((v) => v.heading !== '' || v.body !== '');
}

/** One item per line — the shape the admin editor writes. */
const lines = (body: string) =>
  body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[15px] leading-[1.7] text-gray-700">
          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ServiceCharterPage() {
  const [sections, standards, landing, hero] = await Promise.all([
    getServiceCharterSections(),
    getServiceStandards(),
    getServiceCharterLanding(),
    getPageHero('student-society-service-charter'),
  ]);

  return (
    <PageShell
      title={hero?.heroTitle ?? 'Service Charter'}
      subtitle={hero?.heroSubtitle ?? undefined}
      overline={hero?.heroOverline ?? 'Student Society'}
      image={hero?.heroImageUrl ?? undefined}
      imagePosition={hero ? `center ${hero.heroImageVerticalPercent}%` : undefined}
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        {landing?.intro && (
          <p className="mx-auto mb-10 max-w-3xl text-center text-[15px] leading-[1.85] text-gray-700 md:mb-14">
            {landing.intro}
          </p>
        )}

        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">The service charter will be published soon.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-5 md:space-y-6">
            {sections.map((section) => {
              const paragraphs = strings(section.paragraphs);
              const bullets = strings(section.bullets);
              const named = groups(section.groups);
              const showsStandards = section.serial === STANDARDS_SECTION && standards.length > 0;

              return (
                <article
                  key={section.id}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
                >
                  <header className="mb-4 flex items-start gap-3">
                    <span className="font-display inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-white">
                      {section.serial}
                    </span>
                    <h2 className="mt-1 text-[17px] leading-snug font-bold text-primary md:text-lg">
                      {section.title}
                    </h2>
                  </header>

                  {paragraphs.length > 0 && (
                    <div className="mb-4 space-y-3 text-[15px] leading-[1.85] text-gray-700">
                      {paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  )}

                  {bullets.length > 0 && <Bullets items={bullets} />}

                  {named.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {named.map((group) => (
                        <div key={group.heading}>
                          <h3 className="mb-2 text-[13px] font-bold tracking-wider text-accent uppercase">
                            {group.heading}
                          </h3>
                          <ul className="space-y-1.5">
                            {lines(group.body).map((item) => (
                              <li
                                key={item}
                                className="flex gap-2.5 text-[14.5px] leading-[1.7] text-gray-700"
                              >
                                <span
                                  className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gray-300"
                                  aria-hidden
                                />
                                <span className="min-w-0">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section 8 is a table in the document, and the processing
                      times are the part a student comes here for, so it is
                      rendered as one rather than flattened into a list. */}
                  {showsStandards && (
                    <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-left text-[14.5px]">
                        <caption className="sr-only">
                          Each service, the office responsible, and how long it takes
                        </caption>
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50 text-[12px] font-bold tracking-wider text-gray-500 uppercase">
                            <th scope="col" className="w-full px-4 py-2.5">
                              Service
                            </th>
                            <th scope="col" className="px-4 py-2.5 whitespace-nowrap">
                              Responsible Office
                            </th>
                            <th scope="col" className="px-4 py-2.5 whitespace-nowrap">
                              Processing Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {standards.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 last:border-b-0">
                              <td className="px-4 py-3 font-medium text-gray-800">{row.service}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                {row.responsibleOffice}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                {row.processingTime}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {landing?.pdfUrl && (
          <div className="mx-auto mt-12 max-w-5xl md:mt-16">
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-white to-white p-6 text-center shadow-sm sm:flex-row sm:p-8 sm:text-left">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                <FileText size={26} strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[17px] font-bold text-primary md:text-lg">
                  Service Charter as a PDF
                </p>
                <p className="mt-0.5 text-[14.5px] text-gray-600">
                  The charter as the department issued it — in one document you can keep or print.
                </p>
              </div>
              <a
                href={withAttachmentDownload(landing.pdfUrl)}
                download={landing.pdfFileName ?? undefined}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
              >
                <Download size={18} aria-hidden />
                Download PDF
              </a>
            </div>
          </div>
        )}
      </Container>
    </PageShell>
  );
}
