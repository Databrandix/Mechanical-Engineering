import {
  Users,
  HeartHandshake,
  Award,
  Building2,
  ListChecks,
  GraduationCap,
  Trophy,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Waiver & Scholarship — Department of Mechanical Engineering',
  description:
    'Tuition waivers and merit scholarships at Sonargaon University — eligibility, percentages, and how they apply.',
};

// ────────────────────────────── WAIVERS ──────────────────────────────

interface WaiverCategory {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  items: { heading: string; text: string }[];
  note?: string;
}

const waiverCategories: WaiverCategory[] = [
  {
    Icon: Users,
    title: 'University Staff & Dependent Waivers',
    items: [
      {
        heading: 'SU Staff (Academic & Administrative)',
        text: 'If permitted by the Head of Department and the Syndicate, the staff member receives a waiver on the Admission Fee only.',
      },
      {
        heading: 'Staff Dependents',
        text: '100% waiver of total fees / total package.',
      },
      {
        heading: 'Staff Close Relatives',
        text: 'Additional 10% waiver — limited to one student per semester and requires verification.',
      },
    ],
    note: 'Dependent waivers are cancelled if the staff member leaves SU permanently, but remain active if the staff member expires, suffers from a chronic disease, or is unable to work due to a major accident.',
  },
  {
    Icon: HeartHandshake,
    title: 'Family & Group Waivers',
    items: [
      {
        heading: 'Siblings / Spouse / Parent–Child',
        text: '10% waiver per student once the final family member is admitted — 2 students: 20% total, 3 students: 30% total.',
      },
      {
        heading: 'Group Waiver — General Programs',
        text: '3% waiver for groups of 2–4 people; 5% waiver for groups of 5 or more.',
      },
      {
        heading: 'Group Waiver — Specific Programs',
        text: '5% waiver applies to groups of 2 or more students for Architecture, Naval Architecture, and Journalism.',
      },
    ],
  },
  {
    Icon: Award,
    title: 'Special Quotas & Demographic Waivers',
    items: [
      {
        heading: 'Freedom Fighter Quota',
        text: '100% waiver on tuition fees. If applicants exceed 3%, a lottery is held — limited to one student per family.',
      },
      {
        heading: 'Female Students',
        text: '10% to 50% waiver on tuition fees upon proper application.',
      },
      {
        heading: 'Disability Quota',
        text: '10% waiver — the university reserves the right to amend this for special cases.',
      },
      {
        heading: 'Tribal Quota',
        text: '10% waiver.',
      },
      {
        heading: 'Instructor Quota',
        text: '10% waiver.',
      },
    ],
  },
  {
    Icon: Building2,
    title: 'Institutional & Fair Waivers',
    items: [
      {
        heading: 'SU Sister Concern Diploma Graduates (NIET, NPI, BIST)',
        text: 'Admission Fee: BDT 8,500 instead of the standard BDT 12,500 (BDT 4,000 waiver). Tuition fee includes a BDT 1,000 component.',
      },
      {
        heading: 'Admission Fair (Special Waiver)',
        text: 'BDT 20,000 or BDT 30,000 waiver on tuition fees during fair events.',
      },
    ],
  },
];

const summaryRows = [
  { sl: '1', category: 'Sibling / Spouse / Parent', max: '10% per student', status: 'Active' },
  { sl: '2', category: 'Female Students', max: '10% – 50%', status: 'Active' },
  { sl: '3', category: 'Freedom Fighter Quota', max: '100% (Tuition)', status: 'Active' },
  { sl: '4', category: 'Disability Quota', max: '10%', status: 'Active' },
  { sl: '5', category: 'Group Waiver', max: '3% – 5%', status: 'Active' },
  { sl: '6', category: 'Tribal / Instructor Quotas', max: '10%', status: 'Active' },
  { sl: '7', category: 'Special (Admission Fair)', max: 'BDT 30,000', status: 'Active' },
];

// ────────────────────────────── SCHOLARSHIPS ──────────────────────────────

interface Slab {
  name: string;
  credits: string;
  base: string;
  perfect: string;
  near: string;
  highlight?: boolean;
}

const slabs: Slab[] = [
  {
    name: 'Slab 1',
    credits: '10 Credits or Fewer',
    base: '2%',
    perfect: '25%',
    near: '10%',
  },
  {
    name: 'Slab 2',
    credits: '12 Credits or Fewer',
    base: '5%',
    perfect: '30%',
    near: '15%',
  },
  {
    name: 'Slab 3',
    credits: '15 Credits or More',
    base: 'Highest',
    perfect: '50%',
    near: '20%',
    highlight: true,
  },
];

const takeaways = [
  'Maximum benefit: to receive the highest possible scholarship (50%), a student must take at least 15 credits and maintain a perfect 4.00 GPA.',
  'Incentive for higher load: even with the same GPA (e.g. 4.00), moving from Slab 1 to Slab 3 doubles the scholarship — from 25% to 50%.',
];

// ────────────────────────────── PAGE ──────────────────────────────

