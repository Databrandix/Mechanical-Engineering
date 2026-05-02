import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Faculty Members — Department of Mechanical Engineering',
  description:
    'Faculty members of the Department of Mechanical Engineering, Sonargaon University — Dean, Head of Department, and the teaching faculty.',
};

interface Leader {
  slug: string;
  name: string;
  photo: string;
  badge: string;
  primaryTitle: string;
  secondaryTitle?: string;
}

const leaders: Leader[] = [
  {
    slug: 'habibur-rahman-kamal',
    name: 'Brig. Gen. (Retd) Prof. Habibur Rahman Kamal, ndc, psc',
    photo: '/assets/faculty-dean-kamal.png',
    badge: 'Dean',
    primaryTitle: 'Dean, Faculty of Science & Engineering',
  },
  {
    slug: 'mostofa-hossain',
    name: 'Prof. Md. Mostofa Hossain',
    photo: '/assets/faculty-head-mostofa.png',
    badge: 'Head of Department',
    primaryTitle: 'Head, Department of Mechanical Engineering',
    secondaryTitle: 'Professor',
  },
];

interface FacultyMember {
  slug: string;
  name: string;
  designation: string;
  photo?: string;
}

const facultyMembers: FacultyMember[] = [
  { slug: 'amm-shamsul-alam', name: 'AMM Shamsul Alam', designation: 'Associate Professor', photo: '/assets/faculty-shamsul-alam.png' },
  { slug: 'ahatashamul-haque-khan-shuvo', name: 'Md. Ahatashamul Haque Khan Shuvo', designation: 'Assistant Professor', photo: '/assets/faculty-ahatashamul-haque-khan-shuvo.png' },
  { slug: 'saikat-biswas', name: 'Saikat Biswas', designation: 'Assistant Professor', photo: '/assets/faculty-saikat-biswas.png' },
  { slug: 'minhaz-uddin', name: 'Md. Minhaz Uddin', designation: 'Assistant Professor', photo: '/assets/faculty-minhaz-uddin.png' },
  { slug: 'niloy-sarkar', name: 'Niloy Sarkar', designation: 'Assistant Professor', photo: '/assets/faculty-niloy-sarkar.png' },
  { slug: 'nuruzzaman-rakib', name: 'Nuruzzaman Rakib', designation: 'Assistant Professor', photo: '/assets/faculty-nuruzzaman-rakib.png' },
  { slug: 'shahinur-rahman', name: 'Shahinur Rahman', designation: 'Lecturer & Course Coordinator', photo: '/assets/faculty-shahinur-rahman.png' },
  { slug: 'faisal-junaeat-imrul', name: 'M. A. Faisal Junaeat Imrul', designation: 'Lecturer & Assistant Coordinator', photo: '/assets/faculty-faisal-junaeat-imrul.png' },
  { slug: 'navid-inan', name: 'Md. Navid Inan', designation: 'Lecturer', photo: '/assets/faculty-navid-inan.png' },
  { slug: 'misbah-uddin', name: 'Md. Misbah Uddin', designation: 'Lecturer', photo: '/assets/faculty-misbah-uddin.jpg' },
  { slug: 'ismail-hossain', name: 'G M Ismail Hossain', designation: 'Lecturer', photo: '/assets/faculty-ismail-hossain.png' },
  { slug: 'nahiyan-chowdhury', name: 'Nahiyan Chowdhury', designation: 'Lecturer', photo: '/assets/faculty-nahiyan-chowdhury.png' },
  { slug: 'washif-rahman', name: 'M. I. Washif Rahman', designation: 'Lecturer', photo: '/assets/faculty-washif-rahman.png' },
  { slug: 'khandoker-mohammad-faisal-karim', name: 'Khandoker Mohammad Faisal Karim', designation: 'Lecturer', photo: '/assets/faculty-khandoker-mohammad-faisal-karim.jpg' },
  { slug: 'hasan-tareq-mahin', name: 'Hasan Tareq Mahin', designation: 'Lecturer', photo: '/assets/faculty-hasan-tareq-mahin.png' },
  { slug: 'rokiya-sultana', name: 'Rokiya Sultana', designation: 'Lecturer', photo: '/assets/faculty-rokiya-sultana.png' },
  { slug: 'ibrahim-khalil-apurba', name: 'Ibrahim Khalil Apurba', designation: 'Lecturer', photo: '/assets/faculty-ibrahim-khalil-apurba.png' },
  { slug: 'torikul-islam', name: 'Md. Torikul Islam', designation: 'Lecturer', photo: '/assets/faculty-torikul-islam.png' },
  { slug: 'munkasir-ahnaf-jisba', name: 'Munkasir Ahnaf Jisba', designation: 'Lecturer', photo: '/assets/faculty-munkasir-ahnaf-jisba.png' },
  { slug: 'faruque-hossain', name: 'Md. Faruque Hossain', designation: 'Lecturer & Assistant Coordinator', photo: '/assets/faculty-faruque-hossain.png' },
  { slug: 'kazi-maskawath', name: 'Kazi Maskawath', designation: 'Lecturer', photo: '/assets/faculty-kazi-maskawath.png' },
  { slug: 'sadman-hossain', name: 'Md. Sadman Hossain', designation: 'Lecturer', photo: '/assets/faculty-sadman-hossain.png' },
  { slug: 'towheedur-rahman-tanvir', name: 'Md. Towheedur Rahman Tanvir', designation: 'Lecturer', photo: '/assets/faculty-towheedur-rahman-tanvir.png' },
  { slug: 'farhan-kadir-rafi', name: 'Farhan Kadir Rafi', designation: 'Lecturer', photo: '/assets/faculty-farhan-kadir-rafi.png' },
  { slug: 'tahmid-hasan-oni', name: 'Tahmid Hasan Oni', designation: 'Lecturer', photo: '/assets/faculty-tahmid-hasan-oni.png' },
  { slug: 'nafis-iqbal', name: 'Nafis Iqbal', designation: 'Lecturer', photo: '/assets/faculty-nafis-iqbal.png' },
  { slug: 'mahfuz-kabir', name: 'Md. Mahfuz Kabir', designation: 'Lecturer', photo: '/assets/faculty-mahfuz-kabir.png' },
  { slug: 'shafi-uddin-bhuiyan', name: 'Shafi Uddin Bhuiyan', designation: 'Lecturer', photo: '/assets/faculty-shafi-uddin-bhuiyan.png' },
  { slug: 'mahfujul-islam', name: 'Md. Mahfujul Islam', designation: 'Lecturer', photo: '/assets/faculty-mahfujul-islam.png' },
  { slug: 'khakan-hasan-mim', name: 'Md. Khakan Hasan Mim', designation: 'Lecturer & Exam Coordinator', photo: '/assets/faculty-khakan-hasan-mim.png' },
  { slug: 'biplob-hossain', name: 'Biplob Hossain', designation: 'Lecturer', photo: '/assets/faculty-biplob-hossain.png' },
  { slug: 'feroze-alam', name: 'Md. Feroze Alam', designation: 'Lecturer', photo: '/assets/faculty-feroze-alam.png' },
];

