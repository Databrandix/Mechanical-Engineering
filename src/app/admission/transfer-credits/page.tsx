import { CheckCircle2, FileText, BookOpen, Receipt, GraduationCap } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Transfer Credits — Department of Mechanical Engineering',
  description:
    'Credit transfer policy at Sonargaon University — minimum grades, transfer limits, fees, and the documents required to apply.',
};

const documents = [
  {
    title: 'Formal Application',
    description:
      'A prescribed application for "Credit Transfer Student(s)" addressed to the Registrar of SU.',
  },
  {
    title: 'Secondary Academic Records',
    description: 'Official copies of the SSC Transcript and the HSC or Diploma Transcript.',
  },
  {
    title: 'Higher Education Records',
    description:
      'Official transcripts from all previously attended universities — including all courses regardless of whether credit was earned (i.e. "Fail" or "Incomplete" grades).',
  },
  {
    title: 'Course Syllabi',
    description:
      'The syllabus for every course under consideration for transfer — technical and non-technical, departmental and non-departmental.',
  },
];

const summary = [
  { label: 'Maximum Credits Accepted', value: '50% of program total' },
  { label: 'Transfer Fee', value: 'BDT 20,000' },
  { label: 'Standard Minimum Grade', value: "'B'" },
  { label: 'Internal Migration Grade', value: "'D'" },
];

export default function TransferCreditsPage() {
  return (
    <PageShell
      title="Transfer Credits"
      overline="Admission"
      image="/assets/admission-hero.webp"
      imagePosition="top"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-gray-700 leading-[1.85]">
            Sonargaon University accepts credit transfers from other recognised institutions, as well as
            internal migrations between departments. Review the policy and required documents below before
            you apply.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Minimum Grade Policy */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader Icon={GraduationCap} title="Minimum Grade Policy" />
            <ul className="space-y-3 mt-5">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[15px] text-gray-800 leading-[1.7]">
                  <span className="font-semibold text-primary">Standard Credit Transfer:</span> a
                  minimum grade of <strong>&apos;B&apos;</strong> is required for a course to be
                  accepted for transfer.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[15px] text-gray-800 leading-[1.7]">
                  <span className="font-semibold text-primary">Internal Migration:</span> a minimum
                  grade of <strong>&apos;D&apos;</strong> is accepted for students migrating or
                  changing departments within the university.
                </p>
              </li>
            </ul>
          </section>

          {/* 2. Transfer Limits and Fees */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader Icon={Receipt} title="Transfer Limits & Fees" />
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Maximum Transfer Limit
                </div>
                <div className="font-display text-2xl font-bold text-primary">50%</div>
                <div className="text-sm text-gray-600 mt-1">of the program&apos;s total credits</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Credit Transfer Fee
                </div>
                <div className="font-display text-2xl font-bold text-accent">BDT 20,000</div>
                <div className="text-sm text-gray-600 mt-1">one-time charge</div>
              </div>
            </div>
          </section>

          {/* 3. Required Documents */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader Icon={FileText} title="Required Documents" />
            <p className="text-sm text-gray-600 mt-3 mb-5">
              Submit the following documents along with your application:
            </p>
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-primary text-[15px] mb-1">
                      {doc.title}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Summary card */}
          <section className="relative bg-primary text-white rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            </div>

            <div className="relative p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen size={20} className="text-button-yellow" />
                <span className="text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase">
                  Quick Reference
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-5">
                Summary of Key Constraints
              </h3>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {summary.map(({ label, value }) => (
                  <div key={label} className="border-l-2 border-button-yellow/50 pl-4">
                    <div className="text-[11px] font-semibold tracking-wider uppercase text-button-yellow mb-1">
                      {label}
                    </div>
                    <div className="text-base md:text-lg font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </PageShell>
  );
}

function SectionHeader({
  Icon,
  title,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl md:text-2xl font-bold text-primary leading-tight">
        {title}
      </h2>
    </div>
  );
}
