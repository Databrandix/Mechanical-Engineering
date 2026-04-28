'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import {campusServices} from '../../lib/data';
import {ChevronRight} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function ServicesSection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <Container>
        <SectionTitle 
          title="Essential Campus Services" 
          subtitle="Quick links to hostels, buses, financial aid, and activities—because study is only part of the story."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {campusServices.map((service, idx) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group rounded-[28px] overflow-hidden shadow-xl aspect-[10/14] border border-gray-100"
            >
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-xl font-display font-bold mb-2 transition-colors group-hover:text-accent">
                  {service.name}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
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
