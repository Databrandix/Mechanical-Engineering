import {
  Sun,
  Moon,
  Star,
  Award,
  Percent,
  Receipt,
  GraduationCap,
  Calendar,
  CreditCard,
  Wallet,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Tuition Fees — Department of Mechanical Engineering',
  description:
    'Tuition fee structure for B.Sc. in Mechanical Engineering at Sonargaon University — by shift, academic background, and GPA range.',
};

interface FeeTier {
  gpa: string;
  perCredit: number;
  total: number;
}

interface ShiftGroup {
  background: string;
  tiers: FeeTier[];
}

interface Shift {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  name: string;
  shiftLabel: string;
  description: string;
  groups: ShiftGroup[];
}

const shifts: Shift[] = [
  {
    Icon: Sun,
    name: 'SUN',
    shiftLabel: 'Morning Shift',
    description: 'Primarily for students from an SSC + HSC background.',
    groups: [
      {
        background: 'SSC + HSC',
        tiers: [
          { gpa: '5.00 – 8.99', perCredit: 975, total: 264500 },
          { gpa: '9.00 – 9.99', perCredit: 897, total: 252020 },
          { gpa: '10.00', perCredit: 741, total: 227060 },
        ],
      },
    ],
  },
  {
    Icon: Moon,
    name: 'MOON',
    shiftLabel: 'Evening Shift',
    description: 'Available for both SSC + HSC and Diploma students.',
    groups: [
      {
        background: 'SSC + HSC',
        tiers: [
          { gpa: '5.00 – 7.99', perCredit: 1613, total: 342580 },
          { gpa: '8.00 – 9.00', perCredit: 1523, total: 328180 },
          { gpa: '10.00', perCredit: 1434, total: 313940 },
        ],
      },
      {
        background: 'Diploma',
        tiers: [
          { gpa: '5.00 – 7.99', perCredit: 1410, total: 310772 },
          { gpa: '8.00 – 9.00', perCredit: 1332, total: 297812 },
        ],
      },
    ],
  },
  {
    Icon: Star,
    name: 'STAR',
    shiftLabel: 'Friday Shift',
    description: 'Available for both SSC + HSC and Diploma students.',
    groups: [
      {
        background: 'SSC + HSC',
        tiers: [
          { gpa: '5.00 – 7.99', perCredit: 940, total: 234900 },
          { gpa: '8.00 – 9.00', perCredit: 846, total: 219860 },
          { gpa: '10.00', perCredit: 705, total: 197300 },
        ],
      },
      {
        background: 'Diploma',
        tiers: [
          { gpa: '5.00 – 7.99', perCredit: 808, total: 213860 },
          { gpa: '8.00 – 9.00', perCredit: 723, total: 200324 },
        ],
      },
    ],
  },
];

const overviewStats = [
  { Icon: GraduationCap, label: 'Total Credits', value: '160' },
  { Icon: Calendar, label: 'Semester System', value: 'Tri-Semester' },
  { Icon: CreditCard, label: 'Admission Fee', value: 'BDT 12,500' },
  { Icon: Wallet, label: 'Total Semester Fees', value: 'BDT 96,000' },
];

const policies = [
  {
    Icon: Award,
    title: 'Golden A+ Waiver',
    text: 'Students with a Golden A+ in both SSC and HSC receive a 100% Tuition Fee Waiver.',
  },
  {
    Icon: Percent,
    title: 'Payment Discounts',
    text: '10% waiver on tuition fees if the full 1st semester fee is paid at admission. 15% waiver on tuition fees if the full program fee is paid at admission.',
  },
  {
    Icon: Receipt,
    title: 'Additional Fees',
    text: 'A BDT 7,500 fee is charged for the Provisional Certificate (PVC) in the final semester.',
  },
];

const fmt = (n: number) => 'BDT ' + n.toLocaleString('en-BD');

export default function TuitionFeesPage() {
  return (
    <PageShell
      title="Tuition Fees"
      overline="Admission"
      image="/assets/admission-hero.webp"
      imagePosition="top"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
            B.Sc. in Mechanical Engineering (ME)
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight mb-4">
            Tuition Fee Structure
          </h2>
          <p className="text-base text-gray-700 leading-[1.85]">
            Cost per credit and the total program cost vary based on your academic background (SSC + HSC or Diploma) and the shift you choose. Use the breakdown below to find the fees that apply to you.
          </p>
        </div>

        {/* Program Overview */}
        <section className="mb-16 md:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="inline-flex w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-accent text-white items-center justify-center mb-3 shadow-md">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-1">
                  {label}
                </div>
                <div className="font-display text-lg md:text-xl font-bold text-primary leading-tight">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shifts */}
        <section className="mb-16 md:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
              By Admission Shift
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              Choose Your Shift
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="space-y-8">
            {shifts.map((shift) => (
              <article
                key={shift.name}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
              >
                {/* Shift header */}
                <div className="bg-gradient-to-r from-primary to-accent text-white px-6 md:px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                      <shift.Icon size={22} className="text-button-yellow" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-button-yellow">
                        {shift.shiftLabel}
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                        {shift.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/85 text-sm mt-3">{shift.description}</p>
                </div>

                {/* Fee tables */}
                <div className="p-6 md:p-8 space-y-8">
                  {shift.groups.map((group) => (
                    <div key={group.background}>
                      <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent mb-3">
                        {group.background} Background
                      </h4>
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full min-w-[480px] border-collapse">
                          <thead>
                            <tr className="border-b-2 border-primary/15 text-left">
                              <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500">
                                GPA Range
                              </th>
                              <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500 text-right">
                                Per Credit
                              </th>
                              <th className="px-3 py-3 text-[11px] font-bold tracking-wider uppercase text-gray-500 text-right">
                                Total Program Cost
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.tiers.map((tier) => (
                              <tr
                                key={tier.gpa}
                                className="border-b border-gray-100 hover:bg-accent/5 transition-colors"
                              >
                                <td className="px-3 py-4">
                                  <span className="inline-block px-3 py-1 bg-primary/8 text-primary text-sm font-semibold rounded">
                                    GPA {tier.gpa}
                                  </span>
                                </td>
                                <td className="px-3 py-4 text-right font-display font-bold text-gray-800">
                                  {fmt(tier.perCredit)}
                                </td>
                                <td className="px-3 py-4 text-right font-display font-bold text-accent">
                                  {fmt(tier.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Important Policies */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
              Read Before You Apply
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              Important Policies
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {policies.map(({ Icon, title, text }) => (
              <article
                key={title}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="inline-flex w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white items-center justify-center mb-4 shadow-md">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-primary mb-2">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
