import { Briefcase, GraduationCap } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { alumni } from '@/lib/alumni-data';

export const metadata = {
  title: 'Alumni — Department of Mechanical Engineering',
  description:
    'Notable alumni from the Department of Mechanical Engineering, Sonargaon University.',
};

export default function AlumniPage() {
  return (
    <PageShell
      title="Our Alumni"
      overline="Student Society"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {alumni.map((person) => (
            <article
              key={person.id}
              className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Photo */}
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-[17px] font-bold text-primary leading-snug">
                  {person.name}
                </h3>

                <div className="flex items-start gap-2 text-[13px] text-gray-600 leading-snug">
                  <Briefcase size={15} className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    <span className="font-medium text-gray-800">{person.designation}</span>
                    {person.company && (
                      <>
                        <span className="text-gray-400">, </span>
                        <span>{person.company}</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-700">
                    <GraduationCap size={14} className="text-primary" />
                    {person.department}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
