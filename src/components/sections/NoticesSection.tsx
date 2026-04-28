'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import {notices} from '../../lib/data';
import {ChevronRight, Eye} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function NoticesSection() {
  return (
    <section className="py-8 md:py-16 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4 leading-tight">
            Academic Notices & Announcements
          </h2>
          <p className="text-white/70 text-base md:text-lg">
            Each card links to full program details—including curriculum, admissions requirements, and faculty contacts.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {notices.map((notice, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-4 md:p-6 lg:p-8 hover:bg-white/10 transition-colors border-b border-white/10 last:border-0 group cursor-pointer`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 lg:gap-12 flex-1 min-w-0">
                <span className="text-accent text-sm md:text-base font-bold md:min-w-[120px] shrink-0">{notice.date}</span>
                <h3 className="text-white font-medium text-base md:text-lg leading-snug group-hover:text-accent transition-colors">
                  {notice.title}
                </h3>
              </div>
              <div className="shrink-0 ml-3 md:ml-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Eye size={20} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center">
           <Button variant="yellow" className="px-10 py-3 group">
             View All Notices
             <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
           </Button>
        </div>
      </Container>
    </section>
  );
}
