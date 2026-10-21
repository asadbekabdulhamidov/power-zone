'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Boshqaruv Paneli',
    subtitle: 'Klub holati, daromadlar va a’zolar dinamikasi',
  },
  '/admin/members': {
    title: 'A’zolar Ro‘yxati',
    subtitle: 'Zal a’zolari, shaxsiy ma’lumotlar va tashriflar statistikasi',
  },
  '/admin/memberships': {
    title: 'Tarif Rejalari',
    subtitle: 'Klub a’zolik tariflari, narxlar va qoidalar boshqaruvi',
  },
  '/admin/payments': {
    title: 'To‘lovlar Tarixi',
    subtitle: 'Mijoz to‘lovlari, tushumlar va kvitansiyalar hisobi',
  },
  '/admin/notifications': {
    title: 'Muddati Yaqinlashgan va O‘tganlar',
    subtitle: 'Abonementi bugun/ertaga tugaydigan va muddati o‘tgan a’zolar',
  },
  '/admin/products': {
    title: 'Mahsulotlar Katalogi',
    subtitle: 'Ichimliklar, vitaminlar va sport tovarlari ombori',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false);

  // If path is login page, render without sidebar/topbar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const currentRouteMeta = routeTitles[pathname] || {
    title: 'Power Zone Admin',
    subtitle: 'Klub boshqaruv tizimi (Quva, Akbarobod)',
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 shrink-0 h-screen sticky top-0 z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminTopbar
          title={currentRouteMeta.title}
          subtitle={currentRouteMeta.subtitle}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onOpenQuickPayment={() => setIsQuickPayOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Quick Payment Modal accessible globally across admin */}
      <QuickPaymentModal
        isOpen={isQuickPayOpen}
        onClose={() => setIsQuickPayOpen(false)}
      />
    </div>
  );
}
