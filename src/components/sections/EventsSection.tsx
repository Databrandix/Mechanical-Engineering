'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import {events} from '../../lib/data';
import {ArrowUpRight, Calendar} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function EventsSection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <Container>
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <SectionTitle 
            title="Departmental Events" 
            subtitle="From hands-on workshops to breakthrough announcements—never miss what's shaping tomorrow's innovations at ME."
          />
          <Button variant="ghost" className="mb-6 md:mb-8 group hidden md:flex">
            View All Events
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-premium flex flex-col group"
            >
              <div className="h-52 relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                  <Calendar size={14} className="text-accent" />
                  <span className="text-xs font-bold text-primary">{event.date}</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-display font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <p className="text-secondary-dark/60 text-sm mb-8 flex-1 leading-relaxed line-clamp-3">
                  {event.description}
                </p>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                   <button className="text-primary font-bold text-sm flex items-center gap-1 group/btn">
                     View Details
                     <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
