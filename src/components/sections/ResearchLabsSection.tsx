'use client';

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
  return (
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <Container>
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div className="max-w-2xl">
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-2">Research That Advances Technology</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">Cutting-Edge Research & Labs</h2>
          </div>
          <div className="flex gap-4 hidden md:flex">
            <button className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <ChevronLeft size={24} />
            </button>
            <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {labs.map((lab, idx) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative min-w-[300px] md:min-w-[380px] h-[500px] rounded-3xl overflow-hidden group shadow-xl"
            >
              <img 
                src={lab.image} 
                alt={lab.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-accent/20 backdrop-blur-md w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-white/20">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
                <h3 className="text-white text-2xl font-display font-bold mb-2">{lab.name}</h3>
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
