import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: "Dean's Message — Faculty of Science and Engineering",
  description:
    "Message from the Dean of the Faculty of Science and Engineering, Sonargaon University.",
};

export default function DeansMessagePage() {
  return (
    <PageShell title="Dean's Message" overline="About" contentClassName="bg-gray-50 py-12 md:py-20">
      <Container>
        <div className="relative bg-primary text-white rounded-2xl shadow-2xl">
          {/* Decorative accents — clipped in their own wrapper so sticky works on children */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-[260px_1fr] items-start">
              {/* Profile column */}
              <div className="flex flex-col items-center text-center lg:sticky lg:top-32">
                <div className="relative w-52 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl mb-5 bg-white/5">
                  <img
                    src="/assets/faculty-dean-kamal.png"
                    alt="Brig. Gen. (Retd) Prof. Habibur Rahman Kamal"
                    className="block w-full h-auto"
                  />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">Brig. Gen. (Retd) Prof. Habibur Rahman Kamal, ndc, psc</h3>
                <p className="text-white/75 text-sm mb-1">Dean</p>
                <p className="text-white/60 text-sm">Faculty of Science &amp; Engineering</p>
              </div>

              {/* Message column */}
              <div>
                <div className="mb-8">
                  <span className="inline-block text-button-yellow text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
                    A Note from the Dean
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                    Welcome Message
                  </h2>
                  <div className="mt-3 h-1 w-16 bg-button-yellow rounded-full" />
                </div>

                <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.85] text-white/90 text-justify">
                  <p>
                    <span className="float-left mr-2 text-5xl md:text-6xl font-display font-bold leading-none text-button-yellow">W</span>
                    elcome to the Department of Mechanical Engineering, the largest and most established department within the Faculty of Science and Engineering. Over the last decade, we have built a strong reputation for academic excellence, supported by a dedicated team of nearly 50 full-time faculty members from top-tier institutions like <strong className="text-button-yellow">BUET, KUET, and RUET</strong>.
                  </p>

                  <p>
                    Our mission is to bridge the gap between creativity and technology by providing a modern learning environment equipped with high-tech laboratories and air-conditioned, multimedia classrooms. We pride ourselves on the global success of our graduates, many of whom are currently excelling in postgraduate programs across the USA, Canada, and the EU with prestigious scholarships.
                  </p>

                  <p>
                    Beyond the classroom, our students consistently demonstrate their practical expertise, as evidenced by the recent recognition of the <strong className="text-button-yellow">Sonargaon University Mecha Club</strong> at the BUET Auto Fest. We are committed to fostering your growth as a skilled engineer and a responsible citizen, prepared to solve the complex technological challenges of the future.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-10 pt-6 border-t border-white/15">
                  <p className="font-display font-bold text-lg text-button-yellow">Brig. Gen. (Retd) Prof. Habibur Rahman Kamal, ndc, psc</p>
                  <p className="text-white/80 text-sm mt-1">Dean</p>
                  <p className="text-white/70 text-sm">Faculty of Science &amp; Engineering</p>
                  <p className="text-white/70 text-sm">Sonargaon University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
