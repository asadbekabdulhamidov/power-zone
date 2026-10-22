'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CreditCard,
  DollarSign,
  Printer,
  CheckCircle2,
  Dumbbell,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Payment, PaymentMethod } from '@/types';
import { formatUZS, formatDateUz, formatPhoneNumber, parseNumericInput } from '@/lib/utils';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

export default function PaymentsPage() {
  const { payments, members, plans, stats, updatePayment, deletePayment } = useFitnesFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Edit payment states
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editPlanId, setEditPlanId] = useState<string>('');
  const [editAmount, setEditAmount] = useState<number | ''>(0);
  const [editMethod, setEditMethod] = useState<PaymentMethod>('cash');
  const [editDate, setEditDate] = useState<string>('');
  const [editMonths, setEditMonths] = useState<number>(1);
  const [editDebt, setEditDebt] = useState<number | ''>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  // Delete payment state
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const currentEditPlan = useMemo(
    () => plans.find((p) => p.id === editPlanId),
    [plans, editPlanId]
  );

  const editExpectedTotal = useMemo(() => {
    const rate = currentEditPlan?.price || 200000;
    const isSingle = currentEditPlan?.accessType === 'single_visit';
    return isSingle ? rate : rate * (Number(editMonths) || 1);
  }, [currentEditPlan, editMonths]);

  const projectedNewExpiryDate = useMemo(() => {
    if (!editingPayment) return '';
    const targetMember = members.find((m) => m.id === editingPayment.memberId);
    const startDateBase =
      targetMember?.startDate || editDate || new Date().toISOString().split('T')[0];
    const durationDays =
      (currentEditPlan?.accessType === 'single_visit' ? 1 : 30) * (Number(editMonths) || 1);
    const dateObj = new Date(startDateBase);
    dateObj.setDate(dateObj.getDate() + durationDays);
    return dateObj.toISOString().split('T')[0];
  }, [editingPayment, members, editDate, currentEditPlan, editMonths]);

  const handleOpenEdit = (p: Payment) => {
    setEditingPayment(p);
    setEditPlanId(p.membershipPlanId || (plans[0]?.id ?? ''));
    setEditAmount(p.amount);
    setEditMethod(p.paymentMethod);
    setEditDate(p.paymentDate ? p.paymentDate.split('T')[0] : '');
    setEditMonths(p.monthsCount || 1);
    setEditDebt(p.remainingDebt !== undefined ? p.remainingDebt : 0);
    setEditNotes(p.notes || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    const numAmount = editAmount === '' ? 0 : Number(editAmount);
    const numDebt = editDebt === '' ? 0 : Number(editDebt);

    updatePayment(editingPayment.id, {
      amount: numAmount,
      paymentMethod: editMethod,
      paymentDate: editDate,
      monthsCount: editMonths,
      remainingDebt: numDebt,
      notes: editNotes.trim() || undefined,
      membershipPlanId: currentEditPlan?.id || editingPayment.membershipPlanId,
      membershipPlanName: currentEditPlan?.name || editingPayment.membershipPlanName,
      newExpiryDate: projectedNewExpiryDate,
    });

    setEditingPayment(null);
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.memberPhone.includes(searchQuery) ||
        p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;

      return matchSearch && matchMethod;
    });
  }, [payments, searchQuery, methodFilter]);

  const totalAllTimeRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const totalDebt = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.debtAmount || 0), 0);
  }, [members]);

  const debtorsCount = useMemo(() => {
    return members.filter((m) => m.debtAmount && m.debtAmount > 0).length;
  }, [members]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>To‘lovlar Boshqaruvi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-lime-400 font-bold border border-zinc-700">
              {payments.length} ta to‘lov
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Kassaga qabul qilingan barcha to‘lovlar tarixi, kvitansiyalar va tushumlar nazorati.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewPaymentModalOpen(true)}
          className="shadow-lg shadow-lime-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi To‘lov Kiritish</span>
        </Button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Bugungi Tushum
            </p>
            <div className="text-2xl font-black text-lime-400 mt-1">
              {formatUZS(stats.todayRevenue)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Bugun qabul qilingan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Jami Tushum
            </p>
            <div className="text-2xl font-black text-white mt-1">
              {formatUZS(totalAllTimeRevenue)}
            </div>
            <p className="text-[11px] text-emerald-400 mt-0.5">Barcha to‘lovlar yig‘indisi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Jami Kvitansiyalar
            </p>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {payments.length} ta
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Muvaffaqiyatli to‘lovlar</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Umumiy Qarz Miqdori
            </p>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {formatUZS(totalDebt)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {debtorsCount > 0 ? `${debtorsCount} ta a’zoda qarz mavjud` : 'Qarzlar mavjud emas'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Mijoz ismi, telefon yoki kvitansiya raqami bo‘yicha izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-zinc-400" />}
            className="bg-[#090d16]"
          />
        </div>

        {/* Payment Method Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'cash', label: 'Naqd' },
            { id: 'card', label: 'Karta' },
            { id: 'click', label: 'Click' },
            { id: 'payme', label: 'Payme' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMethodFilter(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
                methodFilter === item.id
                  ? 'bg-lime-500 text-zinc-950 border-lime-400 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111827]/70 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kvitansiya №</TableHead>
              <TableHead>Mijoz (A’zo)</TableHead>
              <TableHead>Tarif va Muddat</TableHead>
              <TableHead>To‘langan Summa</TableHead>
              <TableHead>Qarz Qoldig‘i</TableHead>
              <TableHead>To‘lov Usuli</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs font-semibold text-lime-400">
                  {payment.receiptNumber}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white text-xs">
                    {payment.memberName}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {formatPhoneNumber(payment.memberPhone)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-semibold text-zinc-200">
                    {payment.membershipPlanName}
                  </div>
                  {payment.monthsCount && payment.monthsCount > 1 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-lime-400 bg-lime-500/10 px-1.5 py-0.5 rounded border border-lime-500/20 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{payment.monthsCount} oy ({payment.monthsCount * 30} kun)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">1 oylik</span>
                  )}
                </TableCell>
                <TableCell className="font-black text-sm text-lime-400">
                  {formatUZS(payment.amount)}
                </TableCell>
                <TableCell>
                  {payment.remainingDebt && payment.remainingDebt > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 shadow-sm">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                      <span>Qarz: {formatUZS(payment.remainingDebt)}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>To‘liq</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {payment.paymentMethod === 'cash' && 'Naqd pul'}
                    {payment.paymentMethod === 'card' && 'Terminal (Karta)'}
                    {payment.paymentMethod === 'click' && 'Click'}
                    {payment.paymentMethod === 'payme' && 'Payme'}
                    {payment.paymentMethod === 'other' && 'Boshqa'}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-zinc-300">
                  {formatDateUz(payment.paymentDate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReceipt(payment)}
                      className="h-8 px-2 text-xs border-zinc-700 hover:border-lime-500/50"
                      title="Kvitansiya ko‘rish va chop etish"
                    >
                      <Receipt className="w-3.5 h-3.5 mr-1 text-lime-400" />
                      <span className="hidden sm:inline">Kvitansiya</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(payment)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="To‘lovni tahrirlash"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentToDelete(payment)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
                      title="To‘lovni o‘chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-zinc-400 text-xs">
                  To‘lovlar topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* NEW PAYMENT MODAL */}
      <QuickPaymentModal
        isOpen={isNewPaymentModalOpen}
        onClose={() => setIsNewPaymentModalOpen(false)}
      />

      {/* RECEIPT PREVIEW MODAL */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="To‘lov Kvitansiyasi"
          maxWidth="md"
        >
          <div className="space-y-6">
            {/* Printable Receipt Paper Container */}
            <div
              id="printable-receipt"
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-sans shadow-inner relative overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-500" />

              {/* Gym Header */}
              <div className="text-center pb-4 border-b border-zinc-800/80">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 mb-2">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black tracking-tight text-white uppercase">
                  POWER ZONE FITNESS CLUB
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Farg‘ona viloyati, Quva tumani, Akbarobod markazi
                </p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Tel: +998 (71) 200 44 22 • STIR: 308942110
                </p>
              </div>

              {/* Receipt Meta */}
              <div className="py-4 space-y-2 border-b border-zinc-800/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Kvitansiya raqami:</span>
                  <span className="font-mono font-bold text-lime-400">
                    {selectedReceipt.receiptNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sana va vaqt:</span>
                  <span className="text-zinc-200">
                    {formatDateUz(selectedReceipt.paymentDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Mijoz:</span>
                  <span className="font-semibold text-white">
                    {selectedReceipt.memberName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Telefon:</span>
                  <span className="text-zinc-200">
                    {formatPhoneNumber(selectedReceipt.memberPhone)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">To‘lov davri:</span>
                  <span className="font-semibold text-zinc-200">
                    {selectedReceipt.monthsCount || 1} oy (
                    {(selectedReceipt.monthsCount || 1) * 30} kun)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">To‘lov usuli:</span>
                  <span className="uppercase font-semibold text-zinc-200">
                    {selectedReceipt.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Item detail */}
              <div className="py-4 border-b border-zinc-800/80 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                  <span>Xizmat turi</span>
                  <span>Hisoblangan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">
                    {selectedReceipt.membershipPlanName} (
                    {selectedReceipt.monthsCount || 1} oylik)
                  </span>
                  <span className="font-bold text-zinc-200">
                    {formatUZS(
                      selectedReceipt.expectedAmount || selectedReceipt.amount
                    )}
                  </span>
                </div>

                {selectedReceipt.remainingDebt &&
                selectedReceipt.remainingDebt > 0 ? (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/70 text-xs flex justify-between items-center text-rose-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Qoldiq qarz summasi:</span>
                    </span>
                    <span className="font-black text-rose-300 text-sm">
                      {formatUZS(selectedReceipt.remainingDebt)}
                    </span>
                  </div>
                ) : null}

                {selectedReceipt.notes && (
                  <p className="text-[11px] text-zinc-400 italic">
                    Izoh: {selectedReceipt.notes}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Haqiqatda To‘langan
                  </span>
                  <div className="text-xl font-black text-lime-400">
                    {formatUZS(selectedReceipt.amount)}
                  </div>
                </div>
                <div className="text-right">
                  {selectedReceipt.remainingDebt &&
                  selectedReceipt.remainingDebt > 0 ? (
                    <div className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-700/50 px-2.5 py-0.5 rounded-full font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Qisman to‘landi</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>To‘liq to‘landi</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer barcode placeholder */}
              <div className="mt-5 pt-3 border-t border-dashed border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                  ||||| | |||||||| ||| |||||| ||||||||| |||
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Power Zone bilan birga sog‘lom hayot sari!
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
              >
                Yopish
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Chop etish</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT PAYMENT MODAL */}
      {editingPayment && (
        <Modal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          title="To‘lovni Tahrirlash"
          description="Noto‘g‘ri kiritilgan summa, to‘lov usuli yoki qarz qoldig‘ini to‘g‘rilang."
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Payment Summary Badge */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Mijoz:</span>
                <span className="font-bold text-white">
                  {editingPayment.memberName} ({formatPhoneNumber(editingPayment.memberPhone)})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Kvitansiya №:</span>
                <span className="font-mono text-lime-400 font-bold">{editingPayment.receiptNumber}</span>
              </div>
            </div>

            {/* Plan selection */}
            <div className="space-y-1">
              <Select
                label="Tarif Rejasi (Reja noto‘g‘ri kiritilgan bo‘lsa o‘zgartiring)"
                options={plans.map((p) => ({
                  label: `${p.name} (${formatUZS(p.price)}/oy)`,
                  value: p.id,
                }))}
                value={editPlanId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setEditPlanId(newId);
                  const pl = plans.find((item) => item.id === newId);
                  if (pl) {
                    const months = pl.accessType === 'single_visit' ? 1 : editMonths;
                    if (pl.accessType === 'single_visit') setEditMonths(1);
                    const newTotal = pl.price * months;
                    setEditAmount(newTotal);
                    setEditDebt(0);
                  }
                }}
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                <span>Reja bo‘yicha to‘liq summa: <strong className="text-lime-400">{formatUZS(editExpectedTotal)}</strong></span>
                {projectedNewExpiryDate && (
                  <span>Yangi a’zolik muddati: <strong className="text-zinc-200">{formatDateUz(projectedNewExpiryDate)}</strong></span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Input
                label="To‘langan Summa (UZS)"
                type="number"
                value={editAmount}
                onChange={(e) => {
                  const val = parseNumericInput(e.target.value);
                  setEditAmount(val);
                  // Auto-calculate suggested debt
                  const numVal = val === '' ? 0 : Number(val);
                  setEditDebt(Math.max(0, editExpectedTotal - numVal));
                }}
                min={0}
                step={5000}
                required
                helperText={`Formatlangan: ${formatUZS(editAmount)}`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditAmount(editExpectedTotal);
                    setEditDebt(0);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-lime-400 font-medium transition-colors"
                >
                  To‘liq summa qilish ({formatUZS(editExpectedTotal)})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="To‘lov Usuli"
                options={[
                  { label: 'Naqd pul (Cash)', value: 'cash' },
                  { label: 'Terminal / Karta', value: 'card' },
                  { label: 'Click', value: 'click' },
                  { label: 'Payme', value: 'payme' },
                  { label: 'Boshqa', value: 'other' },
                ]}
                value={editMethod}
                onChange={(e) => setEditMethod(e.target.value as PaymentMethod)}
              />

              <Input
                label="To‘lov Sanasi"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="To‘lov Muddati (oylar)"
                options={[
                  { label: '1 oy (30 kun)', value: '1' },
                  { label: '2 oy (60 kun)', value: '2' },
                  { label: '3 oy (90 kun)', value: '3' },
                  { label: '6 oy (180 kun)', value: '6' },
                  { label: '12 oy (360 kun)', value: '12' },
                ]}
                value={String(editMonths)}
                onChange={(e) => {
                  const m = Number(e.target.value) || 1;
                  setEditMonths(m);
                  const rate = currentEditPlan?.price || 200000;
                  const newTotal = rate * m;
                  setEditAmount(newTotal);
                  setEditDebt(0);
                }}
              />

              <Input
                label="Qoldiq Qarz (UZS)"
                type="number"
                value={editDebt}
                onChange={(e) => setEditDebt(parseNumericInput(e.target.value))}
                min={0}
                step={5000}
                helperText={
                  Number(editDebt) > 0
                    ? `Mijozda ${formatUZS(editDebt)} qarz qoladi`
                    : 'To‘liq to‘langan (0 UZS qarz)'
                }
              />
            </div>

            <Input
              label="Izoh (ixtiyoriy)"
              placeholder="Masalan: Summadagi xatolik to‘g‘rilandi"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingPayment(null)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="primary" size="sm">
                O‘zgarishlarni Saqlash
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE PAYMENT CONFIRMATION MODAL */}
      {paymentToDelete && (
        <ConfirmDeleteModal
          isOpen={!!paymentToDelete}
          onClose={() => setPaymentToDelete(null)}
          onConfirm={() => {
            if (paymentToDelete) {
              deletePayment(paymentToDelete.id);
              setPaymentToDelete(null);
            }
          }}
          title="To‘lovni O‘chirish"
          description="Haqiqatan ham ushbu to‘lov kvitansiyasini tizimdan butunlay o‘chirmoqchimisiz?"
          itemType="To‘lov Kvitansiyasi"
          itemName={`№ ${paymentToDelete.receiptNumber}`}
          itemDetails={
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Mijoz:</span>
                <span className="font-bold text-white">{paymentToDelete.memberName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">To‘langan summa:</span>
                <span className="font-extrabold text-lime-400 text-sm">
                  {formatUZS(paymentToDelete.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Tarif / Muddat:</span>
                <span className="text-zinc-200">
                  {paymentToDelete.membershipPlanName} ({paymentToDelete.monthsCount || 1} oy)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">To‘lov sanasi va usuli:</span>
                <span className="text-zinc-200">
                  {formatDateUz(paymentToDelete.paymentDate)} • {paymentToDelete.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
          }
          warningText="Ushbu to‘lov o‘chirilgach, uning moliyaviy yozuvi bekor qilinadi."
          confirmText="Ha, to‘lovni o‘chirish"
        />
      )}
    </div>
  );
}
