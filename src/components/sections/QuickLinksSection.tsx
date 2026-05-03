'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import {quickLinks} from '../../lib/data';
import {Link as LinkIcon} from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function QuickLinksSection() {
  return (
    <section id="admission" className="py-8 md:py-16 bg-white overflow-hidden border-b border-gray-100">
      <Container>
        <div className="flex items-center gap-4 mb-6 md:mb-8">
           <LinkIcon className="text-accent" size={24} />
           <h3 className="text-xl font-display font-bold text-primary uppercase tracking-wider">Quick Links</h3>
        </div>
        
        <div className="flex overflow-x-auto pt-3 pb-4 gap-4 no-scrollbar -mx-4 px-4 sm:-mx-2 sm:px-2">
          {quickLinks.map((link, idx) => (
            <motion.a
              key={link.name}
              href={link.href}
              {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 px-8 py-3 bg-gray-50 border border-gray-200 rounded-full text-secondary-dark font-medium shadow-sm whitespace-nowrap transition-colors duration-300 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:border-transparent hover:shadow-md"
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
