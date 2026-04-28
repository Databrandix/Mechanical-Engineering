'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';
import {programs} from '../../lib/data';

export default function ProgramsSection() {
  return (
    <section className="bg-[#F2F2F2] py-8 md:py-16">
      <Container className="!max-w-[1120px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8 text-center text-2xl md:text-3xl font-bold text-primary"
        >
          Programmes Offered
        </motion.h2>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {programs.map((program, idx) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="flex flex-col"
            >
              <img
                src="/assets/site-school-1024x576.webp"
                alt={program.title}
                className="mb-8 h-[118px] w-full object-cover"
              />

              <h3 className="mb-4 text-[22px] font-bold text-primary">
                {program.title}
              </h3>

              <p className="mb-7 min-h-[92px] text-[17px] font-medium leading-[1.75] tracking-[0.02em] text-primary">
                {program.description}
              </p>

              <a
                href="#"
                className="mt-auto w-fit rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-center text-base font-bold text-white shadow-md transition-all hover:shadow-premium"
              >
                {program.cta}
              </a>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
