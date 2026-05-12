'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Tag, Calendar, Clock, ArrowRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import {
  events,
  eventCategories,
  type EventCategory,
  type EventStatus,
} from '@/lib/events-data';

type Filter = 'All' | EventStatus | EventCategory;

const statusFilters: ('All' | EventStatus)[] = ['All', 'Current', 'Upcoming'];

const categoryStyles: Record<EventCategory, string> = {
  Sports: 'bg-emerald-100 text-emerald-700',
  'Industrial Visit': 'bg-amber-100 text-amber-700',
  Achievement: 'bg-violet-100 text-violet-700',
  Partnership: 'bg-sky-100 text-sky-700',
  Seminar: 'bg-rose-100 text-rose-700',
  Exhibition: 'bg-primary/10 text-primary',
};

const statusStyles: Record<EventStatus, string> = {
  Past: 'bg-gray-200 text-gray-700',
  Current: 'bg-primary/10 text-primary',
  Upcoming: 'bg-accent/10 text-accent',
};

export default function EventsPage() {
  const [active, setActive] = useState<Filter>('All');

  const filtered = useMemo(() => {
    if (active === 'All') return events;
    return events.filter(
      (e) => e.status === (active as EventStatus) || e.category === (active as EventCategory),
    );
  }, [active]);

  return (
    <PageShell title="Events" overline="Student" image="/assets/events-hero.webp" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-gray-600 mr-1">Filter by:</span>
          {statusFilters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-accent hover:text-accent'
                }`}
              >
                {f === 'Current' ? 'Current Events' : f}
              </button>
            );
          })}
          {eventCategories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-accent hover:text-accent'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Showing <span className="font-semibold text-primary">{filtered.length}</span>{' '}
          of <span className="font-semibold text-primary">{events.length}</span>{' '}
          {events.length === 1 ? 'event' : 'events'}
        </p>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No events match this filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ev) => (
              <article
                key={ev.slug}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={ev.image}
                    alt={ev.shortTitle}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm ${statusStyles[ev.status]} bg-white/95`}
                  >
                    <Tag size={12} />
                    {ev.status === 'Current' ? 'Current Events' : ev.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-3">
                    {ev.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-accent" />
                        {ev.date}
                      </span>
                    )}
                    {ev.time && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-accent" />
                        {ev.time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base md:text-lg font-bold text-primary leading-snug mb-2 line-clamp-2">
                    {ev.shortTitle}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {ev.summary}
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${categoryStyles[ev.category]}`}
                    >
                      {ev.category}
                    </span>
                    <a
                      href={`/student-society/events/${ev.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:text-accent text-sm font-bold transition-colors"
                    >
                      View Details
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </PageShell>
  );
}
