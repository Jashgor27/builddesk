'use client';

import { useState } from 'react';
import { Building2, LayoutDashboard, FolderKanban, Sparkles, Settings, User, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Modal } from '@/components/ui';
import type { ReactNode } from 'react';

const NAV = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'AI Assistant', to: '/ai-assistant', icon: Sparkles },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Profile', to: '/profile', icon: User },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { push: navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => path === to || (to !== '/dashboard' && path.startsWith(to));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent navigate={navigate} isActive={isActive} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col animate-slideInRight shadow-pop">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 rounded-lg p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              navigate={(to) => {
                navigate(to);
                setMobileOpen(false);
              }}
              isActive={isActive}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500 flex-1">
            <span className="hidden sm:inline">Bhuj, Kutch</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="text-slate-700 font-medium">5 active projects</span>
          </div>
          <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-slate-100 transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
              AK
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700">Anil K.</span>
          </Link>
        </header>

        <main className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  navigate,
  isActive,
}: {
  navigate: (to: string) => void;
  isActive: (to: string) => boolean;
}) {
  const [signOutOpen, setSignOutOpen] = useState(false);
  return (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-base font-bold text-slate-900 leading-none">BuildDesk</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Construction Management</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</div>
        {NAV.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon className={`h-[18px] w-[18px] ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-4 w-4 text-primary-400" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Ask Your Project
          </div>
          <p className="mt-1.5 text-xs text-primary-100 leading-relaxed">
            AI-powered answers from your project data.
          </p>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white hover:text-primary-100"
          >
            Try it now <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <button onClick={() => setSignOutOpen(true)} className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
      <Modal open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign out">
        <p className="text-sm text-slate-600">Sign out of this mock BuildDesk session?</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setSignOutOpen(false)} className="btn-secondary btn-md">Cancel</button>
          <button onClick={() => navigate('/login')} className="btn-primary btn-md">Sign out</button>
        </div>
      </Modal>
    </>
  );
}
