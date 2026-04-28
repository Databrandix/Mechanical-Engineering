'use client';

import {useEffect, useRef, useState} from 'react';
import {motion} from 'motion/react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import {labs} from '../../lib/data';
import {ChevronLeft, ChevronRight, MapPin} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function ResearchLabsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  // Auto-slider: advance every 4s, loop back to start at end. Pauses on hover.
  useEffect(() => {
    if (isPaused) return;
    const intervalId = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const firstCard = el.querySelector<HTMLElement>('[data-lab-card]');
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 24;
      const step = firstCard.offsetWidth + gap;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    }, 4000);
    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-lab-card]');
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 24;
    const step = firstCard.offsetWidth + gap;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <Container>
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div className="max-w-2xl">
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-2">Research That Advances Technology</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">Cutting-Edge Research & Labs</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous labs"
              className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next labs"
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pt-4 pb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {labs.map((lab, idx) => (
            <motion.div
              key={lab.id}
              data-lab-card
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className="snap-start shrink-0 w-[78%] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] h-[460px] md:h-[500px] relative rounded-3xl overflow-hidden group shadow-xl"
            >
              <img
                src={lab.image}
                alt={lab.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-2 leading-tight">{lab.name}</h3>
                <div className="flex items-start gap-2 text-white/70 text-sm">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-accent" />
                  <span>{lab.location}</span>
                </div>
                <div className="mt-6 flex justify-end">
                   <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer">
                     <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
