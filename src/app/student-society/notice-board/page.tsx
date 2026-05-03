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

type Category = 'Academic' | 'Holiday' | 'Transport';

interface Notice {
  slug: string;
  title: string;
  category: Category;
  department: string;
  date: string;
  description: string;
  file: string;
  fileType: 'image' | 'pdf';
}

const notices: Notice[] = [
  {
    slug: 'pre-registration-summer-2026',
    title: 'Pre-registration Notice for Summer-2026',
    category: 'Academic',
    department: 'Office of the Registrar',
    date: '03 Apr, 2026',
    description:
      'All students in the CSE, EEE, ME, CE, TE, BBA, MBA, RMBA, EMBA, MSCM, and MBM programs are instructed to complete their online pre-registration for the Summer-2026 semester through the ERP software. Completion is mandatory for attending classes and exams; students must clear previous dues before registering. Deadline: April 30, 2026 (without late fee); late fees apply from May 02 to June 06, 2026.',
    file: '/assets/notices/pre-registration-summer-2026.pdf',
    fileType: 'pdf',
  },
  {
    slug: 'final-registration-summer-2026',
    title: 'Final Registration Confirmation for Summer-2026',
    category: 'Academic',
    department: 'Office of the Registrar',
    date: '27 Apr, 2026',
    description:
      'Students who have completed pre-registration must confirm their final registration for Summer-2026 by May 10, 2026. Payments must include the fee for May 2026 and any previous outstanding balances. SMS-based support is available via WhatsApp for accounts, exams, and academic inquiries.',
    file: '/assets/notices/final-registration-summer-2026.jpeg',
    fileType: 'image',
  },
  {
    slug: 'ter-summer-2026',
    title: 'Mandatory Teacher Evaluation Rating (TER)',
    category: 'Academic',
    department: 'Office of the Registrar',
    date: '05 Apr, 2026',
    description:
      'All students must complete the Teacher Evaluation Rating (TER) for their respective course teachers via the ERP panel by April 20, 2026. Failure to submit the TER will prevent students from viewing their Final Semester exam results.',
    file: '/assets/notices/ter-summer-2026.jpeg',
    fileType: 'image',
  },
  {
    slug: 'bengali-new-year-1433',
    title: 'Bengali New Year 1433 Holiday',
    category: 'Holiday',
    department: 'Office of the Registrar',
    date: '11 Apr, 2026',
    description:
      'The university will remain closed on Tuesday, April 14, 2026, in observance of Bengali New Year 1433. All academic and administrative activities will resume on April 15, 2026.',
    file: '/assets/notices/bengali-new-year-1433.jpeg',
    fileType: 'image',
  },
  {
    slug: 'spring-2026-semester-break',
    title: 'Spring-2026 Semester Break',
    category: 'Holiday',
    department: 'Office of the Registrar',
    date: '26 Apr, 2026',
    description:
      'Departments including ME, CE, CSE, EEE, TE, and Business Administration will observe a semester break on April 29 and 30, 2026. Architecture, Law, NAME, Bangla, JMS, FDT, and AMT departments will remain active. Classes for Summer-2026 will officially commence on May 02, 2026, following the May Day holiday.',
    file: '/assets/notices/spring-2026-semester-break.jpeg',
    fileType: 'image',
  },
  {
    slug: 'savar-route-bus-service',
    title: 'Savar Route Bus Service Adjustment',
    category: 'Transport',
    department: 'Office of the Registrar',
    date: '07 Apr, 2026',
    description:
      'The university bus service for the Savar route will be suspended during the "Going" trip only on Thursday, April 09, 2026. Regular bus services will resume as scheduled on Saturday, April 11, 2026.',
    file: '/assets/notices/savar-route-bus-service.jpeg',
    fileType: 'image',
  },
];

const filters: ('All' | Category)[] = ['All', 'Academic', 'Holiday', 'Transport'];

const categoryStyles: Record<Category, string> = {
  Academic: 'bg-primary/10 text-primary',
  Holiday: 'bg-accent/10 text-accent',
  Transport: 'bg-amber-100 text-amber-700',
};

export default function NoticeBoardPage() {
  const [active, setActive] = useState<'All' | Category>('All');

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
