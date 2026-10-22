'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Dumbbell, ShieldCheck, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false);

  // Login sahifasi uchun layout va auth guard qo'llanilmaydi
  const isLoginPage = pathname === '/admin/login';

  // Auth holati: 'checking' | 'authenticated' | 'error' | 'unauthenticated'
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'error' | 'unauthenticated'>(
    isLoginPage ? 'authenticated' : 'checking'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    if (isLoginPage) {
      setAuthStatus('authenticated');
      return;
    }

    // 1. Brauzer xotirasidan tokenni tekshirish
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

    if (!token || token.trim().length < 20) {
      api.auth.logout();
      setAuthStatus('unauthenticated');
      if (typeof window !== 'undefined') {
        const returnUrl = encodeURIComponent(pathname);
        window.location.replace(`/admin/login?returnUrl=${returnUrl}`);
      }
      return;
    }

    // 2. Tokenni real backend API orqali tekshirish (GET /api/auth/me)
    setAuthStatus('checking');
    setErrorMessage(null);

    try {
      await api.auth.getProfile();
      setAuthStatus('authenticated');
    } catch (err: unknown) {
      const isUnauthorized =
        err &&
        typeof err === 'object' &&
        'statusCode' in err &&
        (err.statusCode === 401 || err.statusCode === 403);

      if (isUnauthorized) {
        api.auth.logout();
        setAuthStatus('unauthenticated');
        if (typeof window !== 'undefined') {
          window.location.replace('/admin/login?reason=session_expired');
        }
        return;
      }

      // Tarmoq yoki server xatoligi yuz bersa
      const msg =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : 'Serverga ulanishda xatolik yuz berdi. Backend uyg‘onayotgan bo‘lishi mumkin.';
      setErrorMessage(msg);
      setAuthStatus('error');
    }
  }, [pathname, isLoginPage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login sahifasi bo'lsa, to'g'ridan-to'g'ri bolalar komponentini render qilish
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 1. Tekshirilayotgan holat: Dark yuqori darajadagi xavfsizlik ekrani
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-6 text-slate-100 select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 shadow-[0_0_35px_rgba(132,204,22,0.25)] animate-pulse">
            <Dumbbell className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#090D16] border border-lime-500/40 flex items-center justify-center text-lime-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span>Xavfsizlik tekshiruvi...</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1.5 max-w-xs text-center leading-relaxed">
          Admin sessiyasi va ruxsatnomalar backend orqali tasdiqlanmoqda
        </p>
      </div>
    );
  }

  // 2. Tarmoq yoki server bilan aloqa xatosi ekrani
  if (authStatus === 'error') {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-6 text-slate-100 select-none">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#111827] border border-rose-900/60 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Backend bilan aloqa o‘rnatilmadi</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {errorMessage || 'Server javob bermadi yoki tarmoq uzildi.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={() => checkAuth()}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Qayta urinish</span>
            </button>
            <button
              onClick={() => {
                api.auth.logout();
                window.location.href = '/admin/login';
              }}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Loginga qaytish</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Ruxsat yo'q bo'lsa
  if (authStatus === 'unauthenticated') {
    return null;
  }

  // 4. Muvaffaqiyatli autentifikatsiyadan o'tgan holat
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
