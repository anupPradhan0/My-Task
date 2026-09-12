'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, CalendarDays, BarChart3, FolderKanban } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Planner', href: '/planner', icon: CalendarDays },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-[var(--ink)] ${compact ? 'text-base' : 'text-sm'}`}>
      <div className={`rounded-lg bg-[var(--ink)] text-white flex items-center justify-center shadow-sm ${compact ? 'h-7 w-7' : 'h-6 w-6'}`}>
        <CheckSquare className={compact ? 'h-3.5 w-3.5' : 'h-3 w-3'} strokeWidth={2.5} />
      </div>
      FocusTrack
    </div>
  );
}

function isActivePath(pathname: string | null, href: string) {
  return pathname === href || (href !== '/' && !!pathname?.startsWith(href));
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-[var(--line)]/70 bg-white/50 backdrop-blur-md">
      <div className="flex h-16 items-center px-5">
        <Brand />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigation.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'text-[var(--muted)] hover:bg-white/80 hover:text-[var(--ink)]'
              }`}
            >
              <item.icon className={`h-4 w-4 transition-colors ${active ? 'text-white' : 'text-[var(--faint)] group-hover:text-[var(--ink)]'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-[11px] text-[var(--faint)]">
        Stay focused. Ship daily.
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <header className="flex h-14 w-full shrink-0 items-center border-b border-[var(--line)]/70 bg-white/70 px-4 backdrop-blur-md md:hidden">
      <Brand compact />
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 w-full border-t border-[var(--line)]/80 bg-white/85 backdrop-blur-md md:hidden pb-safe">
      {navigation.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 transition-colors ${
              active ? 'text-[var(--accent)]' : 'text-[var(--faint)]'
            }`}
          >
            {active && (
              <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--accent)]" />
            )}
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
            <span className="max-w-full truncate text-[10px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