const initialsOf = (name: string) =>
  name
    .replace(/[A-Z]\.\s|Md\.\s|Mrs?\.\s|Prof\.\s|Dr\.\s/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

export default function FacultyMemberPage() {
  return (
    <PageShell
      title="Faculty Members"
      overline="Department"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Leadership section */}
        <section className="mb-16 md:mb-20">
          <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
              Department Leadership
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              Leadership
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
            {leaders.map((leader) => (
              <article
                key={leader.slug}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-8 items-center p-6 md:p-8">
                  {/* Photo */}
                  <div className="flex justify-center md:justify-start">
                    <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden bg-gray-50 border-2 border-gray-100">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center md:text-left">
                    <span className="inline-block text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-2">
                      {leader.badge}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-tight mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base">{leader.primaryTitle}</p>
                    {leader.secondaryTitle && (
                      <p className="text-gray-500 text-sm mt-1">{leader.secondaryTitle}</p>
                    )}

                    <div className="mt-5">
                      <a
                        href={`/faculty-member/${leader.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                      >
                        View Profile
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Faculty Members grid */}
        <section>
          <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
            <span className="inline-block text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
              Our Teachers
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              Faculty Members
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {facultyMembers.map((member) => (
              <article
                key={member.slug}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col text-center"
              >
                {/* Photo with accent border */}
                <div className="mx-auto mb-4">
                  <div className="w-32 h-48 border-2 border-accent overflow-hidden bg-gray-50 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '50% 12%' }}
                      />
                    ) : (
                      <span className="font-display text-3xl font-bold text-accent/40">
                        {initialsOf(member.name)}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-[14px] font-bold text-primary leading-snug mb-2 line-clamp-2">
                  {member.name}
                </h3>
                <p className="text-[12px] text-gray-700 leading-snug mb-5 line-clamp-2">
                  {member.designation}
                </p>

                <div className="mt-auto">
                  <a
                    href={`/faculty-member/${member.slug}`}
                    className="inline-block px-5 py-2 bg-primary hover:bg-primary/90 text-white text-[12px] font-semibold rounded transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
