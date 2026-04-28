'use client';

import {Facebook, Linkedin, Youtube, Mail, MapPin, Phone, ArrowUp} from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg p-2">
                <div className="w-full h-full bg-primary rounded-sm" />
              </div>
              <h3 className="font-display font-bold text-lg leading-tight uppercase">
                Sonargaon University [SU]
              </h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Leading the way in excellence and innovation. Our mission is to provide quality education and foster research that simplifies lives.
            </p>
            <div className="space-y-3">
               <h4 className="font-medium text-accent">Subscribe Us</h4>
               <div className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder="Enter Email Address" 
                   className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-accent"
                 />
                 <Button variant="magenta" className="px-4 py-2">Subscribe</Button>
               </div>
            </div>
            <div className="flex gap-4">
              <Facebook size={20} className="text-white/60 hover:text-accent cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-white/60 hover:text-accent cursor-pointer transition-colors" />
              <Youtube size={20} className="text-white/60 hover:text-accent cursor-pointer transition-colors" />
              <Mail size={20} className="text-white/60 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 border-b border-accent pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><a href="#" className="hover:text-accent transition-colors">DIU News</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Forum</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Students</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Parents</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Teachers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Alumni</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Administration</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 border-b border-accent pb-2 inline-block">Useful Links</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><a href="#" className="hover:text-accent transition-colors">Skill Jobs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Internship Portal</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Convocation</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">DIU Annual Report</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Prospectus</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Forms</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Discount Partners</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 border-b border-accent pb-2 inline-block">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>123 University Avenue, Dhaka, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>info@sonargaon.edu.bd</span>
              </li>
              <li className="flex gap-3 pt-4">
                <div className="bg-white/10 p-4 rounded-xl w-full">
                  <p className="text-xs font-semibold mb-1">Visitor Statistics</p>
                  <p className="text-lg font-bold">94,832 Total Hits</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/50">
            Copyright © 2026 Sonargaon University. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <a href="#" className="hover:underline">Privacy Statement</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-all shadow-lg"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </Container>
    </footer>
  );
}
