'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';
import { api, TOKEN_STORAGE_KEY } from '@/lib/api-client';

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
  '/admin/website': {
    title: 'Sayt Boshqaruvi & Kontent CRUD',
    subtitle: 'Landing sahifasidagi matnlar, sarlavhalar, statistika va aloqa rekvizitlari',
  },
  '/admin/messages': {
    title: 'Mijozlar Murojaatlari',
    subtitle: 'Saytdan kelgan savollar, a’zolik so‘rovlari va xabarlar jurnali',
  },
  '/admin/settings': {
    title: 'Sozlamalar va Xavfsizlik',
    subtitle: 'Admin parolini yangilash va tizim parametrlari',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // If path is login page, render without sidebar/topbar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    // 1. LocalStorage va Cookie-da token mavjudligini tekshirish
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(TOKEN_STORAGE_KEY)
        : null;

    if (!token) {
      setIsAuthenticated(false);
      router.replace(
        `/admin/login?returnUrl=${encodeURIComponent(pathname || '/admin')}`
      );
      return;
    }

    // 2. Tokenni haqiqiy ekanligini live NestJS backend orqali tekshirish
    let isMounted = true;
    api.auth
      .getProfile()
      .then(() => {
        if (isMounted) setIsAuthenticated(true);
      })
      .catch((err) => {
        console.warn('Avtorizatsiya tekshiruvidan o‘tmadi:', err);
        if (isMounted) {
          api.auth.logout();
          setIsAuthenticated(false);
          router.replace(
            `/admin/login?reason=session_expired&returnUrl=${encodeURIComponent(
              pathname || '/admin'
            )}`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // Login sahifasi uchun layoutsiz render
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Token tekshirilayotganda yuklanish ekrani (kontent hech qachon chaqnab ko'rinmaydi)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4 select-none">
        <div className="w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center text-lime-400 mb-4 animate-pulse shadow-[0_0_25px_rgba(132,204,22,0.15)]">
          <ShieldCheck className="w-8 h-8 text-lime-400" />
        </div>
        <div className="flex items-center gap-2.5 text-white font-bold text-base tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
          <span>Xavfsizlik tekshiruvi...</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Power Zone boshqaruv tizimi autentifikatsiyasi
        </p>
      </div>
    );
  }

  // Token yo'q yoki eskirgan bo'lsa hech narsa ko'rsatilmaydi (loginga yo'naltirilmoqda)
  if (isAuthenticated === false) {
    return null;
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
