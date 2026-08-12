import { notFound } from 'next/navigation';
import { Clock, GraduationCap, Layers } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import CurriculumSection, {
  type CreditRow,
  type Semester,
} from '@/components/programs/CurriculumSection';
import { getPageHero, getProgramBySlug, getProgramCurriculumBySlug } from '@/lib/identity';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: 'Program — Department of Mechanical Engineering' };
  return {
    title: `${program.programName} — Department of Mechanical Engineering`,
    description: program.description.slice(0, 300),
  };
}

/* Json columns — read defensively, since nothing at the database level
   guarantees their shape. */
function semesters(value: unknown): Semester[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((s): s is Record<string, unknown> => typeof s === 'object' && s !== null)
    .map((s) => ({
      name: typeof s.name === 'string' ? s.name : '',
      credits: typeof s.credits === 'number' ? s.credits : 0,
      courses: Array.isArray(s.courses)
        ? s.courses
            .filter((c): c is Record<string, unknown> => typeof c === 'object' && c !== null)
            .map((c) => ({
              serial: typeof c.serial === 'number' ? c.serial : 0,
              code: typeof c.code === 'string' ? c.code : '',
              title: typeof c.title === 'string' ? c.title : '',
              theory: typeof c.theory === 'number' ? c.theory : 0,
              sessional: typeof c.sessional === 'number' ? c.sessional : 0,
              total: typeof c.total === 'number' ? c.total : 0,
            }))
        : [],
    }))
    .filter((s) => s.name !== '');
}

function creditRows(value: unknown): CreditRow[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null)
    .map((r) => ({
      semester: typeof r.semester === 'string' ? r.semester : '',
      theory: typeof r.theory === 'number' ? r.theory : 0,
      sessional: typeof r.sessional === 'number' ? r.sessional : 0,
      total: typeof r.total === 'number' ? r.total : 0,
      cumulative: typeof r.cumulative === 'number' ? r.cumulative : 0,
    }))
    .filter((r) => r.semester !== '');
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [program, curriculum, hero] = await Promise.all([
    getProgramBySlug(slug),
    getProgramCurriculumBySlug(slug),
    getPageHero(`program-${slug.toLowerCase()}`),
  ]);

  if (!program) notFound();

  const list = semesters(curriculum?.semesters);
  const rows = creditRows(curriculum?.creditRows);
  const totalCredits = rows.length > 0 ? rows[rows.length - 1].cumulative : 0;

  const facts = [
    { icon: GraduationCap, label: 'Degree', value: program.degreeCode },
    { icon: Clock, label: 'Duration', value: program.duration },
    ...(totalCredits > 0
      ? [{ icon: Layers, label: 'Credits', value: `${totalCredits}` }]
      : []),
  ];

  return (
    <PageShell
      title={hero?.heroTitle ?? program.programName}
      subtitle={hero?.heroSubtitle ?? undefined}
      overline={hero?.heroOverline ?? 'Programs'}
      image={hero?.heroImageUrl ?? program.imageUrl ?? undefined}
      imagePosition={hero ? `center ${hero.heroImageVerticalPercent}%` : undefined}
      contentClassName=""
    >
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[15px] leading-[1.9] text-gray-700">{program.description}</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <fact.icon size={20} className="mx-auto mb-2 text-accent" aria-hidden />
                <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  {fact.label}
                </p>
                <p className="font-display mt-0.5 text-lg font-bold text-primary">{fact.value}</p>
              </div>
            ))}
          </div>

          {program.specializations.length > 0 && (
            <div className="mx-auto mt-12 max-w-4xl">
              <h2 className="font-display mb-5 text-center text-xl font-bold text-primary md:text-2xl">
                Specializations
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {program.specializations.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <span className="mt-[7px] size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="text-[15px] text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <CurriculumSection
        semesters={list}
        creditRows={rows}
        pdfUrl={curriculum?.pdfUrl ?? null}
        pdfFileName={curriculum?.pdfFileName ?? null}
      />
    </PageShell>
  );
}
