import { CheckCircle2, GraduationCap, AlertCircle, Wrench } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Admission Requirements — Department of Mechanical Engineering',
  description:
    'Admission requirements at Sonargaon University — Undergraduate, Graduate, and Diploma (Engineering) entry criteria.',
};

const undergraduateRequirements = [
  'Minimum GPA of 2.5 (or second division) in SSC and HSC examinations (or their equivalent), or GCE/IGCSE "O" Level in four subjects.',
  '"A" Level in two subjects with minimum GPA of 2.50 in each exam (using scale of A=5, B=4, C=3, D=2, E=1), or average 450 marks in GED with five subjects.',
  'Minimum GPA of 2.0 in SSC and HSC examinations individually for Fashion Design and Technology.',
  'Sons/daughters of freedom fighters are eligible for admission with a minimum combined GPA of 5.00 in SSC and HSC. Applicants must submit an authenticated certificate as proof of their parent’s identity as a freedom fighter.',
  'Equivalent performance under other educational systems (e.g. American High School Diploma, IB, etc.) is also accepted.',
  'A combined SAT score of 1100 is also accepted in lieu of the Admission Test for High School Graduates in any system.',
  'For admission to engineering programs, students must have studied Physics, Chemistry, and Mathematics in HSC / A-Level.',
  'The University also accepts non-degree admissions, usually for exchange students.',
  'Transfer of credits from comparable educational institutions may be considered after admission.',
];

const additionalNotes = [
  'Students who have passed the HSC Examination under the mark-based grading system are considered for admission and scholarship at SU based on a conversion scale approved by the SU Admission Committee.',
  'Any confusion relating to a degree or diploma obtained from home or abroad — for admission to undergraduate / graduate programs or for other purposes — shall be referred to and resolved by the Degree Equivalence Committee of SU.',
];

const diplomaRequirements = [
  'Three or four years Diploma in Engineering from Bangladesh Technical Education Board (BTEB) with a CGPA of 2.5 out of 4.00, OR',
  'A Diploma recognised by BTEB with a CGPA of 2.5 out of 4.00 in any engineering discipline from any recognised institute.',
];

const diplomaQuickCriteria = [
  { label: 'SSC', value: 'Minimum GPA 2.5' },
  { label: 'Diploma', value: 'Minimum GPA 2.5' },
];

export default function AdmissionRequirementsPage() {
  return (
    <PageShell
      title="Admission Requirements"
      overline="Admission"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            Sonargaon University welcomes applications from students who meet the eligibility criteria below.
            Different programs have specific entry requirements — please review the section that applies to you.
          </p>
        </div>

        {/* ───── Undergraduate Programs ───── */}
        <section className="mb-16 md:mb-20">
          <SectionHeader
            Icon={GraduationCap}
            overline="Section 01"
            title="Undergraduate Programs"
          />

          <div className="space-y-4 max-w-5xl mx-auto">
            {undergraduateRequirements.map((req, i) => (
              <article
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-5 p-5 md:p-6">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-display font-bold shadow-md">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="text-[15px] text-gray-800 leading-[1.7] pt-1.5">{req}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Additional notes */}
          <div className="max-w-5xl mx-auto mt-8 space-y-4">
            {additionalNotes.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-5 bg-accent/5 border-l-4 border-accent rounded-r-lg"
              >
                <AlertCircle size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[14px] text-gray-700 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── Graduate Programs ───── */}
        <section className="mb-16 md:mb-20">
          <SectionHeader Icon={GraduationCap} overline="Section 02" title="Graduate Programs" />

          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 md:p-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-accent/10 items-center justify-center mb-5">
              <GraduationCap size={28} className="text-accent" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">
              Currently Not Available
            </h3>
            <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
              Graduate programs in Mechanical Engineering are not offered at this time. Please check back later for updates.
            </p>
          </div>
        </section>

        {/* ───── Diploma (Engineering) Students ───── */}
        <section>
          <SectionHeader
            Icon={Wrench}
            overline="Section 03"
            title="For Diploma (Engineering) Students"
          />

          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main eligibility */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-7">
              <h3 className="font-display text-lg font-bold text-primary mb-4">
                Eligibility
              </h3>
              <ul className="space-y-3">
                {diplomaRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                    <p className="text-[15px] text-gray-800 leading-[1.7]">{req}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-accent mb-3">
                  Combined GPA Criteria
                </h4>
                <p className="text-[15px] text-gray-700 leading-[1.7]">
                  Combined GPA of <strong className="text-primary">5.0 in SSC &amp; HSC</strong> with a minimum of 2.5 in each, OR a total GPA of <strong className="text-primary">6.00*</strong> with a minimum GPA of 2.00 in either SSC or HSC.
                </p>
              </div>
            </div>

            {/* Quick criteria card */}
            <div className="relative bg-primary text-white rounded-xl shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
              <div className="relative p-6 md:p-7">
                <span className="inline-block text-button-yellow text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
                  Quick Reference
                </span>
                <h3 className="font-display text-lg font-bold mb-5">Minimum Requirements</h3>
                <div className="space-y-4">
                  {diplomaQuickCriteria.map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[11px] font-semibold tracking-wider uppercase text-button-yellow">
                        {label}
                      </div>
                      <div className="text-base font-semibold mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}

function SectionHeader({
  Icon,
  overline,
  title,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  overline: string;
  title: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <div className="inline-flex w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white items-center justify-center shadow-md mb-3">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <span className="block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-1">
        {overline}
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight">
        {title}
      </h2>
      <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
    </div>
  );
}
