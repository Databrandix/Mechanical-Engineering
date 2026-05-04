'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { labs } from '@/lib/labs-data';

export default function LabFacilityPage() {
  const [activeSlug, setActiveSlug] = useState(labs[0].slug);
  const active = labs.find((l) => l.slug === activeSlug) ?? labs[0];

  // On mount and on hashchange, sync the selected lab with the URL hash
  // so /about/lab-facility#fluid-mechanics-lab opens the right card.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && labs.some((l) => l.slug === hash)) {
        setActiveSlug(hash);
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const selectLab = (slug: string) => {
    setActiveSlug(slug);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${slug}`);
    }
  };

  return (
    <PageShell
      title="Lab Facilities"
      overline="About"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            The Department of Mechanical Engineering provides international-standard education through a combination of theory and hands-on practical sessions. Our specialised laboratories are equipped with modern machinery and tools to prepare students for the global engineering market.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar — lab list */}
          <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
            <h3 className="px-3 pt-2 pb-3 text-[11px] font-bold tracking-[0.25em] uppercase text-gray-500 border-b border-gray-100 mb-2">
              Laboratories
            </h3>
            <ul className="space-y-1">
              {labs.map((lab) => {
                const isActive = lab.slug === activeSlug;
                return (
                  <li key={lab.slug}>
                    <button
                      type="button"
                      onClick={() => selectLab(lab.slug)}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-accent/5 hover:text-accent'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isActive ? 'bg-button-yellow' : 'bg-gray-300'
                        }`}
                      />
                      <span className="flex-1">{lab.name}</span>
                      {isActive && <ChevronRight size={14} className="opacity-80" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main — selected lab detail */}
          <article
            key={active.slug}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10"
          >
            <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-md mb-4">
              Laboratory
            </span>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight mb-3">
              {active.name}
            </h2>

            <p className="text-base md:text-lg text-accent font-medium mb-6">{active.tagline}</p>

            <p className="text-[15px] md:text-base text-gray-700 leading-[1.85] mb-8">
              {active.description}
            </p>

            {active.heroImage && (
              <div className="rounded-xl overflow-hidden border border-gray-100 mb-8">
                <img
                  src={active.heroImage}
                  alt={active.name}
                  className="block w-full h-auto"
                />
              </div>
            )}

            {active.gallery && active.gallery.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold text-primary mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {active.gallery.map((src) => (
                    <div
                      key={src}
                      className="rounded-lg overflow-hidden border border-gray-100 aspect-[4/3] bg-gray-50"
                    >
                      <img
                        src={src}
                        alt={`${active.name} gallery image`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </Container>
    </PageShell>
  );
}
