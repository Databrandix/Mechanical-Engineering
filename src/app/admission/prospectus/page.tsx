'use client';

import { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

type Level = 'Undergraduate' | 'Postgraduate';

interface Program {
  slug: string;
  title: string;
  shortTitle: string;
  department: string;
  level: Level;
  cover: string;
  pdf: string;
}

const programs: Program[] = [
  {
    slug: 'bsc-mechanical-engineering',
    title: 'B.Sc. in Mechanical Engineering',
    shortTitle: 'B. Sc. in Mechanical Engineering',
    department: 'Mechanical Engineering',
    level: 'Undergraduate',
    cover: '/assets/prospectus-me-cover.jpeg',
    pdf: '/assets/prospectus-me.pdf',
  },
];

const filters: ('All' | Level)[] = ['All', 'Undergraduate', 'Postgraduate'];

export default function ProspectusPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<'All' | Level>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (active !== 'All' && p.level !== active) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q)
      );
    });
  }, [query, active]);

  return (
    <PageShell
      title="Prospectus"
      overline="Admission"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
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
              placeholder="Search programs..."
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
          {filtered.length === 1 ? 'program' : 'programs'}
        </p>

        {/* Program cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No programs match your search.</p>
          </div>
        ) : (
          <div
            className={
              filtered.length === 1
                ? 'flex justify-center'
                : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {filtered.map((p) => (
              <article
                key={p.slug}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col ${
                  filtered.length === 1 ? 'w-full max-w-md' : ''
                }`}
              >
                {/* Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={p.cover} alt={p.title} className="w-full h-full object-contain" />
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 ${
                      p.level === 'Undergraduate'
                        ? 'bg-primary/8 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {p.level}
                  </span>

                  <h3 className="font-display text-base md:text-lg font-bold text-primary leading-snug mb-1">
                    {p.shortTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">{p.department}</p>

                  <a
                    href={p.pdf}
                    download
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-md transition-colors"
                  >
                    <Download size={16} />
                    Download
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
