import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  MapPin,
  Users,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { getResearchPaperCount, getResearchPapers, getPageHero } from '@/lib/identity';

export const metadata = {
  title: 'Research — Department of Mechanical Engineering',
  description:
    'Published research papers from the Department of Mechanical Engineering, Sonargaon University.',
};

/* Twenty to a page. */
const PAGE_SIZE = 20;

type SearchParams = Promise<{ page?: string | string[] }>;

type PaperLink = { label: string; value: string };

/** Json column — nothing at the database level guarantees its shape. */
function paperLinks(value: unknown): PaperLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((l): l is Record<string, unknown> => typeof l === 'object' && l !== null)
    .map((l) => ({
      label: typeof l.label === 'string' ? l.label : 'Link',
      value: typeof l.value === 'string' ? l.value : '',
    }))
    .filter((l) => /^https?:\/\//i.test(l.value));
}

export default async function ResearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const total = await getResearchPaperCount();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  /* Clamped rather than redirected: a page number past the end shows the last
     page instead of an empty one, and clamping keeps it a plain 200 — an old
     link in someone's history should not turn into an error. */
  const pageNum = Math.min(Math.max(1, Number(raw) || 1), totalPages);
  const skip = (pageNum - 1) * PAGE_SIZE;

  const [papers, hero] = await Promise.all([
    getResearchPapers({ skip, take: PAGE_SIZE }),
    getPageHero('research'),
  ]);

  return (
    <PageShell
      title={hero?.heroTitle ?? 'Research Publications'}
      subtitle={hero?.heroSubtitle ?? undefined}
      overline={hero?.heroOverline ?? 'Academic Excellence'}
      image={hero?.heroImageUrl ?? undefined}
      imagePosition={hero ? `center ${hero.heroImageVerticalPercent}%` : undefined}
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-14">
          <p className="text-[15px] md:text-[16px] leading-[1.85] text-gray-700">
            A selection of research publications by faculty and students of the
            Department of Mechanical Engineering, Sonargaon University, spanning
            thermodynamics, fluid mechanics, materials science, energy systems,
            and more.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-primary bg-primary/5 px-4 py-1.5 rounded-full">
            <FileText size={14} />
            {total} Publications
          </p>
        </div>

        {papers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No research papers yet.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl grid gap-5 md:gap-6 lg:grid-cols-2">
            {papers.map((paper, idx) => (
              <article
                key={paper.id}
                className="flex gap-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-5 md:p-6"
              >
                <div className="shrink-0">
                  {/* Numbered across the whole list, not within the page: the
                      21st publication is the 21st on page two too. */}
                  <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-[15px]">
                    {skip + idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] md:text-[16px] font-bold leading-snug text-primary mb-3">
                    {paper.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3 text-[12.5px]">
                    {paper.date && (
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <Calendar size={13} className="text-accent" />
                        {paper.date}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2 mb-2 text-[13px] leading-[1.6]">
                    <Users size={13} className="shrink-0 mt-1 text-accent" />
                    <span className="text-gray-700 font-medium">{paper.authors}</span>
                  </div>

                  <div className="flex items-start gap-2 text-[12.5px] leading-[1.6]">
                    <MapPin size={13} className="shrink-0 mt-1 text-gray-400" />
                    <span className="text-gray-500">{paper.area}</span>
                  </div>

                  {paperLinks(paper.links).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                      {paperLinks(paper.links).map((link) => (
                        <a
                          key={link.value}
                          href={link.value}
                          target="_blank"
                          /* nofollow as well as noopener: these point at
                             publishers and DOI resolvers the department does
                             not vouch for, and there is no reason to pass them
                             ranking credit. */
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent bg-accent/5 hover:bg-accent/10 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <ExternalLink size={11} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Publications pagination"
            className="mt-10 md:mt-14 flex items-center justify-center gap-2"
          >
            {pageNum > 1 ? (
              <Link
                href={pageNum === 2 ? '/research' : `/research?page=${pageNum - 1}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </Link>
            ) : (
              /* Present but inert on the first page, so the row does not shift
                 sideways as you page through. */
              <span
                aria-disabled="true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </span>
            )}

            <span className="px-4 text-sm text-gray-600">
              Page <span className="font-semibold text-primary">{pageNum}</span> of {totalPages}
            </span>

            {pageNum < totalPages ? (
              <Link
                href={`/research?page=${pageNum + 1}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </span>
            )}
          </nav>
        )}
      </Container>
    </PageShell>
  );
}
