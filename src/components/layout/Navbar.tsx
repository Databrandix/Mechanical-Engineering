'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Search, Facebook, Linkedin, Youtube,
  GraduationCap, User, CheckCircle, ChevronDown, ChevronRight,
  LayoutGrid, BookOpen, Image as ImageIcon, Users, Globe,
  ClipboardList, Building2, Award, Compass, Archive,
} from 'lucide-react';
import Container from '../ui/Container';
import { quickLinks } from '../../lib/data';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  const toggleMobileSection = (name: string) => {
    setOpenMobileSection((prev) => (prev === name ? null : name));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  // Hide on /admin/* — admin UI has its own sidebar chrome.
  // Placed AFTER every hook so the hook count stays stable across
  // route changes (Navbar lives in the persistent root layout; an
  // early return before useState/useEffect violated Rules of Hooks
  // and triggered chrome leakage on soft client-side navigation).
  if (pathname?.startsWith('/admin')) return null;

  const navLinks: {
    name: string;
    href: string;
    hasDropdown?: boolean;
    title?: string;
    children?: { name: string; href: string; disabled?: boolean }[];
  }[] = [
    {
      name: 'About',
      href: '#',
      hasDropdown: true,
      title: 'About',
      children: [
        { name: 'Message from Head', href: '/about/message-from-head' },
        { name: 'Mission & Vision', href: '/about/mission-vision' },
        { name: 'Laboratory Facility', href: '/about/laboratory-facility' },
        { name: 'Mecha Club', href: '/about/mecha-club' },
        { name: 'Lab Facility', href: '/about/lab-facility' },
      ],
    },
    { name: 'Faculty Member', href: '/faculty-member' },
    {
      name: 'Admission',
      href: '#admission',
      hasDropdown: true,
      title: 'Admission',
      children: [
        { name: 'Admission Requirements', href: '/admission/requirements' },
        { name: 'Tuition Fees', href: '/admission/tuition-fees' },
        { name: 'Transfer Credits', href: '/admission/transfer-credits' },
        { name: 'Waiver & Scholarship', href: '/admission/waiver-scholarship' },
        { name: 'Admission Notice', href: '/admission/notice' },
        { name: 'Prospectus', href: '/admission/prospectus' },
        { name: 'Apply Online', href: 'http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel' },
      ],
    },
    {
      name: 'Student Society',
      href: '#',
      hasDropdown: true,
      title: 'Student Society',
      children: [
        { name: 'Notice Board', href: '/student-society/notice-board' },
        { name: 'Events', href: '/student-society/events' },
        { name: 'Alumni', href: '/student-society/alumni' },
        { name: 'Visitor', href: '/student-society/visitor' },
        { name: 'FAQ', href: '/student-society/faq' },
        { name: 'Syllabus', href: '/student-society/syllabus' },
        { name: 'Club list', href: '/student-society/club-list' },
      ],
    },
    { name: 'Contact', href: '/contact' },
  ];

  const topLinks: { name: string; href?: string; external?: boolean }[] = [
    { name: 'Virtual Tour' },
    { name: 'IQAC', href: 'https://su.edu.bd/iqac', external: true },
    { name: 'Career', href: 'https://su.edu.bd/welcome/career', external: true },
    { name: 'Archive' },
    { name: 'Contact', href: '/contact' },
  ];

  const quickAccess: { name: string; href?: string; external?: boolean; Icon: typeof BookOpen; disabled?: boolean }[] = [
    { name: 'Library', href: 'http://lib.su.edu.bd', external: true, Icon: BookOpen },
    { name: 'Admission', href: '/admission/requirements', Icon: GraduationCap },
    { name: 'Photo', href: '/gallery', Icon: ImageIcon },
    { name: 'Virtual Tour', Icon: Compass, disabled: true },
    { name: 'Archive', Icon: Archive, disabled: true },
    { name: 'Notice', href: 'https://su.edu.bd/welcome/notice', external: true, Icon: Users },
    { name: 'ERP', href: 'http://sue.su.edu.bd:5081/sonargaon_erp/', external: true, Icon: Globe },
    { name: 'IQAC', href: 'https://su.edu.bd/iqac', external: true, Icon: ClipboardList },
    { name: 'Skill Jobs', href: 'https://su.edu.bd/welcome/career', external: true, Icon: Building2 },
    { name: 'Convoc. Reg.', href: 'http://sue.su.edu.bd:5081/sonargaon_erp/student/convocation_registration', external: true, Icon: Award },
    { name: 'Verification', href: 'https://su.edu.bd/welcome/degree_verification', external: true, Icon: CheckCircle },
  ];

  return (
    <nav className="fixed w-full z-[60] flex flex-col transition-all duration-300">
      {/* 1. TOP BAR */}
      <div className={`hidden md:flex items-center overflow-hidden transition-all duration-500 ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        {/* Left Side - Magenta Background */}
        <div className="flex-grow bg-accent h-full flex items-center pr-4">
          <Container className="w-full !max-w-[1600px] flex items-center">
            <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
              {topLinks.map((link, idx) => (
                <div key={link.name} className="flex items-center">
                  <a
                    href={link.href || '#'}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="hover:text-white transition-colors px-2 relative group uppercase tracking-wider"
                  >
                    {link.name}
                  </a>
                  {idx < topLinks.length - 1 && <span className="opacity-30">|</span>}
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* Right Side - Socials with Dark Blue Background */}
        <div className="bg-[#2B3175] h-full flex items-center px-10">
          <div className="flex items-center gap-6 text-white text-[11px] font-medium">
            <a href="https://www.facebook.com/SonargaonUniversity" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Facebook size={12} fill="currentColor" />
              <span className="uppercase tracking-widest">Facebook</span>
            </a>
            <a href="https://www.linkedin.com/school/14451954/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Linkedin size={12} fill="currentColor" />
              <span className="uppercase tracking-widest">LinkedIn</span>
            </a>
            <a href="https://www.youtube.com/@SonargaonUniversityEdu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Youtube size={14} fill="currentColor" />
              <span className="uppercase tracking-widest">Youtube</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE BAR - Logo & Action Buttons */}
      <div className={`transition-all duration-500 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md border-gray-50 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]' : 'bg-white border-gray-100 py-4'}`}>
        <Container className="flex justify-between items-center !max-w-[1600px]">
          {/* Logo */}
          <a href="/" aria-label="Sonargaon University — Home" className="flex items-center shrink-0">
            <Image
              src="/assets/su-colour-logo.webp"
              alt="Sonargaon University"
              width={400}
              height={120}
              priority
              className={`${isScrolled ? 'h-7 md:h-8' : 'h-8 md:h-9 xl:h-10'} w-auto max-w-[42vw] object-contain transition-all duration-500`}
            />
          </a>

          {/* Compact Scroll Navigation — only render when scrolled (saves layout space when not scrolled) */}
          {isScrolled && (
            <div className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => (
                <div key={link.name} className="group relative">
                  <a
                    href={link.href}
                    className="h-11 px-1 xl:px-3 flex items-center gap-0.5 xl:gap-1 text-[11px] xl:text-[14px] font-bold whitespace-nowrap text-gray-800 hover:text-accent transition-colors"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={12} className="hidden xl:block opacity-80" />}
                  </a>
                  {link.children && (
                    <div className="invisible absolute left-0 top-full z-50 min-w-[280px] translate-y-2 rounded-lg border border-gray-100 bg-white py-3 opacity-0 shadow-premium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {link.title && (
                        <div className="px-5 pt-1 pb-3 border-b border-gray-200">
                          <div className="text-[15px] font-bold text-gray-900">{link.title}</div>
                        </div>
                      )}
                      <div className="py-2">
                        {link.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            {...(child.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                            className="group/item block px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-accent/5 hover:text-accent"
                          >
                            <span className="inline-flex items-center gap-2">
                              {child.name}
                              <ChevronRight
                                size={14}
                                className="opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200"
                              />
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Right side: Secondary buttons + Apply Now + Mobile toggle */}
          <div className="flex items-center gap-1 lg:gap-3 -mr-3 lg:mr-0">
            {/* Secondary buttons — hidden on lg when scrolled (dept nav takes priority) */}
            <div className={`flex items-center gap-3 ${isScrolled ? 'lg:hidden' : ''}`}>
              <a
                href="http://sue.su.edu.bd:5081/sonargaon_erp/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100"
              >
                <User size={16} className="text-accent" />
                ERP
              </a>
              <a
                href="http://sue.su.edu.bd:5081/sonargaon_erp/student/convocation_registration"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100"
              >
                <GraduationCap size={16} className="text-accent" />
                Convoc. Reg.
              </a>
              <button
                type="button"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100"
              >
                <CheckCircle size={16} className="text-accent" />
                Verification
              </button>
            </div>

            {/* Apply Now — desktop only (mobile users use the drawer button) */}
            <a
              href="http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 lg:px-3 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg text-xs lg:text-xs xl:text-sm font-bold whitespace-nowrap transition-all shadow-md hover:shadow-lg hover:brightness-110 shrink-0"
            >
              Apply Now
            </a>

            {/* Quick Access grid — only shown in scrolled (compact) nav */}
            {isScrolled && (
              <div className="hidden lg:block group relative">
                <button
                  aria-label="Quick access"
                  className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-primary transition-colors border border-blue-100"
                >
                  <LayoutGrid size={20} />
                </button>
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-[320px] translate-y-2 rounded-xl border border-gray-100 bg-white p-3 opacity-0 shadow-premium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-3 gap-1">
                    {quickAccess.map(({ name, href, external, Icon }) => (
                      <a
                        key={name}
                        href={href || '#'}
                        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg text-center transition-colors hover:bg-accent/5"
                      >
                        <Icon size={22} className="text-primary" />
                        <span className="text-[12px] font-medium text-gray-700 leading-tight">{name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Toggle — hidden while the mobile menu is open */}
            {!mobileMenuOpen && (
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 text-primary relative z-[70]"
              >
                <Search size={24} />
              </button>
            )}

            {/* Mobile Menu Toggle — sits above drawer when open */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 text-primary relative z-[70]"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </Container>
      </div>

      {/* 3. BOTTOM BAR - Nav Links */}
      {!isScrolled && (
        <div className="bg-white/95 backdrop-blur-md hidden lg:block border-b border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <Container className="!max-w-[1600px]">
            <div className="flex items-center h-14">
            <div className="mx-auto flex items-center justify-center gap-0.5 xl:gap-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="group relative">
                    <a
                      href={link.href}
                      className="px-1.5 xl:px-5 h-14 flex items-center gap-0.5 xl:gap-1.5 text-[12px] xl:text-[15px] font-medium whitespace-nowrap text-gray-800 hover:text-accent transition-all relative"
                    >
                      {link.name}
                      {link.hasDropdown && <ChevronDown size={13} className="hidden xl:block opacity-50" />}
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all group-hover:w-full" />
                    </a>
                    {link.children && (
                      <div className="invisible absolute left-0 top-full z-50 min-w-[280px] translate-y-2 rounded-lg border border-gray-100 bg-white py-3 opacity-0 shadow-premium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        {link.title && (
                          <div className="px-5 pt-1 pb-3 border-b border-gray-200">
                            <div className="text-[15px] font-bold text-gray-900">{link.title}</div>
                          </div>
                        )}
                        <div className="py-2">
                          {link.children.map((child) => (
                            <a
                              key={child.name}
                              href={child.href}
                              {...(child.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                              className="group/item block px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-accent/5 hover:text-accent"
                            >
                              <span className="inline-flex items-center gap-2">
                                {child.name}
                                <ChevronRight
                                  size={14}
                                  className="opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200"
                                />
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Mobile Menu — slide-in drawer from right (covers navbar; only hamburger X stays visible) */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 bg-black/40 z-[50] transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Full-height drawer — slides in from right edge */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-[min(85vw,340px)] overflow-y-auto overscroll-contain bg-white z-[55] shadow-2xl transform transition-transform duration-300 pb-6 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Menu header — aligned with navbar logo position */}
        <div className="px-4 pt-8 pb-3">
          <h3 className="text-base font-bold text-primary">Menu</h3>
        </div>

        {/* Nav list */}
        <div className="px-4">
          {navLinks.map((link) => {
            const isOpen = openMobileSection === link.name;
            return (
              <div key={link.name} className="border-b border-gray-100 last:border-b-0">
                {link.hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(link.name)}
                    aria-expanded={isOpen}
                    className="w-full py-3 text-[14px] font-semibold text-primary flex justify-between items-center"
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="block py-3 text-[14px] font-semibold text-primary"
                  >
                    {link.name}
                  </a>
                )}
                {link.children && isOpen && (
                  <div className="pb-2 pl-3 flex flex-col gap-1">
                    {link.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        {...(child.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                        className="py-1.5 text-[13px] font-medium text-gray-700 hover:text-accent transition-colors"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply Now */}
        <div className="px-4 pt-3">
          <a
            href="http://sue.su.edu.bd:5081/sonargaon_erp/siteadmin/create_smart_panel"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold text-center shadow-md transition-all"
          >
            Apply Now
          </a>
        </div>

        {/* Quick Links section */}
        <div className="mt-4 px-4 pt-4 border-t border-gray-100">
          <h4 className="text-[13px] font-bold text-primary mb-2.5">Quick Links</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="text-[12.5px] text-gray-700 hover:text-accent transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Services section */}
        <div className="mt-4 px-4 pt-4 pb-4 border-t border-gray-100">
          <h4 className="text-[13px] font-bold text-primary mb-3">Services</h4>
          <div className="grid grid-cols-3 gap-2">
            {quickAccess.map(({ name, href, external, Icon }) => (
              <a
                key={name}
                href={href || '#'}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-lg bg-gray-50 hover:bg-accent/5 active:bg-accent/10 transition-colors text-center"
              >
                <Icon size={20} className="text-primary" />
                <span className="text-[10.5px] font-semibold text-gray-700 leading-tight">
                  {name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
