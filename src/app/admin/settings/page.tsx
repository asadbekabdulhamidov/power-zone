'use client';

import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
  Save,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFitnesFlow } from '@/context/fitnes-context';

export default function AdminSettingsPage() {
  const { adminProfile, updateAdminPassword, updateAdminProfile, resetToDefault } =
    useFitnesFlow();

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile edit state
  const [fullName, setFullName] = useState(adminProfile.fullName);
  const [email, setEmail] = useState(adminProfile.email);
  const [phone, setPhone] = useState(adminProfile.phone);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Joriy parolni kiriting');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Yangi parollar bir-biriga mos kelmadi');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('Yangi parol joriy paroldan farq qilishi lozim');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = updateAdminPassword(currentPassword, newPassword);
      setIsSubmitting(false);

      if (result.success) {
        setPasswordSuccess('Parol muvaffaqiyatli almashtirildi! Yangi parol kuchga kirdi.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(result.message);
      }
    }, 400);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-lime-400" />
          <span>Sozlamalar va Xavfsizlik</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Administrator parolini yangilash, shaxsiy profil ma’lumotlari va tizim parametrlari.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Change Password Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-zinc-800/90 bg-[#111827]/80 shadow-2xl">
            <CardHeader className="p-6 pb-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-white">
                    Admin Parolini O‘zgartirish
                  </CardTitle>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tizim xavfsizligini ta’minlash uchun parolingizni muntazam yangilab turing.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <Input
                    label="Joriy Parol"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Joriy parolingizni kiriting"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        tabIndex={-1}
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    helperText="Standart demo parol: power2026!"
                  />
                </div>

                {/* New Password */}
                <div>
                  <Input
                    label="Yangi Parol"
                    type={showNew ? 'text' : 'password'}
                    placeholder="Kamida 6 ta belgi"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        tabIndex={-1}
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <Input
                    label="Yangi Parolni Qayta Kiriting"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Yangi parolni tasdiqlang"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>

                {/* Password rules tips */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        newPassword.length >= 6 ? 'bg-lime-400' : 'bg-zinc-600'
                      }`}
                    />
                    <span className={newPassword.length >= 6 ? 'text-zinc-200 font-medium' : ''}>
                      Parol uzunligi kamida 6 ta belgidan iborat
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        newPassword && newPassword === confirmPassword
                          ? 'bg-lime-400'
                          : 'bg-zinc-600'
                      }`}
                    />
                    <span
                      className={
                        newPassword && newPassword === confirmPassword
                          ? 'text-zinc-200 font-medium'
                          : ''
                      }
                    >
                      Ikkala kiritilgan yangi parol bir-biriga to‘liq mos keladi
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="lime"
                    size="md"
                    className="w-full sm:w-auto"
                    isLoading={isSubmitting}
                  >
                    <KeyRound className="w-4 h-4 mr-1.5" />
                    <span>Yangi Parolni Saqlash</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Profile & Gym Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Admin Profile Details */}
          <Card className="border-zinc-800/90 bg-[#111827]/80 shadow-2xl">
            <CardHeader className="p-6 pb-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-600 text-zinc-950 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-white">
                    Administrator Profili
                  </CardTitle>
                  <p className="text-xs text-zinc-400">
                    Aloqa ma’lumotlari va tizimdagi rolingiz
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleProfileSave} className="space-y-4">
                <Input
                  label="To‘liq Ism"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4 text-zinc-500" />}
                  required
                />

                <Input
                  label="Email Manzili (Login)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
                  required
                />

                <Input
                  label="Telefon Raqami"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-zinc-500" />}
                  required
                />

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Lavozim:</span>
                  <span className="font-bold text-lime-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{adminProfile.role}</span>
                  </span>
                </div>

                <Button type="submit" variant="secondary" size="sm" className="w-full">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>Profil Ma’lumotlarini Yangilash</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Club Identity Overview */}
          <Card className="border-zinc-800/90 bg-[#111827]/80">
            <CardHeader className="p-6 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Klub Rekvizitlari</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Klub nomi:</span>
                <span className="font-bold text-white">Power Zone</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Hudud / Manzil:</span>
                <span className="font-semibold text-zinc-200 text-right max-w-[200px]">
                  Farg‘ona viloyati, Quva tumani, Akbarobod markazi
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Asosiy valyuta:</span>
                <span className="font-bold text-lime-400">UZS (So‘m)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Ish vaqti:</span>
                <span className="font-semibold text-zinc-200">07:00 – 23:00</span>
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        'Barcha ma’lumotlarni va admin parolini boshlang‘ich holatga qaytarasizmi?'
                      )
                    ) {
                      resetToDefault();
                      setFullName('Azizbek Admin');
                      setEmail('admin@powerzone.uz');
                      setPhone('+998 (90) 123-45-67');
                    }
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Dastlabki Demo Holatga Qaytarish</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
