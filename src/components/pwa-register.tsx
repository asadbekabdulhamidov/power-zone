'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaRegister() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalledSuccess, setIsInstalledSuccess] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'windows' | 'other'>('other');

  useEffect(() => {
    // 1. Service Worker registratsiyasi (faqat brauzer muhitida)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker muvaffaqiyatli ro‘yxatga olindi:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker xatolik:', error);
        });
    }

    // 2. Standalone (allaqachon o'rnatilgan ilova sifatida ochilgan) holatini aniqlash
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Qurilma turini aniqlash (Android yoki Windows)
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('android')) {
      setDeviceType('android');
    } else if (ua.includes('windows')) {
      setDeviceType('windows');
    }

    // Sessiyada oldin yopilganligini tekshirish
    try {
      const dismissed = sessionStorage.getItem('powerzone_admin_pwa_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {}

    // 3. Brauzer o'rnatishga tayyor bo'lganida 'beforeinstallprompt' hodisasi
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // 4. Muvaffaqiyatli o'rnatilganda
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstalledSuccess(true);
      setTimeout(() => {
        setIsInstalledSuccess(false);
      }, 4000);
      console.log('[PWA] Power Zone Admin ilovasi muvaffaqiyatli o‘rnatildi!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Brauzerning rasmiy o'rnatish modal oynasini chaqirish
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] Foydalanuvchi Admin ilovasini o‘rnatishga rozilik berdi');
      setIsInstallable(false);
      setDeferredPrompt(null);
    } else {
      console.log('[PWA] Foydalanuvchi o‘rnatishni rad etdi');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('powerzone_admin_pwa_dismissed', 'true');
    } catch {}
  };

  // MUHIM QOIDA: Agar foydalanuvchi oddiy mijoz saytida bo'lsa (/), HECH QACHON o'rnatish oynasi chiqmaydi!
  // O'rnatish taklifi FAQAT Admin qismida (/admin yoki /admin/login) chiqadi.
  if (!isAdminRoute) {
    return null;
  }

  // Agar ilova allaqachon standalone ochilgan bo'lsa yoki prompt yo'q bo'lsa
  if (isStandalone || !isInstallable || isDismissed) {
    // Agar muvaffaqiyatli o'rnatilgan bo'lsa, xabarnoma ko'rsatish
    if (isInstalledSuccess) {
      return (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 border border-lime-500/40 text-white shadow-2xl shadow-lime-500/10">
            <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
            <span className="text-xs font-semibold">Power Zone Admin ilovasi o‘rnatildi!</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="p-4 rounded-2xl bg-[#0d131f]/95 backdrop-blur-xl border border-lime-500/30 text-white shadow-2xl shadow-black/80 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 shrink-0 shadow-[0_0_15px_rgba(132,204,22,0.15)]">
          {deviceType === 'android' ? (
            <Smartphone className="w-6 h-6" />
          ) : deviceType === 'windows' ? (
            <Monitor className="w-6 h-6" />
          ) : (
            <Download className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-white tracking-wide">
              {deviceType === 'windows'
                ? 'Power Zone Admin (Windows Dasturi)'
                : deviceType === 'android'
                ? 'Power Zone Admin (Android Ilovasi)'
                : 'Power Zone Admin ilovasini o‘rnatish'}
            </h4>
            <button
              onClick={handleDismiss}
              className="p-1 -mr-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">
            {deviceType === 'windows'
              ? 'Ish stolida alohida Windows dasturi sifatida o‘rnatish. Bosganda to‘g‘ridan-to‘g‘ri login va boshqaruv paneliga kiradi.'
              : 'Mobil telefon ekraniga admin ilovasi sifatida qo‘shish. Bosganda to‘g‘ridan-to‘g‘ri admin tizimiga kiradi.'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-lime-500/20 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>O‘rnatish</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Keyinroq
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
