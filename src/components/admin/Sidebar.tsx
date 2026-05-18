'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  LogOut,
  LayoutDashboard,
  Building2,
  University,
  GraduationCap,
  Microscope,
  Users,
  UsersRound,
  Key,
  Navigation,
  PanelBottom,
  Info,
  ChevronDown,
  FlaskConical,
  Newspaper,
  CalendarDays,
  Megaphone,
  Image as ImageIcon,
  FolderOpen,
  UserCircle2,
  Users2,
  HelpCircle,
  Sparkles,
  BookText,
  Bus,
  Map as MapIcon,
  Library,
  FileText,
  Scroll,
  ClipboardList,
  CircleDollarSign,
  ArrowLeftRight,
  Layers,
  HeartHandshake,
  Trophy,
  Mail,
} from 'lucide-react';

type SidebarUser = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const PRIMARY_NAV: NavItem[] = [
  { href: '/admin',                     label: 'Dashboard',           icon: LayoutDashboard },
  { href: '/admin/department-identity', label: 'Department Identity', icon: Building2 },
  { href: '/admin/university-identity', label: 'University Identity', icon: University },
  { href: '/admin/programs',            label: 'Programs',            icon: GraduationCap },
  { href: '/admin/research-areas',      label: 'Research Areas',      icon: Microscope },
  { href: '/admin/faculty',             label: 'Faculty',             icon: UsersRound },
  { href: '/admin/nav',                 label: 'Navigation',          icon: Navigation },
  { href: '/admin/footer-links',        label: 'Footer Links',        icon: PanelBottom },
];

const ABOUT_PAGES_NAV: NavItem[] = [
  { href: '/admin/about-overview',        label: 'Overview',         icon: Info },
  { href: '/admin/about-mission-vision',  label: 'Mission & Vision', icon: Info },
  { href: '/admin/about-mecha-club',      label: 'Mecha Club',       icon: Info },
];

const LAB_SYSTEMS_NAV: NavItem[] = [
  { href: '/admin/lab-facility',        label: 'Lab Facility',        icon: FlaskConical },
  { href: '/admin/laboratory-facility', label: 'Laboratory Facility', icon: FlaskConical },
];

const CONTENT_HUBS_NAV: NavItem[] = [
  { href: '/admin/news',     label: 'News',     icon: Newspaper },
  { href: '/admin/events',   label: 'Events',   icon: CalendarDays },
  { href: '/admin/notices',  label: 'Notices',  icon: Megaphone },
  { href: '/admin/gallery',  label: 'Gallery',  icon: ImageIcon },
];

const STUDENT_SOCIETY_NAV: NavItem[] = [
  { href: '/admin/alumni',          label: 'Alumni',          icon: UserCircle2 },
  { href: '/admin/clubs',           label: 'Clubs',           icon: Users2 },
  { href: '/admin/faqs',            label: 'FAQs',            icon: HelpCircle },
  { href: '/admin/visitors',        label: 'Visitors',        icon: Sparkles },
  { href: '/admin/research-papers', label: 'Research Papers', icon: Library },
  { href: '/admin/syllabus',        label: 'Syllabus',        icon: BookText },
];

const CAMPUS_SERVICES_NAV: NavItem[] = [
  { href: '/admin/bus-routes',        label: 'Bus Routes',        icon: Bus },
  { href: '/admin/transport-landing', label: 'Transport Landing', icon: MapIcon },
];

const ADMISSION_NAV: NavItem[] = [
  { href: '/admin/admission-notices',          label: 'Admission Notices',     icon: Scroll },
  { href: '/admin/prospectus-entries',         label: 'Prospectus',            icon: FileText },
  { href: '/admin/admission-requirements',     label: 'Admission Requirements',icon: ClipboardList },
  { href: '/admin/program-fee-structures',     label: 'Program Fee Structures',icon: CircleDollarSign },
  { href: '/admin/admission-transfer-credits', label: 'Transfer Credits',      icon: ArrowLeftRight },
  { href: '/admin/waiver-scholarship-landing', label: 'Waiver/Scholarship Landing', icon: Layers },
  { href: '/admin/waiver-categories',          label: 'Waiver Categories',     icon: HeartHandshake },
  { href: '/admin/scholarships',               label: 'Scholarships',          icon: Trophy },
];

