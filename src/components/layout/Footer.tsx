'use client';

import Image from 'next/image';
import {Facebook, Instagram, Linkedin, Youtube, Mail, MapPin, Phone, ArrowUp} from 'lucide-react';
import Container from '../ui/Container';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.78 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89-.013 0-.025 0-.039 0-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256.013 0 .025 0 .039 0 3.197.02 5.099 1.987 5.286 5.412.107.045.213.092.319.139 1.49.7 2.58 1.761 3.154 3.07.797 1.82.872 4.79-1.548 7.2-1.852 1.81-4.14 2.628-7.32 2.586zm1.504-12.087c-.31-.014-.621-.022-.928-.022a8.55 8.55 0 0 0-.948.045c-1.668.106-2.71.86-2.642 2.092.072 1.291 1.503 1.892 2.882 1.815 1.27-.07 2.927-.572 3.205-3.886a10.674 10.674 0 0 0-1.569-.044z" />
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/>
  </svg>
);

type FooterProps = {
  logoUrl: string;
  address: string;
  phones: readonly string[];
  emails: readonly string[];
  copyrightText: string;
  mapEmbedUrl: string | null;
  socials: {
    facebookUrl:  string | null;
    instagramUrl: string | null;
    linkedinUrl:  string | null;
    youtubeUrl:   string | null;
    xUrl:         string | null;
    threadsUrl:   string | null;
    tiktokUrl:    string | null;
    whatsappUrl:  string | null;
  };
};

export default function Footer({
  logoUrl,
  address,
  phones,
  emails,
  copyrightText,
  mapEmbedUrl,
  socials,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  type FooterLink = { name: string; href?: string; external?: boolean; disabled?: boolean };

  const usefulLinks: FooterLink[] = [
    { name: 'Tuition Fee', href: '/admission/tuition-fees' },
    { name: 'Faculty Staff', href: '/faculty-member' },
    { name: 'Alumni', href: '/student-society/alumni' },
    { name: 'Career', href: 'https://su.edu.bd/welcome/career', external: true },
    { name: 'Event', href: '/student-society/events' },
    { name: 'Our Blogs', disabled: true },
  ];

  const getInTouch: FooterLink[] = [
    { name: 'Contact', href: '/contact' },
    { name: 'Meet With Us', href: '/contact' },
    { name: 'Privacy Statement', href: 'https://su.edu.bd/about_us/privacy_policy', external: true },
    { name: 'Newsletters', disabled: true },
    { name: 'Location Map', href: '/contact' },
    { name: 'FAQ', href: '/student-society/faq' },
  ];

  const quickLinks: FooterLink[] = [
    { name: 'SU News', href: '/news' },
    { name: 'Forum', disabled: true },
    { name: 'Students', disabled: true },
    { name: 'Parents', disabled: true },
    { name: 'Teachers', href: 'https://su.edu.bd/faculty_members/all_faculty_details', external: true },
    { name: 'Administration', href: 'https://su.edu.bd/About_us/new_administration/4', external: true },
  ];

  const renderFooterLink = (link: FooterLink) => (
    <a
      href={link.href || '#'}
      {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="hover:text-accent transition-colors"
    >
      {link.name}
    </a>
  );

  // Order matches the Phase 0 UniversityIdentity column order; each
  // icon renders only when its URL is non-null in DB (CMS clears →
  // icon disappears).
  const socialList = [
    { name: 'Facebook',  Icon: Facebook,     href: socials.facebookUrl  },
    { name: 'Instagram', Icon: Instagram,    href: socials.instagramUrl },
    { name: 'LinkedIn',  Icon: Linkedin,     href: socials.linkedinUrl  },
    { name: 'YouTube',   Icon: Youtube,      href: socials.youtubeUrl   },
    { name: 'X',         Icon: XIcon,        href: socials.xUrl         },
    { name: 'Threads',   Icon: ThreadsIcon,  href: socials.threadsUrl   },
    { name: 'TikTok',    Icon: TikTokIcon,   href: socials.tiktokUrl    },
    { name: 'WhatsApp',  Icon: WhatsAppIcon, href: socials.whatsappUrl  },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-12">
          {/* Brand + Contact */}
          <div className="space-y-5 lg:col-span-2">
            <div className="inline-block">
              <Image
                src={logoUrl}
                alt="Sonargaon University"
                width={400}
                height={120}
                className="h-12 w-auto object-contain"
              />
            </div>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              {phones.map((phone) => (
                <li key={phone} className="flex gap-3">
                  <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>{phone}</span>
                </li>
              ))}
              {emails.map((email) => (
                <li key={email} className="flex gap-3">
                  <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>{email}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 pt-1">
              {socialList.map(({ name, Icon, href }) =>
                href ? (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-accent hover:bg-accent transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ) : null,
              )}
            </div>
          </div>

          {/* Mobile pairing — Useful Link + Get in Touch side-by-side; on md+ the wrapper dissolves and each takes its own grid column */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            {/* Useful Link */}
            <div>
              <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Useful Link</h4>
              <ul className="space-y-3 text-sm text-white/70">
                {usefulLinks.map((link) => (
                  <li key={link.name}>{renderFooterLink(link)}</li>
                ))}
              </ul>
            </div>

            {/* Get in Touch */}
            <div>
              <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Get in Touch</h4>
              <ul className="space-y-3 text-sm text-white/70">
                {getInTouch.map((link) => (
                  <li key={link.name}>{renderFooterLink(link)}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Quick Link</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link.name}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Google Maps — entire card hidden when mapEmbedUrl is null */}
          {mapEmbedUrl && (
            <div>
              <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Google Maps</h4>
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-md">
                <iframe
                  title="Sonargaon University location"
                  src={mapEmbedUrl}
                  className="w-full h-[200px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <noscript>
                  <a
                    href="https://maps.google.com/maps?q=Sonargaon+University+Panthapath+Dhaka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/10 px-4 py-3 text-sm text-white/80 hover:text-white"
                  >
                    View Sonargaon University location on Google Maps →
                  </a>
                </noscript>
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            {copyrightText}
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <a
              href="https://su.edu.bd/about_us/privacy_policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Privacy Statement
            </a>
            <a
              href="https://su.edu.bd/about_us/privacy_policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Terms of Use
            </a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:underline">Sitemap</a>
          </div>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-all shadow-lg"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </Container>
    </footer>
  );
}
