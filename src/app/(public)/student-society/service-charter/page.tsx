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
type Section = {
  id: string;
  serial: number;
  title: string;
  paragraphs: unknown;
  bullets: unknown;
  groups: unknown;
};
type Standard = {
  id: string;
  service: string;
  responsibleOffice: string;
  processingTime: string;
};

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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[15px] leading-[1.7] text-gray-700">
      <span className="bg-accent mt-[9px] size-1.5 shrink-0 rounded-full" aria-hidden />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function SectionCard({ section }: { section: Section }) {
  const paragraphs = strings(section.paragraphs);
  const bullets = strings(section.bullets);
  const named = groups(section.groups);

  return (
    <article className="mb-6 break-inside-avoid rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
      <header className="mb-4 flex items-start gap-3">
        <span className="bg-primary font-display inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white">
          {section.serial}
        </span>
        <h2 className="text-primary mt-1 text-[17px] leading-snug font-bold md:text-lg">
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

      {bullets.length > 0 && (
        <ul className="grid gap-y-2">
          {bullets.map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </ul>
      )}

      {named.length > 0 && (
        <div className="grid gap-5">
          {named.map((group) => (
            <div key={group.heading}>
              <h3 className="text-accent mb-2 text-[13px] font-bold tracking-wider uppercase">
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
    </article>
  );
}

/** Section 8: the table the whole page is really for. */
function StandardsCard({ section, standards }: { section: Section; standards: Standard[] }) {
  const paragraphs = strings(section.paragraphs);

  return (
    <article className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
      <header className="mb-4 flex items-start gap-3">
        <span className="bg-primary font-display inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white">
          {section.serial}
        </span>
        <h2 className="text-primary mt-1 text-[17px] leading-snug font-bold md:text-lg">
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

      <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{row.processingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default async function ServiceCharterPage() {
  const [sections, standards, landing, hero] = await Promise.all([
    getServiceCharterSections(),
    getServiceStandards(),
    getServiceCharterLanding(),
    getPageHero('student-society-service-charter'),
  ]);

  /* The document is numbered 1-15 and the table is number 8, so the page is
     laid out in three parts rather than one flow: the sections before it, the
     table at full width in its own place, then the sections after it. That
     keeps the numbering in order while giving thirteen rows of three columns
     the width they need to be read. */
  const withStandards = standards.length > 0;
  const before = sections.filter((s) => s.serial < STANDARDS_SECTION);
  const table = sections.find((s) => s.serial === STANDARDS_SECTION);
  const after = sections.filter((s) => s.serial > STANDARDS_SECTION);

  /* Columns, not a grid. These sections run from one sentence to six headed
     lists, and a grid lines their tops up in rows, leaving a band of empty
     white under every short one. CSS columns pack them by height instead. */
  const columns = 'columns-1 gap-6 lg:columns-2 xl:columns-3';

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
          <>
            <div className={columns}>
              {before.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>

            {table &&
              (withStandards ? (
                <StandardsCard section={table} standards={standards} />
              ) : (
                <div className="columns-1">
                  <SectionCard section={table} />
                </div>
              ))}

            <div className={columns}>
              {after.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          </>
        )}

        {landing?.pdfUrl && (
          <div className="mt-6 md:mt-8">
            <div className="border-primary/15 from-primary/5 flex flex-col items-center gap-5 rounded-2xl border bg-gradient-to-r via-white to-white p-6 text-center shadow-sm sm:flex-row sm:p-8 sm:text-left">
              <span className="from-primary to-accent inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md">
                <FileText size={26} strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-primary font-display text-[17px] font-bold md:text-lg">
                  Service Charter as a PDF
                </p>
                <p className="mt-0.5 text-[14.5px] text-gray-600">
                  The charter as the department issued it — in one document you can keep or print.
                </p>
              </div>
              <a
                href={withAttachmentDownload(landing.pdfUrl)}
                download={landing.pdfFileName ?? undefined}
                className="bg-primary hover:bg-primary/90 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-semibold text-white shadow-md transition-colors"
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
