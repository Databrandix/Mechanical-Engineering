import { Bus, Phone, Clock, ArrowDownRight, ArrowUpLeft, MapPin, Sparkles, Info } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import { busRoutes } from '@/lib/transport-data';

export const metadata = {
  title: 'Transport Service — Sonargaon University',
  description:
    "Sonargaon University's free bus service routes, timings, and contact numbers covering major areas across Dhaka.",
};

export default function TransportServicePage() {
  return (
    <PageShell
      title="Transport Service"
      overline="Campus Services"
      image="/assets/transport/dsc01671.webp"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-14">
          <p className="text-[15px] md:text-[16px] leading-[1.85] text-gray-700">
            Sonargaon University (SU) provides a comprehensive bus service
            covering major routes to ensure a comfortable commute for our
            students and staff.
          </p>
        </div>

        {/* Free service banner */}
        <div className="mx-auto max-w-5xl mb-10 md:mb-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white p-6 md:p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <Sparkles size={28} className="shrink-0 text-button-yellow mt-1" />
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                Free University Bus Service
              </h3>
              <p className="text-white/90 text-[14px] md:text-[15px] leading-relaxed">
                The university provides free bus services covering major city
                areas and outskirts —{' '}
                <strong className="text-button-yellow">Mograpara</strong>,{' '}
                <strong className="text-button-yellow">Gauchhia</strong>,{' '}
                <strong className="text-button-yellow">Kadamtali</strong>,{' '}
                <strong className="text-button-yellow">Abdullahpur</strong>,
                and <strong className="text-button-yellow">Savar</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Bus Routes & Timings */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              Bus Routes &amp; Timings
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {busRoutes.map((route) => (
              <article
                key={route.id}
                className="flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Header strip */}
                <div className="bg-primary text-white px-5 py-4 flex items-start gap-3">
                  <Bus size={20} className="shrink-0 mt-0.5 text-button-yellow" />
                  <h3 className="text-[16px] font-bold leading-snug">
                    {route.routeName}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Bus number */}
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Bus Number
                    </span>
                    <span className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-[13px] font-semibold text-gray-800">
                      {route.busNumber}
                    </span>
                  </div>

                  {/* Contact */}
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Contact
                    </span>
                    <a
                      href={`tel:${route.contact.replace(/-/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:text-primary transition-colors"
                    >
                      <Phone size={14} />
                      {route.contact}
                    </a>
                  </div>

                  {/* Departure times */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      <ArrowDownRight size={12} className="text-primary" />
                      Departure (to SU)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {route.departureTimes.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-2.5 py-1 text-[13px] font-semibold text-primary"
                        >
                          <Clock size={12} />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Return times */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      <ArrowUpLeft size={12} className="text-accent" />
                      Return (from SU)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {route.returnTimes.length === 0 ? (
                        <span className="text-[13px] text-gray-400">—</span>
                      ) : (
                        route.returnTimes.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-md bg-accent/5 px-2.5 py-1 text-[13px] font-semibold text-accent"
                          >
                            <Clock size={12} />
                            {t}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Important Instructions */}
        <div className="mx-auto max-w-5xl rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Info size={22} className="text-accent" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-primary">
              Important Instructions
            </h2>
          </div>

          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-bold text-[15px] text-primary mb-1">
                  Pick-up Points
                </p>
                <p className="text-[14px] leading-[1.7] text-gray-700">
                  Please contact the respective bus drivers/supervisors at the
                  provided numbers to confirm your specific pick-up location
                  and exact time.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Sparkles size={18} className="shrink-0 mt-0.5 text-button-yellow" />
              <div>
                <p className="font-bold text-[15px] text-primary mb-1">
                  Special Service — Mohakhali
                </p>
                <p className="text-[14px] leading-[1.7] text-gray-700">
                  A dedicated bus leaves for Mohakhali from SU six days a week
                  at <strong>08:00 AM</strong>. For details, contact:{' '}
                  <a
                    href="tel:01958642587"
                    className="font-semibold text-accent hover:text-primary transition-colors"
                  >
                    01958-642587
                  </a>
                  .
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Bus size={18} className="shrink-0 mt-0.5 text-accent" />
              <div>
                <p className="font-bold text-[15px] text-primary mb-1">
                  Free Service
                </p>
                <p className="text-[14px] leading-[1.7] text-gray-700">
                  The university provides free bus services covering major
                  city areas and outskirts like Mograpara, Gauchhia,
                  Kadamtali, Abdullahpur, and Savar.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </PageShell>
  );
}
