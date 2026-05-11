import Image from 'next/image';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Message from Head — Department of Mechanical Engineering',
  description:
    'Welcome message from the Head of the Department of Mechanical Engineering, Sonargaon University.',
};

export default function MessageFromHeadPage() {
  return (
    <PageShell title="Message from Head" overline="About" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        <div className="relative bg-primary text-white rounded-2xl shadow-2xl">
          {/* Decorative accents — clipped in their own wrapper so sticky works on children */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative p-5 md:p-12 lg:p-16">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-[260px_1fr] items-start">
              {/* Profile column */}
              <div className="flex flex-col items-center text-center lg:sticky lg:top-32">
                <div className="relative w-52 h-52 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl mb-5 bg-white/5">
                  <Image
                    src="/assets/head-mostofa-hossain.png"
                    alt="Prof. Md. Mostofa Hossain"
                    fill
                    sizes="208px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">Prof. Md. Mostofa Hossain</h3>
                <p className="text-white/75 text-sm mb-1">Head of the Department</p>
                <p className="text-white/60 text-sm">Department of Mechanical Engineering</p>
              </div>

              {/* Message column */}
              <div>
                <div className="mb-8">
                  <span className="inline-block text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
                    A Note from the Head
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                    Welcome Message
                  </h2>
                  <div className="mt-3 h-1 w-16 bg-button-yellow rounded-full" />
                </div>

                <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.85] text-white/90 text-justify">
                  <p>
                    <span className="float-left mr-2 text-5xl md:text-6xl font-display font-bold leading-none text-button-yellow">M</span>
                    echanical Engineering is the largest department of the university. The Department started its journey in the year of 2013 and has already passed a decade. In the last decade, we have developed our expertise and competency in curriculum and research. Our main goal is to provide quality education in both theory and practical to the undergraduate students, so that they can build their foundation strongly. There are about 50 (Fifty) highly educated, qualified and experienced permanent full-time faculty members from BUET, KUET, RUET, CUET, DUET, IUT, DU, CU, RU, JU and other public universities engaged in the Department. A large number of our graduates are regularly getting enrolments in Post-graduate programs in reputed universities around the world, particularly in the USA, Canada, Australia and the EU with prestigious scholarships, as well as a good number of faculty members are also on study leave in different countries pursuing their higher education.
                  </p>

                  <p>
                    The university is located in the heart of the city, with easy access to Metro-Rail Station, City and Inter-district bus services. It provides free bus services around the city and downtown — Mograpara, Gauchhia, Kadamtali in the east, Abdullahpur in the north and Savar in the west.
                  </p>

                  <p>
                    50% to 100% Waiver on tuition fees and scholarship is also available on the basis of semester results. Air-conditioned classrooms with multimedia projectors, lab facilities equipped with all types of equipments and machineries as per courses of the department, as well as Computer Lab with the latest and updated computers and software are also available in the Department.
                  </p>

                  <p>
                    It is noteworthy that efficient and experienced professors of BUET have been appointed as advisors to the department. Students have participated in different competitive events and have kept the signatures of many accomplishments.
                  </p>

                  <p>
                    ACI Motors Ltd. presents Auto Fest 2024 was held from February 01, 2024 to February 08, 2024, organized by Mechanical Engineering Association, BUET. Sonargaon University Mecha Club (SUMEC) of the Department of Mechanical Engineering participated in this Fest and achieved a token of appreciation as <strong className="text-button-yellow">Valuable Club Partner</strong>. Participation, collaboration and contribution of SUMEC significantly enriched the initiatives of the Fest.
                  </p>

                  <p>
                    Therefore, Welcome to the Department of Mechanical Engineering — pursue your undergraduate degree and make yourself an Engineer as well as a good citizen to serve the country.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-10 pt-6 border-t border-white/15">
                  <p className="font-display font-bold text-lg text-button-yellow">Prof. Md. Mostofa Hossain</p>
                  <p className="text-white/80 text-sm mt-1">Head</p>
                  <p className="text-white/70 text-sm">Department of Mechanical Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
