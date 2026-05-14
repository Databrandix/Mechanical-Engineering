'use client';

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
  Key,
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
];

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const isSuperAdmin = user.role === 'super_admin';

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

      <nav className="flex-1 px-3 py-4 space-y-1">
        {PRIMARY_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(!!isActive(href))}>
            <Icon size={16} />
            {label}
          </Link>
        ))}

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
