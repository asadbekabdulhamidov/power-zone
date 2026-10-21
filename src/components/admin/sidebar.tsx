'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Bell,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFitnesFlow } from '@/context/fitnes-context';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { notifications } = useFitnesFlow();

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
      name: 'Mahsulotlar katalogi',
      href: '/admin/products',
      icon: ShoppingBag,
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#0d131f] border-r border-zinc-800/80 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center gap-3 border-b border-zinc-800/60 bg-zinc-950/40">
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
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/30 space-y-2">
        <div className="p-3 rounded-xl bg-lime-950/20 border border-lime-500/20 mb-3">
          <div className="flex items-center gap-2 text-lime-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quva • Akbarobod Filiali</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Bugungi smena: 07:00 – 23:00. Barcha zonalar faol.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          <span>Mijozlar saytiga o‘tish</span>
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Tizimdan chiqish</span>
        </Link>
      </div>
    </aside>
  );
}
