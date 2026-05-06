'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import {researchAreas} from '../../lib/data';
import {ChevronRight, Flame, Waves, Bot, Wrench, Layers, Leaf, Car} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const IconMap: any = {
  Flame, Waves, Bot, Wrench, Layers, Leaf, Car
};

export default function MajorResearchSection() {
  return (
    <section className="py-8 md:py-16 bg-gray-50 border-y border-gray-100">
      <Container>
        <SectionTitle 
          title="Major Research Area" 
          centered
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left Grid Area */}
          <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {researchAreas.map((area, idx) => {
              const Icon = IconMap[area.icon];
              return (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5, backgroundColor: '#ffffff' }}
                  className="p-4 md:p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center items-center text-center gap-3 md:gap-4 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {Icon && <Icon size={24} />}
                  </div>
                  <h4 className="font-display font-semibold text-primary leading-tight text-sm">
                    {area.name}
                  </h4>
                </motion.div>
              );
            })}
          </div>

          {/* Right Featured Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3 relative rounded-2xl md:rounded-[32px] overflow-hidden group shadow-2xl min-h-[360px] md:min-h-[480px] lg:min-h-0"
          >
            <img
              src="/assets/research-featured.jpg"
              alt="Research spotlight"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/10 group-hover:via-primary/65 group-hover:to-primary/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-accent/90 text-white text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider">
                Featured Insight
              </span>
              <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-3 md:mb-4">
                Robotics & Industrial Automation
              </h3>
              <p className="text-white/70 text-sm mb-4 md:mb-6 leading-relaxed">
                This research cell operates at the intersection of mechanical design and intelligent control, building autonomous systems for next-generation manufacturing...
              </p>
              <a
                href="/research"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02]"
              >
                Read More
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
