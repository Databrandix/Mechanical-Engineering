import {
  Flame,
  Droplets,
  Wrench,
  Hammer,
  PenTool,
  Zap,
  ShieldCheck,
  Cog,
  FlaskConical,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Laboratory Facility — Department of Mechanical Engineering',
  description:
    'Hands-on laboratories of the Department of Mechanical Engineering at Sonargaon University — thermodynamics, fluid mechanics, machine shop, materials, CAD, and welding.',
};

const labs = [
  {
    Icon: Flame,
    title: 'Applied Thermodynamics & Heat Engine Laboratory',
    description:
      'Dedicated to the study of energy conversion and thermal systems. Students explore the mechanics of power generation and the operational cycles of various engines.',
    keyLabel: 'Key Equipment',
    keyItems:
      'Multi-cylinder petrol and diesel engines, steam generator models, and bomb calorimeters.',
    focus:
      'Internal Combustion (IC) engine performance, thermal efficiency, and combustion analysis.',
  },
  {
    Icon: Droplets,
    title: 'Fluid Mechanics & Hydraulic Machinery Lab',
    description:
      'Fluid dynamics is essential to everything from piping systems to aerospace. This lab provides the tools to measure and analyze the behaviour of liquids and gases.',
    keyLabel: 'Key Equipment',
    keyItems:
      "Bernoulli's theorem apparatus, Orifice meters, Venturi meters, and centrifugal pump test rigs.",
    focus:
      'Flow measurement, pressure drops, and the operational characteristics of hydraulic turbines.',
  },
  {
    Icon: Wrench,
    title: 'Central Machine Shop & Manufacturing Lab',
    description:
      'A cornerstone of the department, the Machine Shop provides a rigorous introduction to industrial manufacturing processes and precision engineering.',
    keyLabel: 'Key Equipment',
    keyItems:
      'Industrial-grade Lathe machines, Milling machines, Shaper machines, and Radial drilling machines.',
    focus: 'Precision machining, tool geometry, and metal fabrication techniques.',
  },
  {
    Icon: Hammer,
    title: 'Mechanics of Materials Lab',
    description:
      'Ensuring structural integrity is a primary duty of a mechanical engineer. This lab allows students to test the physical limits of engineering materials.',
    keyLabel: 'Key Equipment',
    keyItems:
      'Universal Testing Machine (UTM), Torsion testing machine, and Rockwell/Brinell Hardness testers.',
    focus: 'Stress-strain analysis, tensile strength, elasticity, and material fatigue.',
  },
  {
    Icon: PenTool,
    title: 'Engineering Drawing & CAD/CAM Studio',
    description:
      'Bridging the gap between concept and reality, our computing studio is equipped with industry-standard software for modern design.',
    keyLabel: 'Key Software',
    keyItems: 'AutoCAD, SolidWorks, and ANSYS.',
    focus: '2D technical drafting, 3D solid modelling, and Finite Element Analysis (FEA).',
  },
  {
    Icon: Zap,
    title: 'Welding & Metal Joining Laboratory',
    description:
      'This lab focuses on the metallurgy and techniques of joining materials — essential for heavy industry and structural construction.',
    keyLabel: 'Key Processes',
    keyItems:
      'Electric Arc welding, Oxy-Acetylene gas welding, and TIG/MIG welding setups.',
    focus: 'Weld pool dynamics, structural bonding, and safety protocols in fabrication.',
  },
];

const features = [
  {
    Icon: Cog,
    title: 'Industry-Standard Equipment',
    text: 'Access to machinery used in modern manufacturing and power plants.',
  },
  {
    Icon: ShieldCheck,
    title: 'Safety-First Environment',
    text: 'All labs are managed by expert technicians ensuring a secure learning environment.',
  },
  {
    Icon: FlaskConical,
    title: 'Research Driven',
    text: 'Facilities support senior design projects (Capstone) and faculty-led research in renewable energy and robotics.',
  },
];

export default function LaboratoryFacilityPage() {
  return (
    <PageShell title="Laboratory Facility" overline="About" image="/assets/lab-hero.webp" imagePosition="center 25%" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            The Department of Mechanical Engineering at Sonargaon University is committed to excellence in hands-on technical education. Our laboratories serve as the hub for innovation, where students apply complex thermodynamic, fluidic, and structural theories to real-world engineering challenges.
          </p>
        </div>

        {/* Lab cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16 md:mb-20">
          {labs.map((lab, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <article
                key={lab.title}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-accent/30 hover:-translate-y-1 overflow-hidden"
              >
                {/* Top color band */}
                <div className="h-1 gradient-blue-magenta" />

                <div className="p-6 md:p-7">
                  {/* Icon + number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md text-white group-hover:scale-110 transition-transform">
                      <lab.Icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="font-display text-3xl font-bold text-primary/15 leading-none">
                      {num}
                    </span>
                  </div>

                  <h3 className="font-display text-lg md:text-[19px] font-bold text-primary mb-3 leading-snug">
                    {lab.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{lab.description}</p>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-primary text-[10px] uppercase tracking-[0.15em]">
                        {lab.keyLabel}
                      </span>
                      <p className="text-gray-700 mt-1 leading-relaxed">{lab.keyItems}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="font-semibold text-accent text-[10px] uppercase tracking-[0.15em]">
                        Learning Focus
                      </span>
                      <p className="text-gray-700 mt-1 leading-relaxed">{lab.focus}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Why Our Labs Matter */}
        <div className="relative bg-primary text-white rounded-2xl shadow-2xl">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative p-5 md:p-12 lg:p-14">
            <div className="text-center mb-10">
              <span className="inline-block text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
                What Sets Us Apart
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Why Our Labs Matter
              </h2>
              <div className="mt-3 mx-auto h-1 w-16 bg-button-yellow rounded-full" />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map(({ Icon, title, text }) => (
                <div key={title} className="text-center">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-button-yellow/15 border border-button-yellow/40 items-center justify-center shadow-lg mb-4">
                    <Icon size={28} className="text-button-yellow" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
