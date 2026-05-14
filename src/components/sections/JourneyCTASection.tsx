'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import Container from '../ui/Container';

export default function JourneyCTASection() {
  // Hide on /admin/* — admin UI doesn't need the public-site CTA.
  if (usePathname()?.startsWith('/admin')) return null;

  return (
    <section className="relative">
      {/* Hero image with overlays */}
      <div className="relative h-[420px] md:h-[480px] overflow-hidden">
        <Image
          src="/assets/journey-cta.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover [object-position:center_32%]"
        />
        {/* Right dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/75 to-transparent" />
        {/* Bottom fade for smooth transition to footer */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/90 to-transparent" />

        <Container className="relative z-10 h-full flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-xl text-white text-right"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Shape Your Future with Excellence
            </h2>
            <p className="text-base md:text-lg text-white/85 mb-8 leading-relaxed">
              Join a vibrant academic community where innovation, leadership, and lifelong learning shape your path to success.
            </p>
            <div className="flex flex-wrap gap-4 justify-end">
              <a
                href="http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-md shadow-xl transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Apply Now
              </a>
              <a
                href="/contact"
                className="px-7 py-3 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-md transition-all hover:-translate-y-0.5"
              >
                Request for Information
              </a>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Gradient divider — project theme colors */}
      <div className="h-1 gradient-blue-magenta shadow-[0_-4px_12px_rgba(204,21,121,0.25)]" />
    </section>
  );
}
