'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useFitnesFlow } from '@/context/fitnes-context';
import { PaymentMethod } from '@/types';
import { formatUZS } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

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
  const [amount, setAmount] = useState<number>(300000);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync member when preselectedMemberId changes
  useEffect(() => {
    if (preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
      const member = members.find((m) => m.id === preselectedMemberId);
      if (member) {
        setSelectedPlanId(member.membershipPlanId);
        setAmount(member.membershipPriceAgreed);
      }
    } else if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
      setSelectedPlanId(members[0].membershipPlanId);
      setAmount(members[0].membershipPriceAgreed);
    }
  }, [preselectedMemberId, members, selectedMemberId]);

  // When member changes, update default plan and price
  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId);
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedPlanId(member.membershipPlanId);
      setAmount(member.membershipPriceAgreed);
    }
  };

  // When plan changes, optionally update price
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setAmount(plan.price);
    }
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
    if (!amount || amount <= 0) {
      setError('To‘lov summasi 0 dan katta bo‘lishi lozim');
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    const plan = plans.find((p) => p.id === selectedPlanId);

    if (!member || !plan) {
      setError('Tanlangan ma’lumotlar topilmadi');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      addPayment({
        memberId: member.id,
        memberName: member.fullName,
        memberPhone: member.phone,
        membershipPlanId: plan.id,
        membershipPlanName: plan.name,
        amount: Number(amount),
        paymentDate,
        paymentMethod,
        status: 'completed',
        notes: notes.trim() || undefined,
      });

      setIsLoading(false);
      onClose();
    }, 400);
  };

  const memberOptions = members.map((m) => ({
    label: `${m.fullName} (${m.phone}) - ${m.membershipPlanName}`,
    value: m.id,
  }));

  const planOptions = plans.map((p) => ({
    label: `${p.name} — ${formatUZS(p.price)}`,
    value: p.id,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yangi To‘lovni Qayd Etish"
      description="A’zolik muddatini uzaytirish yoki yangi to‘lov kvitansiyasini yaratish."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <Select
          label="Mijoz (A’zo)"
          options={memberOptions}
          value={selectedMemberId}
          onChange={(e) => handleMemberChange(e.target.value)}
          required
        />

        <Select
          label="Tarif Rejasi"
          options={planOptions}
          value={selectedPlanId}
          onChange={(e) => handlePlanChange(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="To‘lov Summasi (UZS)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1000}
            step={5000}
            required
            helperText={`So'mda: ${formatUZS(amount)}`}
          />

          <Input
            label="To‘lov Sanasi"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

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
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
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
          placeholder="To'lov haqida qo'shimcha ma'lumot..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
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
