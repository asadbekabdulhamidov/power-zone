'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  RefreshCw,
  User,
  ShieldCheck,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFitnesFlow } from '@/context/fitnes-context';
import { formatDateUz } from '@/lib/utils';

interface TopbarProps {
  onToggleMobile: () => void;
  title: string;
  subtitle?: string;
  onOpenQuickPayment?: () => void;
}

export function AdminTopbar({
  onToggleMobile,
  title,
  subtitle,
  onOpenQuickPayment,
}: TopbarProps) {
  const { notifications, resetToDefault, adminProfile } = useFitnesFlow();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="h-18 px-4 sm:px-6 bg-[#0d131f]/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 focus:outline-none"
          aria-label="Menyu ochish"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-400 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications, Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Today's Date */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{formatDateUz(todayStr)}</span>
        </div>

        {/* Quick Payment Button */}
        {onOpenQuickPayment && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenQuickPayment}
            className="hidden sm:inline-flex text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>To‘lov kiritish</span>
          </Button>
        )}

        {/* Reset Mock Data demo button */}
        <button
          onClick={() => {
            if (confirm("Hamma o'zgarishlarni boshlang'ich mock holatga qaytarasizmi?")) {
              resetToDefault();
            }
          }}
          title="Demo ma'lumotlarni qayta tiklash"
          className="p-2 text-zinc-400 hover:text-lime-400 hover:bg-zinc-800/60 rounded-xl transition-colors border border-transparent hover:border-zinc-700"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Icon */}
        <Link
          href="/admin/notifications"
          className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors border border-zinc-800/80"
          title="Muddati yaqinlashgan va o'tganlar"
        >
          <Bell className="w-4 h-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </Link>

        {/* Settings Shortcut */}
        <Link
          href="/admin/settings"
          className="p-2 text-zinc-400 hover:text-lime-400 hover:bg-zinc-800/60 rounded-xl transition-colors border border-zinc-800/80"
          title="Sozlamalar va Parol almashtirish"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Profile Card linking to settings */}
        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 pl-2 border-l border-zinc-800 hover:opacity-90 transition-opacity group"
          title="Admin sozlamalari"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-lime-500/10 group-hover:ring-2 group-hover:ring-lime-400/50 transition-all">
            <User className="w-4 h-4 text-zinc-950" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors">
                {adminProfile.fullName}
              </span>
              <ShieldCheck className="w-3 h-3 text-lime-400" />
            </div>
            <p className="text-[10px] text-zinc-400">{adminProfile.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
