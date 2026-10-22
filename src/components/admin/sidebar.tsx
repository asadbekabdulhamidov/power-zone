'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Bell,
  ShoppingBag,
  Settings,
  Globe,
  MessageSquare,
  ExternalLink,
  LogOut,
  Dumbbell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFitnesFlow } from '@/context/fitnes-context';
import { api } from '@/lib/api-client';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, contactMessages } = useFitnesFlow();
  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'new').length;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    api.auth.logout();
    if (onCloseMobile) onCloseMobile();
    router.replace('/admin/login');
  };

  const navItems = [
    {
      name: 'Boshqaruv paneli',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'A’zolar',
      href: '/admin/members',
      icon: Users,
    },
    {
      name: 'Tarif rejalari',
      href: '/admin/memberships',
      icon: CreditCard,
    },
    {
      name: 'To‘lovlar tarixi',
      href: '/admin/payments',
      icon: Receipt,
    },
    {
      name: 'Bildirishnomalar',
      href: '/admin/notifications',
      icon: Bell,
      badge: notifications.length > 0 ? notifications.length : undefined,
    },
    {
      name: 'Murojaatlar',
      href: '/admin/messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      name: 'Mahsulotlar katalogi',
      href: '/admin/products',
      icon: ShoppingBag,
    },
    {
      name: 'Sayt boshqaruvi',
      href: '/admin/website',
      icon: Globe,
    },
    {
      name: 'Sozlamalar & Parol',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#0d131f] border-r border-zinc-800/80 flex flex-col justify-between select-none overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center gap-3 border-b border-zinc-800/60 bg-zinc-950/40 sticky top-0 z-10">
          <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.2)]">
            <Dumbbell className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                POWER <span className="text-lime-400">ZONE</span>
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Boshqaruv Paneli
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Asosiy Bo&apos;limlar
          </p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-lime-500 text-zinc-950 font-semibold shadow-md shadow-lime-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-lime-400'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-bold rounded-full',
                      isActive
                        ? 'bg-zinc-950 text-lime-400'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Links */}
      <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/40 space-y-1 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          <span>Mijozlar saytiga o‘tish</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </aside>
  );
}
