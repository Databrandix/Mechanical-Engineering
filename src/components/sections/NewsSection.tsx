'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import {news} from '../../lib/data';
import {Calendar, ArrowRight} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function NewsSection() {
  const mainNews = news.find(n => n.isMain) || news[0];
  const otherNews = news.filter(n => !n.isMain);

  return (
    <section className="py-8 md:py-16 bg-gray-50 border-t border-gray-100">
      <Container>
        <SectionTitle 
          title="Latest News" 
          subtitle="Stay updated with the recent breakthroughs, campus highlights, and academic achievements from the heart of our community."
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Featured News */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-3/5 group cursor-pointer"
          >
            <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] relative overflow-hidden">
                <img
                  src={mainNews.image}
                  alt={mainNews.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-accent px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-white font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  {mainNews.category}
                </div>
              </div>
              <div className="p-6 md:p-8 lg:p-10 bg-white flex-1 flex flex-col justify-center border-t border-gray-100">
                <div className="flex items-center gap-2 text-secondary-dark/40 text-sm mb-3 md:mb-4">
                  <Calendar size={16} />
                  <span>{mainNews.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-primary mb-4 md:mb-6 leading-tight group-hover:text-accent transition-colors">
                  {mainNews.title}
                </h3>
                <div className="flex justify-end mt-auto">
                   <Button variant="outline" className="group/btn">
                     Read Full Story
                     <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smaller News List */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            {otherNews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 md:gap-6 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center gap-2 overflow-hidden">
                   <div className="flex items-center gap-2 text-secondary-dark/40 text-[10px] uppercase font-bold tracking-widest">
                     <span className="text-accent">•</span>
                     <span>{item.category}</span>
                     <span>|</span>
                     <span>{item.date}</span>
                   </div>
                   <h4 className="text-primary font-display font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                     {item.title}
                   </h4>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4 flex justify-center lg:justify-end"
            >
               <Button variant="ghost" className="text-accent font-bold group">
                 Explore News Archive
                 <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
               </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
