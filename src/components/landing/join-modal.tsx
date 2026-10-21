'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MembershipPlan } from '@/types';
import { formatUZS } from '@/lib/utils';
import { useFitnesFlow } from '@/context/fitnes-context';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

export function JoinModal({ isOpen, onClose, plan }: JoinModalProps) {
  const { addMember, showToast } = useFitnesFlow();

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
    if (phone.length < 9) {
      setError('Iltimos, telefon raqamingizni to‘liq kiriting');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + plan.durationDays);
    const expDateStr = expDate.toISOString().split('T')[0];

    const photo =
      gender === 'ayol'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

    const cleanTelegram = telegram.trim()
      ? telegram.trim().startsWith('@')
        ? telegram.trim()
        : `@${telegram.trim()}`
      : undefined;

    const cleanInstagram = instagram.trim()
      ? instagram.trim().replace(/^@/, '')
      : undefined;

    addMember({
      fullName: fullName.trim(),
      phone: phone.trim(),
      photoUrl: photo,
      telegramUsername: cleanTelegram,
      instagramUsername: cleanInstagram,
      membershipPlanId: plan.id,
      membershipPlanName: plan.name,
      membershipPriceAgreed: plan.price,
      accessType: plan.accessType,
      startDate: today,
      expiryDate: expDateStr,
      status: 'active',
      gender,
      notes: 'Sayt orqali onlayn ariza qoldirdi.',
    });

    setIsSuccess(true);
    showToast(`Tabriklaymiz, ${fullName}! A’zolik arizangiz qabul qilindi.`);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('+998 ');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Arizangiz Qabul Qilindi!' : 'Power Zone A’zosi Bo‘ling'}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center mx-auto shadow-lg shadow-lime-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white">
              Xush kelibsiz, {fullName}!
            </h4>
            <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
              Siz tanlagan <strong>&ldquo;{plan.name}&rdquo;</strong> ({formatUZS(plan.price)}) tarifi bo‘yicha arizangiz ma’muriyat tizimiga kiritildi. Menejerimiz tez orada siz bilan bog‘lanadi.
            </p>
          </div>
          <div className="pt-4 border-t border-zinc-800">
            <Button variant="lime" onClick={handleClose} className="w-full">
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
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  gender === 'erkak'
                    ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                Erkak
              </button>
              <button
                type="button"
                onClick={() => setGender('ayol')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  gender === 'ayol'
                    ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                Ayol
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 leading-snug">
            Tugmani bosish orqali Power Zone klub qoidalariga rozilik bildirasiz.
          </p>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="lime">
              <Sparkles className="w-4 h-4 mr-1 text-zinc-950" />
              <span>A’zolikni Tasdiqlash</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
