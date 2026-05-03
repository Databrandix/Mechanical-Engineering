'use client';

import { useMemo, useState } from 'react';
import {
  Tag,
  Building2,
  Calendar,
  ExternalLink,
  Download,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { notices, type NoticeCategory } from '@/lib/notices-data';

const filters: ('All' | NoticeCategory)[] = ['All', 'Academic', 'Holiday', 'Transport'];

const categoryStyles: Record<NoticeCategory, string> = {
  Academic: 'bg-primary/10 text-primary',
  Holiday: 'bg-accent/10 text-accent',
  Transport: 'bg-amber-100 text-amber-700',
};

export default function NoticeBoardPage() {
  const [active, setActive] = useState<'All' | NoticeCategory>('All');

  const filtered = useMemo(
    () => (active === 'All' ? notices : notices.filter((n) => n.category === active)),
    [active],
  );

  return (
    <PageShell
      title="Notice Board"
      overline="Student"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {filters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
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

        <p className="text-sm text-gray-500 mb-8">
          Showing <span className="font-semibold text-primary">{filtered.length}</span> of{' '}
          <span className="font-semibold text-primary">{notices.length}</span>{' '}
          {notices.length === 1 ? 'notice' : 'notices'}
        </p>

        {/* Notice cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No notices match this filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((n) => (
              <article
                key={n.slug}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 md:p-7"
              >
                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-bold text-primary uppercase leading-snug mb-3">
                  {n.title}
                </h3>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-100">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag size={14} className="text-gray-400" />
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${categoryStyles[n.category]}`}
                    >
                      {n.category}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-400" />
                    {n.department}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {n.date}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-gray-50/70 rounded-lg p-5 mb-5 text-[15px] text-gray-700 leading-[1.85]">
                  {n.description}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={n.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-md transition-colors"
                  >
                    {n.fileType === 'pdf' ? <FileText size={16} /> : <ImageIcon size={16} />}
                    View Full Notice
                    <ExternalLink size={14} className="opacity-80" />
                  </a>

                  <a
                    href={n.file}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold rounded-md transition-colors"
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