export default function Sidebar({
  user,
  newSubmissionCount,
}: {
  user: SidebarUser;
  newSubmissionCount: number;
}) {
  const pathname = usePathname();
  const isSuperAdmin = user.role === 'super_admin';
  // Auto-open the About Pages group when the active route is inside it.
  const aboutActive = ABOUT_PAGES_NAV.some((n) => pathname?.startsWith(n.href));
  const [aboutOpen, setAboutOpen] = useState<boolean>(aboutActive);
  const labSystemsActive = LAB_SYSTEMS_NAV.some((n) => pathname?.startsWith(n.href));
  const [labSystemsOpen, setLabSystemsOpen] = useState<boolean>(labSystemsActive);
  const contentHubsActive = CONTENT_HUBS_NAV.some((n) => pathname?.startsWith(n.href));
  const [contentHubsOpen, setContentHubsOpen] = useState<boolean>(contentHubsActive);
  const studentSocietyActive = STUDENT_SOCIETY_NAV.some((n) => pathname?.startsWith(n.href));
  const [studentSocietyOpen, setStudentSocietyOpen] = useState<boolean>(studentSocietyActive);
  const campusServicesActive = CAMPUS_SERVICES_NAV.some((n) => pathname?.startsWith(n.href));
  const [campusServicesOpen, setCampusServicesOpen] = useState<boolean>(campusServicesActive);
  const admissionActive = ADMISSION_NAV.some((n) => pathname?.startsWith(n.href));
  const [admissionOpen, setAdmissionOpen] = useState<boolean>(admissionActive);

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (res.ok) {
        window.location.href = '/admin/login';
        return;
      }
      toast.error('Sign-out failed — try the /admin/logout link');
    } catch {
      toast.error('Network error during sign-out');
    }
  }

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-accent/10 text-accent' : 'text-gray-700 hover:bg-gray-50'
    }`;

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          ME Admin
        </div>
        <div className="text-base font-display font-bold text-primary mt-1 leading-tight">
          Mechanical Engineering
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {PRIMARY_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(!!isActive(href))}>
            <Icon size={16} />
            {label}
          </Link>
        ))}

        {/* About Pages — collapsible group */}
        <button
          type="button"
          onClick={() => setAboutOpen((v) => !v)}
          aria-expanded={aboutOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            aboutActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <Info size={16} />
            About Pages
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {aboutOpen && (
          <div className="pl-6 space-y-1">
            {ABOUT_PAGES_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Lab Systems — collapsible group */}
        <button
          type="button"
          onClick={() => setLabSystemsOpen((v) => !v)}
          aria-expanded={labSystemsOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            labSystemsActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <FlaskConical size={16} />
            Lab Systems
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${labSystemsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {labSystemsOpen && (
          <div className="pl-6 space-y-1">
            {LAB_SYSTEMS_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Content Hubs — collapsible group (Phase 6) */}
        <button
          type="button"
          onClick={() => setContentHubsOpen((v) => !v)}
          aria-expanded={contentHubsOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            contentHubsActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <FolderOpen size={16} />
            Content Hubs
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${contentHubsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {contentHubsOpen && (
          <div className="pl-6 space-y-1">
            {CONTENT_HUBS_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Student Society — collapsible group (Phase 7) */}
        <button
          type="button"
          onClick={() => setStudentSocietyOpen((v) => !v)}
          aria-expanded={studentSocietyOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            studentSocietyActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <Users2 size={16} />
            Student Society
          </span>
          <ChevronDown size={14} className={`transition-transform ${studentSocietyOpen ? 'rotate-180' : ''}`} />
        </button>
        {studentSocietyOpen && (
          <div className="pl-6 space-y-1">
            {STUDENT_SOCIETY_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Campus Services — collapsible group (Phase 7) */}
        <button
          type="button"
          onClick={() => setCampusServicesOpen((v) => !v)}
          aria-expanded={campusServicesOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            campusServicesActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <Bus size={16} />
            Campus Services
          </span>
          <ChevronDown size={14} className={`transition-transform ${campusServicesOpen ? 'rotate-180' : ''}`} />
        </button>
        {campusServicesOpen && (
          <div className="pl-6 space-y-1">
            {CAMPUS_SERVICES_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Admission — collapsible group (Phase 8a, will host 8b + 8c) */}
        <button
          type="button"
          onClick={() => setAdmissionOpen((v) => !v)}
          aria-expanded={admissionOpen}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            admissionActive ? 'text-accent' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-3">
            <Scroll size={16} />
            Admission
          </span>
          <ChevronDown size={14} className={`transition-transform ${admissionOpen ? 'rotate-180' : ''}`} />
        </button>
        {admissionOpen && (
          <div className="pl-6 space-y-1">
            {ADMISSION_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(!!isActive(href))}>
                <span className="text-[10px] leading-none">●</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Contact Submissions — Phase 9 top-level (operational; the
            badge surfaces unread submissions without forcing a click). */}
        <Link
          href="/admin/contact-submissions"
          className={`${linkClass(!!pathname?.startsWith('/admin/contact-submissions'))} justify-between`}
        >
          <span className="flex items-center gap-3">
            <Mail size={16} />
            Contact Submissions
          </span>
          {newSubmissionCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold rounded-full bg-accent text-white">
              {newSubmissionCount}
            </span>
          )}
        </Link>

        {isSuperAdmin && (
          <Link
            href="/admin/users"
            className={linkClass(!!pathname?.startsWith('/admin/users'))}
          >
            <Users size={16} />
            Manage Admins
          </Link>
        )}

        <div className="border-t border-gray-100 mt-4 pt-4">
          <Link
            href="/admin/change-password"
            className={linkClass(pathname === '/admin/change-password')}
          >
            <Key size={16} />
            Change Password
          </Link>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="text-sm">
          <div className="font-medium text-gray-900 truncate">{user.name}</div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
          <div className="mt-1">
            <RoleBadge role={user.role} />
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function RoleBadge({ role }: { role: 'super_admin' | 'admin' }) {
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
        role === 'super_admin' ? 'bg-accent text-white' : 'bg-primary text-white'
      }`}
    >
      {role === 'super_admin' ? 'Super Admin' : 'Admin'}
    </span>
  );
}
