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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Payment } from '@/types';
import { formatUZS, formatDateUz, formatPhoneNumber } from '@/lib/utils';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';

export default function PaymentsPage() {
  const { payments, stats } = useFitnesFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Jami Qayd Etilgan Tushum
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
            <p className="text-[11px] text-zinc-400 mt-0.5">100% muvaffaqiyatli</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
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
              <TableHead>Tarif Rejasi</TableHead>
              <TableHead>Summa</TableHead>
              <TableHead>To‘lov Usuli</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="text-right">Kvitansiya</TableHead>
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
                <TableCell className="text-xs text-zinc-300">
                  {payment.membershipPlanName}
                </TableCell>
                <TableCell className="font-black text-sm text-lime-400">
                  {formatUZS(payment.amount)}
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedReceipt(payment)}
                    className="h-8 px-2.5 text-xs border-zinc-700 hover:border-lime-500/50"
                  >
                    <Receipt className="w-3.5 h-3.5 mr-1 text-lime-400" />
                    <span>Ko‘rish</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-zinc-400 text-xs">
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
                  FITNESFLOW FITNESS CLUB
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Toshkent sh., Amir Temur shox ko‘chasi, 42-uy
                </p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Tel: +998 71 200 44 22 • STIR: 308942110
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
                  <span className="text-zinc-400">To‘lov usuli:</span>
                  <span className="uppercase font-semibold text-zinc-200">
                    {selectedReceipt.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Item detail */}
              <div className="py-4 border-b border-zinc-800/80">
                <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                  <span>Xizmat turi</span>
                  <span>Summa</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">
                    {selectedReceipt.membershipPlanName}
                  </span>
                  <span className="font-black text-lime-400">
                    {formatUZS(selectedReceipt.amount)}
                  </span>
                </div>
                {selectedReceipt.notes && (
                  <p className="text-[11px] text-zinc-400 mt-1 italic">
                    Izoh: {selectedReceipt.notes}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Jami To‘langan
                  </span>
                  <div className="text-xl font-black text-lime-400">
                    {formatUZS(selectedReceipt.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>To‘landi</span>
                  </div>
                </div>
              </div>

              {/* Footer barcode placeholder */}
              <div className="mt-5 pt-3 border-t border-dashed border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                  ||||| | |||||||| ||| |||||| ||||||||| |||
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  FitnesFlow bilan birga sog‘lom hayot sari!
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
    </div>
  );
}
