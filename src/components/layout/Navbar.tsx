'use client';

import {useState, useEffect} from 'react';
import {
  Menu, X, Facebook, Linkedin, Youtube,
  GraduationCap, User, CheckCircle, ChevronDown
} from 'lucide-react';
import Container from '../ui/Container';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#', hasDropdown: true },
    { name: 'Faculty Member', href: '#' },
    { name: 'Programs', href: '#', hasDropdown: true },
    { name: 'Laboratories', href: '#' },
    { name: 'Career Prospectus', href: '#' },
    {
      name: 'Admission',
      href: '#admission',
      hasDropdown: true,
      children: [
        { name: 'Admission Requirements', href: '#admission' },
        { name: 'Tuition Fees', href: '#admission' },
        { name: 'Transfer Credits', href: '#admission' },
        { name: 'Waiver & Scholarship', href: '#admission' },
      ],
    },
    { name: 'Student Society', href: '#' },
  ];

  const topLinks = ['Virtual Tour', 'Admission', 'IQAC', 'Career', 'Archive', 'Contact'];

  return (
    <nav className="fixed w-full z-50 flex flex-col transition-all duration-300">
      {/* 1. TOP BAR */}
      <div className={`hidden md:flex items-center overflow-hidden transition-all duration-500 ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        {/* Left Side - Magenta Background */}
        <div className="flex-grow bg-accent h-full flex items-center pr-4">
          <Container className="w-full !max-w-[1600px] flex items-center">
            <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
              {topLinks.map((link, idx) => (
                <div key={link} className="flex items-center">
                  <a href="#" className="hover:text-white transition-colors px-2 relative group uppercase tracking-wider">
                    {link}
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
            <a href="#" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Facebook size={12} fill="currentColor" />
              <span className="uppercase tracking-widest">Facebook</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Linkedin size={12} fill="currentColor" />
              <span className="uppercase tracking-widest">LinkedIn</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-accent transition-colors">
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
          <div className="flex items-center shrink-0">
            <img
              src="/assets/su-colour-logo.png"
              alt="Sonargaon University"
              className={`${isScrolled ? 'h-7 md:h-8' : 'h-8 md:h-9 xl:h-10'} w-auto max-w-[42vw] object-contain transition-all duration-500`}
            />
          </div>

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
                    <div className="invisible absolute left-0 top-full z-50 min-w-[230px] translate-y-2 rounded-lg border border-gray-100 bg-white py-2 opacity-0 shadow-premium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {link.children.map((child) => (
                        <a
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-accent/5 hover:text-accent"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Right side: Secondary buttons + Apply Now + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Secondary buttons — hidden on lg when scrolled (dept nav takes priority) */}
            <div className={`flex items-center gap-3 ${isScrolled ? 'lg:hidden' : ''}`}>
              <button className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100">
                <User size={16} className="text-accent" />
                ERP
              </button>
              <button className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100">
                <GraduationCap size={16} className="text-accent" />
                Convoc. Reg.
              </button>
              <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm border border-gray-100">
                <CheckCircle size={16} className="text-accent" />
                Verification
              </button>
            </div>

            {/* Apply Now — always visible (primary CTA) */}
            <button className="flex items-center gap-2 px-3 lg:px-3 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg text-xs lg:text-xs xl:text-sm font-bold whitespace-nowrap transition-all shadow-md hover:shadow-lg hover:brightness-110 shrink-0">
              Apply Now
            </button>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                      <div className="invisible absolute left-0 top-full z-50 min-w-[230px] translate-y-2 rounded-lg border border-gray-100 bg-white py-2 opacity-0 shadow-premium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {link.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-accent/5 hover:text-accent"
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-white z-40 overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-gray-100 pb-4">
                <a href={link.href} className="text-xl font-bold text-[#2B3175] flex justify-between items-center">
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={20} />}
                </a>
                {link.children && (
                  <div className="mt-4 flex flex-col gap-3 pl-4">
                    {link.children.map((child) => (
                      <a key={child.name} href={child.href} className="text-base font-semibold text-gray-700">
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full py-4 gradient-blue-magenta text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-all">
                Apply Now
              </button>
              <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all shadow-sm border border-gray-100">
                ERP Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
