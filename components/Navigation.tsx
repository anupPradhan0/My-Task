'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, CalendarDays, BarChart, FolderKanban } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Planner', href: '/planner', icon: CalendarDays },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200/60 bg-[#F7F7F5] md:flex">
        <div className="flex h-14 items-center px-4 mt-2">
          <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm tracking-tight">
            <div className="h-5 w-5 rounded bg-slate-800 text-white flex items-center justify-center shadow-sm">
              <CheckSquare className="h-3 w-3" />
            </div>
            FocusTrack
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-200/50 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <div className="h-6 w-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
            <CheckSquare className="h-4 w-4" />
          </div>
          FocusTrack
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-slate-200 bg-white/80 backdrop-blur-md md:hidden pb-safe">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'fill-blue-50/50' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
