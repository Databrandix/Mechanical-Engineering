'use client';

import {Facebook, Linkedin, Youtube, Mail, MapPin, Phone, ArrowUp} from 'lucide-react';
import Container from '../ui/Container';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const usefulLinks = ['Tution Fee', 'Faculty Staff', 'Alumni', 'Career', 'Event', 'Our Blogs'];
  const quickLinks = ['SU News', 'Forum', 'Students', 'Parents', 'Teachers', 'Administration'];

  const socials = [
    { name: 'Facebook', Icon: Facebook, href: '#' },
    { name: 'X', Icon: XIcon, href: '#' },
    { name: 'WhatsApp', Icon: WhatsAppIcon, href: '#' },
    { name: 'LinkedIn', Icon: Linkedin, href: '#' },
    { name: 'YouTube', Icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand + Contact */}
          <div className="space-y-5">
            <div className="inline-block">
              <img
                src="/assets/footer-logo.png"
                alt="Sonargaon University"
                className="h-12 w-auto object-contain"
              />
            </div>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>147/I, Green Road, Panthapath, Tejgaon, Dhaka</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                <span>+8801775000888</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                <span>880241010352</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                <span>info@su.edu.bd</span>
              </li>
            </ul>

            <div className="flex gap-3 pt-1">
              {socials.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-accent hover:bg-accent transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Useful Link */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Useful Link</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {usefulLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-accent transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Quick Link</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-accent transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Google Maps */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 border-b border-accent pb-2 inline-block">Google Maps</h4>
            <div className="rounded-lg overflow-hidden border border-white/10 shadow-md">
              <iframe
                title="Sonargaon University location"
                src="https://maps.google.com/maps?q=Sonargaon%20University%20Panthapath%20Dhaka&hl=en&z=15&output=embed"
                className="w-full h-[200px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            Copyright © 2026 All Rights Reserved by Sonargaon University
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <a href="#" className="hover:underline">Privacy Statement</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Sitemap</a>
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
