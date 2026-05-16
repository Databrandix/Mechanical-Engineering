import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Building2,
  GraduationCap,
  Info,
  Key,
  Microscope,
  Navigation,
  PanelBottom,
  University,
  Users,
  UsersRound,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-server';
import { RoleBadge } from '@/components/admin/Sidebar';

export const metadata = { title: 'Dashboard' };

export default async function DashboardHome() {
  const session = await getSession();
  if (!session?.user || !session?.session) redirect('/admin/login');

  const role = (session.user.role ?? 'admin') as 'super_admin' | 'admin';
  const isSuperAdmin = role === 'super_admin';

  const [programsCount, researchAreasCount, facultyCount, adminUsersCount, previousSession] =
    await Promise.all([
      prisma.program.count(),
      prisma.researchArea.count(),
      prisma.faculty.count(),
      isSuperAdmin ? prisma.user.count() : Promise.resolve(null),
      prisma.session.findFirst({
        where: {
          userId: session.user.id,
          createdAt: { lt: session.session.createdAt },
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

  const previousLoginAt = previousSession?.createdAt ?? null;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Welcome back, {session.user.name}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <RoleBadge role={role} />
          <span className="text-sm text-gray-500">{session.user.email}</span>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          At a glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Programs" value={programsCount} />
          <StatCard label="Total Research Areas" value={researchAreasCount} />
          <StatCard label="Total Faculty" value={facultyCount} />
          {isSuperAdmin && (
            <StatCard label="Total Admin Users" value={adminUsersCount!} />
          )}
          <StatCard
            label="Your last login"
            value={
              previousLoginAt
                ? new Date(previousLoginAt).toLocaleString()
                : 'First sign-in'
            }
            stringValue
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            href="/admin/department-identity"
            icon={Building2}
            title="Edit Department Identity"
            desc="Brand colors, logo, hero images, faculty name"
          />
          <ActionCard
            href="/admin/university-identity"
            icon={University}
            title="Edit University Identity"
            desc="Contact info, social URLs, footer logo, map"
          />
          <ActionCard
            href="/admin/programs"
            icon={GraduationCap}
            title="Manage Programs"
            desc="Add, edit, reorder, delete programs"
          />
          <ActionCard
            href="/admin/research-areas"
            icon={Microscope}
            title="Manage Research Areas"
            desc="Add, edit, reorder, delete research areas"
          />
          <ActionCard
            href="/admin/faculty"
            icon={UsersRound}
            title="Manage Faculty"
            desc="Faculty members, Dean & Head profiles, photos"
          />
          <ActionCard
            href="/admin/nav"
            icon={Navigation}
            title="Manage Navigation"
            desc="Top bar, quick access, main nav groups & items"
          />
          <ActionCard
            href="/admin/footer-links"
            icon={PanelBottom}
            title="Manage Footer Links"
            desc="Useful, Get in Touch, Quick & Legal columns"
          />
          <ActionCard
            href="/admin/about-overview"
            icon={Info}
            title="About — Overview"
            desc="Hero + paragraph content for /about/overview"
          />
          <ActionCard
            href="/admin/about-mission-vision"
            icon={Info}
            title="About — Mission & Vision"
            desc="Mission card + Vision card content"
          />
          <ActionCard
            href="/admin/about-mecha-club"
            icon={Info}
            title="About — Mecha Club"
            desc="Hero, intro, stats, activities, network"
          />
          {isSuperAdmin && (
            <ActionCard
              href="/admin/users"
              icon={Users}
              title="Manage Admins"
              desc="Add, edit, delete admin users · super_admin only"
            />
          )}
          <ActionCard
            href="/admin/change-password"
            icon={Key}
            title="Change My Password"
            desc="Update your own login password"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  stringValue,
}: {
  label: string;
  value: number | string;
  stringValue?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div
        className={`mt-2 ${
          stringValue
            ? 'text-base font-medium text-gray-900'
            : 'text-3xl font-display font-bold text-primary'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Building2;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-lg border border-gray-200 p-5 hover:border-accent hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-gray-900 leading-tight">
            {title}
          </div>
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}
