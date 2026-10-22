'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dumbbell, Eye, EyeOff, ArrowLeft, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, TOKEN_STORAGE_KEY } from '@/lib/api-client';

const loginSchema = z.object({
  login: z.string().min(3, 'Kamida 3 ta belgi kiriting (masalan, admin yoki admin@fitnesflow.uz)'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak'),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  // Agar foydalanuvchi allaqachon tizimga kirgan bo'lsa, to'g'ridan-to'g'ri admin panelga yo'naltirish
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        api.auth
          .getProfile()
          .then(() => {
            window.location.href = '/admin';
          })
          .catch(() => {
            // Token yaroqsiz bo'lsa tozalash
            api.auth.logout();
          });
      }

      // Query param xabarlarini o'qish (masalan: ?reason=session_expired)
      const params = new URLSearchParams(window.location.search);
      const reason = params.get('reason');
      if (reason === 'session_expired') {
        setSessionNotice('Xavfsizlik talabi: Sessiyangiz muddati tugagan yoki token yaroqsiz. Iltimos, qaytadan tizimga kiring.');
      } else if (reason === 'unauthorized') {
        setSessionNotice('Admin panelga kirish uchun avval tizimga kirishingiz lozim.');
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: 'admin@fitnesflow.uz',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setFormError(null);
    setSessionNotice(null);

    try {
      // Haqiqiy backend orqali JWT autentifikatsiyadan o'tish
      await api.auth.login({
        login: data.login.trim(),
        password: data.password,
      });

      // Agar returnUrl parametri bo'lsa, o'sha manzilga, aks holda /admin ga o'tish
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const paramUrl = params?.get('returnUrl');
      const targetUrl = paramUrl && !paramUrl.includes('/login') && paramUrl.startsWith('/admin') ? paramUrl : '/admin';

      // Brauzerni to'liq yangilab o'tkazish (Next.js keshini aylanib o'tib, yangi cookie/tokenni serverga jo'natish uchun)
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    } catch (apiErr: unknown) {
      setIsSubmitting(false);

      // Agar noto'g'ri parol yoki login kiritilgan bo'lsa
      const isAuthError =
        apiErr &&
        typeof apiErr === 'object' &&
        'statusCode' in apiErr &&
        (apiErr.statusCode === 401 || apiErr.statusCode === 400);

      if (isAuthError) {
        const msg =
          'message' in apiErr && typeof apiErr.message === 'string'
            ? apiErr.message
            : 'Kiritilgan login yoki parol noto‘g‘ri! Iltimos, qaytadan tekshirib ko‘ring.';
        setFormError(msg);
        return;
      }

      // Server aloqasi uzilgan yoki Render uyg'onayotgan bo'lsa
      setFormError('Serverga ulanishda xatolik yuz berdi. Render backend uyg‘onayotgan bo‘lishi mumkin (bir oz kuting) yoki login/parol noto‘g‘ri.');
    }
  };

  const handleFillDemo = () => {
    setValue('login', 'admin@fitnesflow.uz');
    setValue('password', 'fitnes2026!');
    setValue('rememberMe', true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900/60 border border-zinc-800/80 px-3.5 py-2 rounded-xl backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Asosiy saytga qaytish</span>
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-lime-400 mb-4 shadow-[0_0_25px_rgba(132,204,22,0.25)]">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Power <span className="text-lime-400">Zone</span> Admin
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5">
            Klub ma’muriyati va boshqaruv tizimiga kirish
          </p>
        </div>

        {/* Session / Security notice if redirected */}
        {sessionNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3 backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{sessionNotice}</div>
          </div>
        )}

        {/* Security badge and demo helper */}
        <div className="mb-6 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-3 backdrop-blur-md">
          <ShieldAlert className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white">Xavfsiz Tizim:</span> Admin qismi PostgreSQL va JWT Bearer token bilan himoyalangan. Tizimga kirish uchun maxsus administrator hisob ma’lumotlari talab qilinadi.
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-1.5 block text-lime-400 hover:underline font-bold text-[11px] cursor-pointer"
            >
              Standart admin hisobini to‘ldirish (admin / fitnes2026!)
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#111827]/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <div>
              <Input
                label="Email yoki Foydalanuvchi nomi"
                placeholder="admin@fitnesflow.uz"
                leftIcon={<Mail className="w-4 h-4" />}
                {...register('login')}
                error={errors.login?.message}
                autoComplete="username"
              />
            </div>

            <div>
              <Input
                label="Parol"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-zinc-700 bg-zinc-900 text-lime-500 focus:ring-lime-500 focus:ring-offset-zinc-950"
                />
                <span>Meni eslab qolish</span>
              </label>

              <span className="text-zinc-500 cursor-not-allowed">
                Parolni unutdingizmi?
              </span>
            </div>

            <Button
              type="submit"
              variant="lime"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              <Sparkles className="w-4 h-4 mr-1 text-zinc-950" />
              <span>Tizimga kirish</span>
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          © {new Date().getFullYear()} Power Zone. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
