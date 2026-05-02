import { notFound } from 'next/navigation';
import { Mail, Phone, IdCard, Building2, MapPin, Plus } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { faculty, getFacultyBySlug, departmentName, type Faculty } from '@/lib/faculty-data';

export function generateStaticParams() {
  return faculty.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getFacultyBySlug(slug);
  if (!member) return { title: 'Faculty member not found' };
  return {
    title: `${member.name} — ${departmentName}`,
    description: `${member.name}, ${member.designation}, ${departmentName}, Sonargaon University.`,
  };
}

type DetailKey =
  | 'personalInfo'
  | 'academicQualification'
  | 'trainingExperience'
  | 'teachingArea'
  | 'publications'
  | 'research'
  | 'awards'
  | 'membership'
  | 'previousEmployment';

const SECTIONS: { key: DetailKey; label: string }[] = [
  { key: 'personalInfo', label: 'Personal Information' },
  { key: 'academicQualification', label: 'Academic Qualification' },
  { key: 'trainingExperience', label: 'Training Experience' },
  { key: 'teachingArea', label: 'Teaching Area' },
  { key: 'publications', label: 'Publication' },
  { key: 'research', label: 'Research' },
  { key: 'awards', label: 'Award & Scholarship' },
  { key: 'membership', label: 'Membership' },
  { key: 'previousEmployment', label: 'Previous Employment' },
];

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getFacultyBySlug(slug);
  if (!member) notFound();

  const officeAddress = '147/I, Green Road, Panthapath, Tejgaon, Dhaka';

  return (
    <PageShell title={member.name} overline="Faculty" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        {/* Profile header card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-10 overflow-hidden max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[auto_1fr_280px] gap-8 lg:gap-10 p-6 md:p-8 lg:p-10 items-start">
            {/* Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-44 h-56 md:w-48 md:h-60 border-2 border-accent overflow-hidden bg-gray-50 flex items-center justify-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 12%' }}
                  />
                ) : (
                  <span className="font-display text-4xl font-bold text-accent/40">
                    {member.name
                      .replace(/[A-Z]\.\s|Md\.\s|Mrs?\.\s|Prof\.\s|Dr\.\s/g, '')
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w.charAt(0).toUpperCase())
                      .join('')}
                  </span>
                )}
              </div>
            </div>

            {/* Name, designation, dept */}
            <div className="text-center lg:text-left">
              {member.badge && (
                <span className="inline-block text-accent text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
                  {member.badge}
                </span>
              )}
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight mb-3">
                {member.name}
              </h2>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold">{member.designation}</p>
                {member.secondaryTitle && (
                  <p className="text-sm text-gray-600">{member.secondaryTitle}</p>
                )}
                <p className="text-sm text-gray-600 flex items-center justify-center lg:justify-start gap-2 pt-1">
                  <Building2 size={14} className="text-accent shrink-0" />
                  {departmentName}
                </p>
              </div>
            </div>

            {/* Contact panel */}
            <div className="lg:border-l lg:border-gray-200 lg:pl-8 space-y-4 text-sm min-w-[240px]">
              <ContactRow label="Address" Icon={MapPin}>
                <span className="text-gray-700">{officeAddress}</span>
              </ContactRow>

              {member.email && (
                <ContactRow label="Email" Icon={Mail}>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-primary hover:text-accent break-all transition-colors"
                  >
                    {member.email}
                  </a>
                </ContactRow>
              )}

              {member.phone && (
                <ContactRow label="Phone" Icon={Phone}>
                  <a
                    href={`tel:${member.phone}`}
                    className="text-primary hover:text-accent transition-colors"
                  >
                    {member.phone}
                  </a>
                </ContactRow>
              )}

              {member.suId && (
                <ContactRow label="SU ID" Icon={IdCard}>
                  <span className="text-gray-700 font-mono text-xs">{member.suId}</span>
                </ContactRow>
              )}
            </div>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="space-y-3 max-w-5xl mx-auto">
          {SECTIONS.map(({ key, label }) => {
            const value = (member as Faculty)[key];
            const hasContent =
              (typeof value === 'string' && value.trim().length > 0) ||
              (Array.isArray(value) && value.length > 0);

            return (
              <details
                key={key}
                className="group bg-white rounded-md border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-3.5 bg-primary text-white cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-primary/95 transition-colors">
                  <span className="font-semibold text-[15px]">{label}</span>
                  <Plus
                    size={18}
                    className="group-open:rotate-45 transition-transform duration-200 shrink-0"
                  />
                </summary>
                <div className="px-5 py-5 text-[14px] leading-relaxed text-gray-700">
                  {hasContent ? (
                    typeof value === 'string' ? (
                      <p>{value}</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-2">
                        {(value as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Information will be updated soon.
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </Container>
    </PageShell>
  );
}

function ContactRow({
  label,
  Icon,
  children,
}: {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-1">
        <Icon size={12} />
        {label}
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}
