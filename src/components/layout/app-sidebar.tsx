'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

interface NavItem {
  title: string;
  href: string;
  icon: string;
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { title: 'Brands', href: '/brands', icon: 'folder_shared' },
  { title: 'Campaigns', href: '/campaigns', icon: 'campaign' },
  { title: 'AI Chat', href: '/chat', icon: 'auto_awesome' },
  { title: 'Support', href: '/requests', icon: 'support_agent' },
];

const bottomNavItems: NavItem[] = [
  { title: 'Settings', href: '/settings', icon: 'settings' },
];

function MaterialIcon({
  name,
  filled = false,
  className = '',
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}

export function AppSidebar({ user }: { user: UserInfo }) {
  const pathname = usePathname();
  const initials = (user.firstName[0] ?? '') + (user.lastName[0] ?? '');

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-outline-variant bg-surface">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#0a6d9e] text-sm font-bold text-white">
          KO
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-on-surface">
            KO Platform
          </h1>
          <p className="text-xs text-on-surface-variant">Marketing Intelligence</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <Link
          href="/campaigns"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[#0a6d9e] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/25"
        >
          <MaterialIcon name="add" className="text-lg" />
          Generate Campaign
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {mainNavItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <MaterialIcon name={item.icon} filled={isActive} className="text-xl" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-outline-variant/30 px-3 py-3">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <MaterialIcon name={item.icon} className="text-xl" />
            <span>{item.title}</span>
          </Link>
        ))}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <MaterialIcon name="logout" className="text-xl" />
            <span>Logout</span>
          </button>
        </form>
      </div>

      {/* User Avatar */}
      <div className="border-t border-outline-variant/30 px-4 py-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              alt={user.firstName}
              className="h-9 w-9 rounded-full object-cover"
              src={user.avatarUrl}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {initials}
            </div>
          )}
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-on-surface">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
