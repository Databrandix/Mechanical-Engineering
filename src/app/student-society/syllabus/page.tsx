'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

type Level = 'Undergraduate' | 'Postgraduate';

interface SyllabusItem {
  slug: string;
  title: string;
  shortTitle: string;
  department: string;
  level: Level;
  cover: string;
  pdf: string;
  summary: string;
}

const syllabi: SyllabusItem[] = [
  {
    slug: 'bsc-mechanical-engineering',
    title: 'B.Sc. in Mechanical Engineering',
    shortTitle: 'B. Sc. in Mechanical Engineering',
    department: 'Mechanical Engineering',
    level: 'Undergraduate',
    cover: '/assets/syllabus-me-cover.png',
    pdf: '/assets/syllabus-me.pdf',
    summary:
      'Detailed course-by-course syllabus covering the four-year B.Sc. programme — Thermal Engineering, Design & Manufacturing, Automotive Engineering, Robotics & Automation, Materials Science, and Renewable Energy Systems.',
  },
];

const filters: ('All' | Level)[] = ['All', 'Undergraduate', 'Postgraduate'];

export default function SyllabusPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<'All' | Level>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return syllabi.filter((s) => {
      if (active !== 'All' && s.level !== active) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q)
      );
    });
  }, [query, active]);

  return (
    <PageShell title="Syllabus" overline="Student" image="/assets/syllabus-hero.jpg" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            Course-by-course syllabus for the Department of Mechanical Engineering. Download the official PDF for detailed credit distribution, course outcomes, and reference materials.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search syllabi..."
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActive(f)}
                  className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-accent hover:text-accent'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Showing <span className="font-semibold text-primary">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'syllabus' : 'syllabi'}
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            {active === 'Postgraduate' && !query ? (
              <>
                <p className="text-primary font-semibold text-base mb-1">
                  Postgraduate syllabus coming soon
                </p>
                <p className="text-gray-500 text-sm">
                  Postgraduate programs in Mechanical Engineering are not offered yet. Please check back later for updates.
                </p>
              </>
            ) : (
              <p className="text-gray-500">No syllabi match your search.</p>
            )}
          </div>
        ) : (
          <div
            className={
              filtered.length === 1
                ? 'flex justify-center'
                : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {filtered.map((s) => (
              <article
                key={s.slug}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col ${
                  filtered.length === 1 ? 'w-full max-w-md' : ''
                }`}
              >
                <div className="bg-gray-50">
                  <Image
                    src={s.cover}
                    alt={s.title}
                    width={600}
                    height={800}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="block w-full h-auto"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 ${
                      s.level === 'Undergraduate'
                        ? 'bg-primary/8 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {s.level}
                  </span>

                  <h3 className="font-display text-base md:text-lg font-bold text-primary leading-snug mb-1">
                    {s.shortTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{s.department}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-5">{s.summary}</p>

                  <a
                    href={s.pdf}
                    download
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-md transition-colors"
                  >
                    <Download size={16} />
                    Download Syllabus
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </PageShell>
  );
}
