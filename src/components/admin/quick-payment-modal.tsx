'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useFitnesFlow } from '@/context/fitnes-context';
import { PaymentMethod } from '@/types';
import { formatUZS, formatDateUz, parseNumericInput } from '@/lib/utils';
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface QuickPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
}

export function QuickPaymentModal({
  isOpen,
  onClose,
  preselectedMemberId,
}: QuickPaymentModalProps) {
  const { members, plans, addPayment } = useFitnesFlow();

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [monthsCount, setMonthsCount] = useState<number>(1);
  const [amount, setAmount] = useState<number | ''>(300000);
  const [includeOldDebt, setIncludeOldDebt] = useState<boolean>(true);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected member object
  const currentMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId),
    [members, selectedMemberId]
  );

  // Selected plan object
  const currentPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId]
  );

  const isSingleVisit = currentPlan?.accessType === 'single_visit';

  // Monthly rate based on plan or member agreement
  const monthlyRate = useMemo(() => {
    if (!currentPlan) return 200000;
    if (currentMember && currentMember.membershipPlanId === currentPlan.id) {
      return currentMember.membershipPriceAgreed || currentPlan.price;
    }
    return currentPlan.price;
  }, [currentPlan, currentMember]);

  // Plan total for chosen months
  const planTotal = useMemo(() => {
    return isSingleVisit ? monthlyRate : monthlyRate * monthsCount;
  }, [isSingleVisit, monthlyRate, monthsCount]);

  // Existing debt
  const existingDebt = currentMember?.debtAmount || 0;

  // Target total expected
  const targetTotal = useMemo(() => {
    return planTotal + (includeOldDebt ? existingDebt : 0);
  }, [planTotal, includeOldDebt, existingDebt]);

  // Calculated remaining debt if paying `amount`
  const remainingDebt = useMemo(() => {
    return Math.max(0, targetTotal - (Number(amount) || 0));
  }, [targetTotal, amount]);

  // Projected new expiration date
  const projectedExpiryDate = useMemo(() => {
    if (!currentMember) return '';
    const payDate = paymentDate || new Date().toISOString().split('T')[0];
    const durationDays = isSingleVisit
      ? 1
      : (currentPlan?.durationDays || 30) * monthsCount;
    const currentExp = new Date(currentMember.expiryDate);
    const payDateObj = new Date(payDate);
    const baseDate =
      currentExp > payDateObj ? new Date(currentExp) : new Date(payDateObj);
    baseDate.setDate(baseDate.getDate() + durationDays);
    return baseDate.toISOString().split('T')[0];
  }, [currentMember, paymentDate, currentPlan, monthsCount, isSingleVisit]);

  // Sync member when preselectedMemberId changes or modal opens
  useEffect(() => {
    if (preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
      const member = members.find((m) => m.id === preselectedMemberId);
      if (member) {
        setSelectedPlanId(member.membershipPlanId);
        const plan = plans.find((p) => p.id === member.membershipPlanId);
        const rate = member.membershipPriceAgreed || plan?.price || 200000;
        const debt = member.debtAmount || 0;
        setAmount(rate + debt);
        setIncludeOldDebt(debt > 0);
      }
    } else if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
      setSelectedPlanId(members[0].membershipPlanId);
      const plan = plans.find((p) => p.id === members[0].membershipPlanId);
      const rate = members[0].membershipPriceAgreed || plan?.price || 200000;
      const debt = members[0].debtAmount || 0;
      setAmount(rate + debt);
      setIncludeOldDebt(debt > 0);
    }
  }, [preselectedMemberId, members, plans, selectedMemberId]);

  // When member changes, update default plan, price and reset months
  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId);
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedPlanId(member.membershipPlanId);
      const plan = plans.find((p) => p.id === member.membershipPlanId);
      const rate = member.membershipPriceAgreed || plan?.price || 200000;
      const debt = member.debtAmount || 0;
      setMonthsCount(1);
      setAmount(rate + debt);
      setIncludeOldDebt(debt > 0);
    }
  };

  // When plan changes, update price
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      const rate =
        currentMember && currentMember.membershipPlanId === planId
          ? currentMember.membershipPriceAgreed
          : plan.price;
      const months = plan.accessType === 'single_visit' ? 1 : monthsCount;
      if (plan.accessType === 'single_visit') setMonthsCount(1);
      const debt = includeOldDebt ? existingDebt : 0;
      setAmount(rate * months + debt);
    }
  };

  // When months change, adjust amount to target total
  const handleMonthsChange = (newMonths: number) => {
    const validMonths = Math.max(1, newMonths);
    setMonthsCount(validMonths);
    const newTotal = isSingleVisit
      ? monthlyRate
      : monthlyRate * validMonths + (includeOldDebt ? existingDebt : 0);
    setAmount(newTotal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedMemberId) {
      setError('Iltimos, a’zoni tanlang');
      return;
    }
    if (!selectedPlanId) {
      setError('Iltimos, tarif rejasini tanlang');
      return;
    }
    const numAmount = amount === '' ? 0 : Number(amount);
    if (numAmount <= 0) {
      setError('To‘lov summasi 0 dan katta bo‘lishi lozim');
      return;
    }

    if (!currentMember || !currentPlan) {
      setError('Tanlangan ma’lumotlar topilmadi');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      addPayment({
        memberId: currentMember.id,
        memberName: currentMember.fullName,
        memberPhone: currentMember.phone,
        membershipPlanId: currentPlan.id,
        membershipPlanName: currentPlan.name,
        amount: numAmount,
        monthsCount: isSingleVisit ? 1 : monthsCount,
        expectedAmount: targetTotal,
        remainingDebt: remainingDebt,
        paymentDate,
        paymentMethod,
        status: 'completed',
        notes:
          notes.trim() ||
          (remainingDebt > 0
            ? `Qisman to‘lov (${monthsCount} oy). Qarz: ${formatUZS(remainingDebt)}`
            : `${monthsCount} oylik to‘liq to‘lov`),
      });

      setIsLoading(false);
      onClose();
    }, 350);
  };

  const memberOptions = members.map((m) => {
    const debtStr = m.debtAmount && m.debtAmount > 0 ? ` [⚠️ Qarz: ${formatUZS(m.debtAmount)}]` : '';
    return {
      label: `${m.fullName} (${m.phone}) — ${m.membershipPlanName}${debtStr}`,
      value: m.id,
    };
  });

  const planOptions = plans.map((p) => ({
    label: `${p.name} — ${formatUZS(p.price)}/oy`,
    value: p.id,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yangi To‘lovni Qayd Etish"
      description="A’zolik muddatini 1 yoki bir necha oyga uzaytirish, qisman to‘lov yoki qarzni so‘ndirish."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Member Selector */}
        <Select
          label="Mijoz (A’zo)"
          options={memberOptions}
          value={selectedMemberId}
          onChange={(e) => handleMemberChange(e.target.value)}
          required
        />

        {/* Existing Member Debt Banner */}
        {existingDebt > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Mijozning to‘lanmagan qarzi bor: </span>
                <span className="font-extrabold text-amber-200">
                  {formatUZS(existingDebt)}
                </span>
              </div>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold bg-amber-900/50 px-2.5 py-1 rounded-lg border border-amber-700/60 hover:bg-amber-800/60">
              <input
                type="checkbox"
                checked={includeOldDebt}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIncludeOldDebt(checked);
                  const newTotal = planTotal + (checked ? existingDebt : 0);
                  setAmount(newTotal);
                }}
                className="rounded border-amber-600 bg-zinc-900 text-lime-500 focus:ring-0"
              />
              <span>Ushbu to‘lovga qo‘shish</span>
            </label>
          </div>
        )}

        {/* Plan Selector */}
        <Select
          label="Tarif Rejasi"
          options={planOptions}
          value={selectedPlanId}
          onChange={(e) => handlePlanChange(e.target.value)}
          required
        />

        {/* DURATION / MONTHS COUNT PICKER */}
        {!isSingleVisit && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lime-400" />
                <span>To‘lov Muddati (Necha oylik to‘lov?)</span>
              </label>
              <span className="text-xs font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full border border-lime-500/20">
                {monthsCount} oy ({monthsCount * 30} kun)
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { months: 1, label: '1 oy' },
                { months: 2, label: '2 oy' },
                { months: 3, label: '3 oy' },
                { months: 6, label: '6 oy' },
                { months: 12, label: '12 oy (1 yil)' },
              ].map((item) => (
                <button
                  key={item.months}
                  type="button"
                  onClick={() => handleMonthsChange(item.months)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                    monthsCount === item.months
                      ? 'bg-lime-500 text-zinc-950 border-lime-400 font-extrabold shadow-md shadow-lime-500/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BILLING BREAKDOWN CARD */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-1.5">
          <div className="flex justify-between text-zinc-400">
            <span>Tarif narxi:</span>
            <span className="text-zinc-200 font-medium">
              {formatUZS(monthlyRate)} / oy
            </span>
          </div>

          {!isSingleVisit && (
            <div className="flex justify-between text-zinc-400">
              <span>Tanlangan muddat:</span>
              <span className="text-zinc-200 font-medium">
                {monthsCount} oylik to‘lov ({monthsCount * 30} kun)
              </span>
            </div>
          )}

          {includeOldDebt && existingDebt > 0 && (
            <div className="flex justify-between text-amber-400">
              <span>Eski to‘lanmagan qarz:</span>
              <span className="font-bold">+{formatUZS(existingDebt)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
            <span className="font-bold text-white">Hisoblangan Jami Summa:</span>
            <span className="font-black text-lime-400 text-base">
              {formatUZS(targetTotal)}
            </span>
          </div>
        </div>

        {/* AMOUNT & DATE INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Haqiqatda To‘lanayotgan Summa (UZS)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseNumericInput(e.target.value))}
              min={0}
              step={5000}
              required
              helperText={`So'mda: ${formatUZS(amount)}`}
            />

            {/* Quick helper buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setAmount(targetTotal)}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-lime-400 border border-zinc-700 cursor-pointer"
              >
                To‘liq to‘lov ({formatUZS(targetTotal)})
              </button>
              {targetTotal >= 200000 && (
                <button
                  type="button"
                  onClick={() => setAmount(Math.round(targetTotal / 2))}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
                >
                  Yarmi (50%): {formatUZS(Math.round(targetTotal / 2))}
                </button>
              )}
              {targetTotal !== 100000 && (
                <button
                  type="button"
                  onClick={() => setAmount(100000)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
                >
                  100,000 UZS
                </button>
              )}
            </div>
          </div>

          <div>
            <Input
              label="To‘lov Sanasi"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />

            {/* Projected Expiry Preview */}
            {projectedExpiryDate && (
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                <Calendar className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>
                  Yangi a’zolik muddati:{' '}
                  <strong className="text-white">
                    {formatDateUz(projectedExpiryDate)}
                  </strong>{' '}
                  gacha uzaytiriladi.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC DEBT CALCULATION BANNER */}
        {remainingDebt > 0 ? (
          <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-800 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-300">
                ⚠️ Qisman to‘lov qayd etilmoqda!
              </div>
              <div>
                Jami <strong className="text-white">{formatUZS(targetTotal)}</strong> dan{' '}
                <strong className="text-white">{formatUZS(amount)}</strong> to‘lanmoqda.
              </div>
              <div className="text-rose-300 font-extrabold text-xs pt-1">
                Mijoz hisobiga yoziladigan qarz: {formatUZS(remainingDebt)}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-lime-950/50 border border-lime-800/60 text-lime-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>
              To‘lov to‘liq amalga oshirilmoqda. Mijozda qarz qolmaydi (0 UZS).
            </span>
          </div>
        )}

        {/* PAYMENT METHOD SELECTOR */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            To‘lov Usuli
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'cash', label: 'Naqd pul' },
              { id: 'card', label: 'Bank kartasi' },
              { id: 'click', label: 'Click' },
              { id: 'payme', label: 'Payme' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                  paymentMethod === method.id
                    ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold shadow-sm'
                    : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Izoh (ixtiyoriy)"
          placeholder="To‘lov haqida qo‘shimcha ma’lumot..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Bekor qilish
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <CheckCircle2 className="w-4 h-4" />
            <span>To‘lovni tasdiqlash</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}