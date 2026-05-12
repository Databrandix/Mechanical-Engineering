import { Phone, Mail, Globe, Facebook, MapPin, Building2, Clock } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';
import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact Us — Sonargaon University',
  description:
    'Contact Sonargaon University — phone, email, website, Facebook, and campus addresses for Permanent, Green Road and Mohakhali campuses.',
};

interface Campus {
  name: string;
  tag?: string;
  address: string;
  phone?: string;
  email: string;
}

const campuses: Campus[] = [
  {
    name: 'Permanent Campus',
    address: 'Ward No–75, Dasher Kandi, Khilgaon, Dhaka-1219',
    email: 'info@su.edu.bd',
  },
  {
    name: 'Green Road Campus',
    tag: 'City Campus-1',
    address: '147/I, Green Road, Panthapath, Dhaka-1215',
    phone: '+880241010352',
    email: 'registrar@su.edu.bd',
  },
  {
    name: 'Mohakhali Campus',
    tag: 'City Campus-2',
    address: 'GP Ja-146, Wireless Gate, Mohakhali, Dhaka-1212',
    phone: '+880241020135',
    email: 'info@su.edu.bd',
  },
];

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Us"
      overline="Get in Touch"
      image="/assets/contact-hero.webp"
      imagePosition="center 30%"
      contentClassName="bg-gray-50 py-12 md:py-16"
    >
      <Container>
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <p className="text-[15px] md:text-[16px] leading-[1.85] text-gray-700">
            We are here to assist you. Whether you have questions about
            admissions, academic programs, or campus facilities, feel free to
            reach out to us through any of the following channels.
          </p>
        </div>

        {/* Quick Contact Information */}
        <section className="mb-14 md:mb-20">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              Quick Contact Information
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-primary mb-2">Phone</h3>
              <a
                href="tel:+880241010352"
                className="text-[14px] font-semibold text-accent hover:text-primary transition-colors"
              >
                +880 2 41010352
              </a>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-gray-500">
                <Clock size={12} />
                Sat–Fri, 8 AM – 8 PM
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-primary mb-2">E-mail</h3>
              <a
                href="mailto:admission.info@su.edu.bd"
                className="text-[13px] font-semibold text-accent hover:text-primary transition-colors break-all"
              >
                admission.info@su.edu.bd
              </a>
              <a
                href="mailto:registrar@su.edu.bd"
                className="text-[13px] font-semibold text-accent hover:text-primary transition-colors break-all mt-1"
              >
                registrar@su.edu.bd
              </a>
            </div>

            {/* Website */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-primary mb-2">Website</h3>
              <a
                href="https://www.su.edu.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-accent hover:text-primary transition-colors"
              >
                www.su.edu.bd
              </a>
            </div>

            {/* Facebook */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Facebook size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-primary mb-2">Facebook</h3>
              <a
                href="https://www.facebook.com/SonargaonUniversity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-accent hover:text-primary transition-colors"
              >
                Sonargaon University
              </a>
            </div>
          </div>
        </section>

        {/* Send Us a Message */}
        <section className="mb-14 md:mb-20">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              Send Us a Message
            </h2>
            <p className="mt-2 text-gray-600 text-[15px] max-w-xl mx-auto">
              Have a question or suggestion? Fill out the form and we&rsquo;ll get back to you.
            </p>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="mx-auto max-w-3xl">
            <ContactForm />
          </div>
        </section>

        {/* Campus Locations */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              Campus Locations
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 bg-accent rounded-full" />
          </div>

          <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
            {campuses.map((c) => (
              <article
                key={c.name}
                className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Header strip */}
                <div className="bg-primary text-white px-6 py-5 flex items-start gap-3">
                  <Building2 size={22} className="shrink-0 mt-0.5 text-button-yellow" />
                  <div>
                    <h3 className="font-bold text-[17px] leading-snug">
                      {c.name}
                    </h3>
                    {c.tag && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-button-yellow/90">
                        {c.tag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-accent" />
                    <p className="text-[14px] leading-[1.7] text-gray-700">
                      {c.address}
                    </p>
                  </div>

                  {c.phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="shrink-0 mt-0.5 text-accent" />
                      <a
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="text-[14px] font-semibold text-primary hover:text-accent transition-colors"
                      >
                        {c.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="shrink-0 mt-0.5 text-accent" />
                    <a
                      href={`mailto:${c.email}`}
                      className="text-[14px] font-semibold text-primary hover:text-accent transition-colors break-all"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
