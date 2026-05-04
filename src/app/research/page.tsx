import { Calendar, MapPin, Users, FileText } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { researchPapers } from '@/lib/research-data';

export const metadata = {
  title: 'Research — Department of Mechanical Engineering',
  description:
    'Published research papers from the Department of Mechanical Engineering, Sonargaon University.',
};

export default function ResearchPage() {
  return (
    <PageShell
      title="Research Publications"
      overline="Academic Excellence"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-14">
          <p className="text-[15px] md:text-[16px] leading-[1.85] text-gray-700">
            A selection of research publications by faculty and students of the
            Department of Mechanical Engineering, Sonargaon University, spanning
            thermodynamics, fluid mechanics, materials science, energy systems,
            and more.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-primary bg-primary/5 px-4 py-1.5 rounded-full">
            <FileText size={14} />
            {researchPapers.length} Publications
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-5 md:gap-6 lg:grid-cols-2">
          {researchPapers.map((paper) => (
            <article
              key={paper.id}
              className="flex gap-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-5 md:p-6"
            >
              {/* Number badge */}
              <div className="shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-[15px]">
                  {paper.id}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] md:text-[16px] font-bold leading-snug text-primary mb-3">
                  {paper.title}
                </h3>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3 text-[12.5px]">
                  {paper.date && (
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <Calendar size={13} className="text-accent" />
                      {paper.date}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-2 text-[13px] leading-[1.6]">
                  <Users size={13} className="shrink-0 mt-1 text-accent" />
                  <span className="text-gray-700 font-medium">{paper.authors}</span>
                </div>

                <div className="flex items-start gap-2 text-[12.5px] leading-[1.6]">
                  <MapPin size={13} className="shrink-0 mt-1 text-gray-400" />
                  <span className="text-gray-500">{paper.area}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
