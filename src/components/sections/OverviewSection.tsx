'use client';

import {motion} from 'motion/react';
import Container from '../ui/Container';

export default function OverviewSection() {
  return (
    <section className="bg-white py-8 md:py-16">
      <Container className="!max-w-[1120px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8 text-center text-2xl font-bold leading-tight text-primary md:text-[25px]"
        >
          Department of Mechanical Engineering (ME)
        </motion.h2>

        <div className="mx-auto grid max-w-[1090px] items-start gap-12 lg:grid-cols-[520px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-justify text-[16px] font-medium leading-[1.75] tracking-[0.035em] text-black">
              The Department of Mechanical Engineering stands out for its diverse range of programs in Thermal Engineering, Design & Manufacturing, Automotive Engineering, Robotics & Automation, Materials Science, and Renewable Energy Systems. Our unique approach to education empowers students with the knowledge and skills needed to excel in the dynamic field of Mechanical Engineering. We foster a culture of hands-on learning by encouraging students to undertake challenging projects in our state-of-the-art workshops and labs, exposing them to industry-relevant practices.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <a
                href="#"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:shadow-premium"
              >
                Explore More
              </a>
              <a
                href="#"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:shadow-premium"
              >
                Dean's Message
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden"
          >
            <img
              src="/assets/site-school-1024x576.webp"
              alt="School students in computer lab"
              className="h-auto w-full object-cover lg:h-[294px]"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
