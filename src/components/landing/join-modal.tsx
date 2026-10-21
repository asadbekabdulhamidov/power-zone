'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MembershipPlan } from '@/types';
import { formatUZS } from '@/lib/utils';
import { useFitnesFlow } from '@/context/fitnes-context';
import {
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  Phone,
  Info,
} from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

export function JoinModal({ isOpen, onClose, plan }: JoinModalProps) {
  const { addContactMessage, showToast, websiteContent } = useFitnesFlow();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [gender, setGender] = useState<'erkak' | 'ayol'>('erkak');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Iltimos, ismingizni to‘liq kiriting');
      return;
    }
    if (phone.trim().length < 9) {
      setError('Iltimos, telefon raqamingizni to‘liq kiriting');
      return;
    }

    const cleanTelegram = telegram.trim()
      ? telegram.trim().startsWith('@')
        ? telegram.trim()
        : `@${telegram.trim()}`
      : undefined;

    const cleanInstagram = instagram.trim()
      ? instagram.trim().replace(/^@/, '')
      : undefined;

    // Send the join request directly to the Admin Inquiries / Messages inbox
    addContactMessage({
      fullName: fullName.trim(),
      phone: phone.trim(),
      subject: `Yangi A’zolik Arizasi: ${plan.name} (${formatUZS(plan.price)})`,
      message: `Mijoz sayt orqali "${plan.name}" (${formatUZS(plan.price)}, ${plan.durationDays} kunlik) tarifi uchun ariza qoldirdi. Jinsi: ${
        gender === 'erkak' ? 'Erkak' : 'Ayol'
      }. Telegram: ${cleanTelegram || 'kiritilmadi'}, Instagram: ${
        cleanInstagram || 'kiritilmadi'
      }. Eslatma: Mijoz zalga kelganida to‘lov qabul qilinib, shaxsiy a’zolik kartasi berilishi kutilmoqda.`,
    });

    setIsSuccess(true);
    showToast(`Arizangiz qabul qilindi! Zalga kelganingizda adminga murojaat qiling.`);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('+998 ');
    setTelegram('');
    setInstagram('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Arizangiz Muvaffaqiyatli Qabul Qilindi!' : 'Power Zone A’zosi Bo‘ling'}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-2 space-y-4">
          <div className="w-16 h-16 rounded-full bg-lime-500/15 border-2 border-lime-500/40 text-lime-400 flex items-center justify-center mx-auto shadow-lg shadow-lime-500/20 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h4 className="text-xl font-black text-white tracking-tight">
              Arizangiz Muvaffaqiyatli Qabul Qilindi!
            </h4>
            <p className="text-xs text-lime-400 font-bold mt-1">
              Hurmatli {fullName}, Power Zone klubiga xush kelibsiz!
            </p>
          </div>

          {/* MAIN INSTRUCTION HIGHLIGHT BOX */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-950/60 via-zinc-900 to-zinc-900 border border-lime-500/40 text-left space-y-2 shadow-xl">
            <div className="flex items-center gap-2.5 text-lime-400 font-black text-sm sm:text-base">
              <Building2 className="w-5 h-5 shrink-0 text-lime-400" />
              <span>Zalga kelganingizda adminga murojaat qiling</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Sizning tanlagan tarifingiz bo‘yicha arizangiz zal ma’muriyatiga yetkazildi. Mashg‘ulotni boshlash uchun zalimizga tashrif buyurib, <strong>qabulxonadagi adminga</strong> ismingiz yoki telefon raqamingizni aytsangiz kifoya.
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1.5 border-t border-zinc-800">
              Administrator to‘lovni (naqd, karta yoki Click/Payme orqali) qabul qilib, sizga shaxsiy a’zolik kartangizni va shkafingiz kalitini taqdim etadi.
            </p>
          </div>

          {/* SUMMARY DETAILS CARD */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Tanlangan tarif:</span>
              <span className="font-extrabold text-white">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">To‘lov summasi:</span>
              <span className="font-black text-lime-400 text-sm">
                {formatUZS(plan.price)}
              </span>
            </div>
            <div className="flex justify-between items-start pt-1.5 border-t border-zinc-800/80">
              <span className="text-zinc-400 flex items-center gap-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Manzil:</span>
              </span>
              <span className="text-zinc-200 text-right font-medium ml-2">
                {websiteContent.contact.address} ({websiteContent.contact.landmark})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Ish vaqti:</span>
              </span>
              <span className="text-zinc-200 font-medium">
                {websiteContent.contact.workingHoursWeekdays} (Har kuni)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>Qabulxona (Admin):</span>
              </span>
              <a
                href={`tel:${websiteContent.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="text-lime-400 font-bold hover:underline"
              >
                {websiteContent.contact.phone}
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <Button variant="lime" onClick={handleClose} className="w-full font-bold">
              Tushunarli, Rahmat!
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Plan Summary Badge */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400">
                Tanlangan Tarif
              </span>
              <p className="font-bold text-white text-sm">{plan.name}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-lime-400">
                {formatUZS(plan.price)}
              </span>
              <p className="text-[10px] text-zinc-400">{plan.durationDays} kun</p>
            </div>
          </div>

          <Input
            label="Ism va Familiyangiz"
            placeholder="Masalan: Jasur Eshmatov"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Telefon Raqamingiz"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Telegram (ixtiyoriy)"
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
            <Input
              label="Instagram (ixtiyoriy)"
              placeholder="@username"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Jinsingiz
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('erkak')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  gender === 'erkak'
                    ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Erkak
              </button>
              <button
                type="button"
                onClick={() => setGender('ayol')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  gender === 'ayol'
                    ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Ayol
              </button>
            </div>
          </div>

          {/* Info callout before submitting */}
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-300">
            <Info className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] text-zinc-400">
              Ushbu forma orqali arizangiz qabulxonaga yetkaziladi. To‘lov zalga kelganingizda qabulxona (admin)da qabul qilinadi.
            </p>
          </div>

          <p className="text-[10px] text-zinc-500 leading-snug">
            Tugmani bosish orqali Power Zone klub qoidalariga rozilik bildirasiz.
          </p>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="lime">
              <Sparkles className="w-4 h-4 mr-1 text-zinc-950" />
              <span>A’zolik Uchun Ariza Qoldirish</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