export default function WaiverScholarshipPage() {
  return (
    <PageShell
      title="Waiver & Scholarship"
      overline="Admission"
      image="/assets/admission-hero.jpg"
      imagePosition="top"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            Sonargaon University offers a range of tuition waivers and merit scholarships to make quality engineering education accessible. Eligibility depends on academic performance, demographic criteria, and family / institutional context.
          </p>
        </div>

        {/* ════════════════ WAIVERS ════════════════ */}
        <PartHeader Icon={Sparkles} kicker="Part 01" title="Tuition Fee Waivers" />

        <div className="space-y-6 mb-12">
          {waiverCategories.map((cat) => (
            <article
              key={cat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shrink-0">
                  <cat.Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-tight">
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary text-[15px] mb-1">
                        {item.heading}
                      </h4>
                      <p className="text-[14px] text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {cat.note && (
                <div className="mt-5 p-4 bg-accent/5 border-l-4 border-accent rounded-r-lg">
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                    <span className="font-bold text-accent">Note:</span> {cat.note}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Summary Table */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shrink-0">
              <ListChecks size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-tight">
                Summary Table
              </h3>
              <p className="text-sm text-gray-600 mt-1">Quick reference for all waiver categories.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/15 text-left">
                  <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500 w-12">
                    SL
                  </th>
                  <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500">
                    Waiver Category
                  </th>
                  <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500">
                    Maximum Waiver
                  </th>
                  <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.sl} className="border-b border-gray-100 hover:bg-accent/5 transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-500 font-mono">{row.sl}</td>
                    <td className="px-3 py-3 text-[14px] text-gray-800 font-semibold">{row.category}</td>
                    <td className="px-3 py-3 text-[14px] text-accent font-display font-bold">{row.max}</td>
                    <td className="px-3 py-3">
                      <span className="inline-block px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
            <p className="text-[13px] text-gray-700 leading-relaxed">
              <span className="font-bold text-primary">Note:</span> for the general Student Welfare Division (SWD) Waiver on tuition fees, students must submit an application to the SWD department after their admission is complete.
            </p>
          </div>
        </article>

        {/* ════════════════ SCHOLARSHIPS ════════════════ */}
        <PartHeader Icon={Trophy} kicker="Part 02" title="Merit Scholarships" />

        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10 leading-[1.85]">
          The university offers three distinct scholarship slabs based on the number of credits a student completes in a semester. The scholarship percentage increases as the credit load and GPA increase.
        </p>

        {/* Slab cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {slabs.map((slab) => (
            <article
              key={slab.name}
              className={`relative rounded-2xl p-6 md:p-7 ${
                slab.highlight
                  ? 'bg-primary text-white shadow-2xl ring-2 ring-button-yellow'
                  : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
              }`}
            >
              {slab.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-button-yellow text-primary text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full shadow-md">
                  Best Value
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold ${
                    slab.highlight
                      ? 'bg-button-yellow/20 text-button-yellow border border-button-yellow/40'
                      : 'bg-gradient-to-br from-primary to-accent text-white'
                  }`}
                >
                  <GraduationCap size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <div
                    className={`text-[10px] font-bold tracking-[0.25em] uppercase ${
                      slab.highlight ? 'text-button-yellow' : 'text-accent'
                    }`}
                  >
                    {slab.name}
                  </div>
                  <h3 className={`font-display text-base font-bold leading-tight ${slab.highlight ? 'text-white' : 'text-primary'}`}>
                    {slab.credits}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <Row
                  label="Base Scholarship"
                  value={slab.base}
                  highlight={slab.highlight}
                  emphasis={false}
                />
                <Row
                  label="GPA 4.00"
                  value={slab.perfect}
                  highlight={slab.highlight}
                  emphasis
                />
                <Row
                  label="GPA 3.90 – 3.99"
                  value={slab.near}
                  highlight={slab.highlight}
                  emphasis={false}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="relative bg-primary text-white rounded-xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles size={20} className="text-button-yellow" />
              <span className="text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase">
                Key Takeaways
              </span>
            </div>

            <ul className="space-y-4">
              {takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-button-yellow shrink-0 mt-0.5" />
                  <p className="text-[15px] text-white/90 leading-[1.7]">{t}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}

function PartHeader({
  Icon,
  kicker,
  title,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  kicker: string;
  title: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <div className="inline-flex w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white items-center justify-center shadow-md mb-3">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <span className="block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-1">
        {kicker}
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight">
        {title}
      </h2>
      <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  emphasis,
}: {
  label: string;
  value: string;
  highlight: boolean | undefined;
  emphasis: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        highlight ? 'border-b border-white/10' : 'border-b border-gray-100'
      } last:border-b-0`}
    >
      <span className={highlight ? 'text-white/75' : 'text-gray-600'}>{label}</span>
      <span
        className={`font-display font-bold ${
          emphasis
            ? highlight
              ? 'text-button-yellow text-xl'
              : 'text-accent text-xl'
            : highlight
              ? 'text-white'
              : 'text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
