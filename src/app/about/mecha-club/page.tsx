import Image from 'next/image';
import {
  Factory,
  Laptop,
  Mic,
  Lightbulb,
  Sparkles,
  Users,
  Network,
  ArrowRight,
  Award,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Mecha Club — Department of Mechanical Engineering',
  description:
    'SU Mechanical Engineering Club (Mecha Club) — building industry-ready engineers through field visits, workshops, seminars, project showcases and an active alumni network.',
};

const activities = [
  {
    Icon: Factory,
    image: '/assets/mecha-field-visit.jpg',
    category: 'Industrial Exposure',
    title: 'Field Visits to Leading Plants',
    description:
      'Regularly organised industrial tours to power plants, textile machinery units and large-scale manufacturing facilities — giving students a firsthand look at real mechanical operations and management.',
  },
  {
    Icon: Laptop,
    image: '/assets/mecha-workshop.jpg',
    category: 'Skill Development',
    title: 'Hands-on Software Workshops',
    description:
      'Specialized training sessions on industry-standard engineering software including AutoCAD and SolidWorks, ensuring students are proficient in digital design before they graduate.',
  },
  {
    Icon: Mic,
    image: '/assets/mecha-seminar.jpg',
    category: 'Career Guidance',
    title: 'Seminars with Industry Experts',
    description:
      'Frequent seminars featuring industry leaders and corporate experts that provide insights into local and international job markets — manufacturing, energy, and the public sector.',
  },
  {
    Icon: Lightbulb,
    image: '/assets/mecha-project.jpg',
    category: 'Innovation',
    title: 'Project Showcases & Tech Fairs',
    description:
      'Students display engineering prototypes and innovative solutions during university-wide tech fairs and departmental exhibitions, sharpening their presentation and engineering skills.',
  },
  {
    Icon: Sparkles,
    image: '/assets/mecha-cocurricular.png',
    category: 'Community',
    title: 'Co-curricular Engagement',
    description:
      'Beyond technical skills — indoor games, cultural programs and study tours that foster a well-rounded university experience and strong bonding between batches.',
  },
  {
    Icon: Award,
    image: '/assets/mecha-appreciation.jpg',
    category: 'Recognition',
    title: 'Awards & Industry Recognition',
    description:
      'SUMEC was honoured as a Valuable Club Partner at ACI Motors-presented Auto Fest 2024 (organised by ME Association, BUET) — one of many recognitions earned through active participation, collaboration, and engineering excellence.',
  },
];

const stats = [
  { value: '100+', label: 'Active Members' },
  { value: '50+', label: 'Field Visits' },
  { value: '25+', label: 'Workshops Hosted' },
  { value: '10+', label: 'Industry Partners' },
];

export default function MechaClubPage() {
  return (
    <PageShell
      title="SU Mecha Club"
      overline="About"
      image="/assets/mecha-hero.png"
      imagePosition="center 30%"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro section */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-24">
          <div>
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-3">
              Where Engineering Meets Community
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight mb-5">
              Building Industry-Ready{' '}
              <span className="text-gradient">Mechanical Engineers</span>
            </h2>
            <p className="text-gray-700 leading-[1.85] mb-6">
              The Mechanical Engineering department at Sonargaon University fosters a vibrant student community through its dedicated club and organisational activities. We focus on transforming students into industry-ready professionals through continuous engagement and practical exposure.
            </p>
            <p className="text-gray-700 leading-[1.85]">
              From plant visits to international software training, the SU Mecha Club bridges classroom learning with the real world — equipping every member with the skills, network, and confidence to lead.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl md:text-3xl font-display font-bold text-primary">
                    {value}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[360px] md:h-[440px]">
              <Image
                src="/assets/mecha-club-1.jpg"
                alt="Mecha Club members"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Decorative accent box */}
            <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-button-yellow rounded-2xl -z-10 hidden lg:block" />
            <div className="absolute -top-5 -right-5 w-32 h-32 gradient-blue-magenta rounded-2xl -z-10 hidden lg:block" />
          </div>
        </section>

        {/* Activities section */}
        <section className="mb-16 md:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
              What We Do
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              Core Activities &amp; Initiatives
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <article
                key={activity.title}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-lg bg-white/95 backdrop-blur flex items-center justify-center shadow-md">
                    <activity.Icon size={20} className="text-accent" strokeWidth={1.75} />
                  </div>
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-accent/90 px-2.5 py-1 rounded-full">
                    {activity.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-primary leading-snug mb-3">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Building a Professional Network */}
        <section className="relative bg-primary text-white rounded-2xl shadow-2xl">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 md:p-12 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Network size={20} className="text-button-yellow" />
                <span className="text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase">
                  Beyond Graduation
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">
                Building a Professional Network
              </h2>
              <div className="h-1 w-16 bg-button-yellow rounded-full mb-6" />
              <p className="text-white/90 leading-[1.85] text-[15px] md:text-[16px] max-w-2xl">
                The Mecha Club community serves as a bridge between current students and the SU Alumni — creating an active professional network that opens doors to internships, job placements, and lifelong mentorship across the engineering industry.
              </p>
            </div>

            <div className="flex lg:flex-col gap-3 shrink-0">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-button-yellow text-primary font-bold rounded-md shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                <Users size={18} />
                Join the Club
              </a>
              <a
                href="http://sue.su.edu.bd:5081/sonargaon_erp/student/convocation_registration/alumni"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-md hover:bg-white hover:text-primary hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                Alumni Portal
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
