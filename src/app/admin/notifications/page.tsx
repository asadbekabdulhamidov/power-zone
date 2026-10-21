'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Calendar,
  Phone,
  Copy,
  Send,
  CreditCard,
  CheckCircle,
  Info,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { formatUZS, formatDateUz, formatPhoneNumber } from '@/lib/utils';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';

export default function NotificationsPage() {
  const { notifications, showToast } = useFitnesFlow();
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'overdue'>('today');
  const [quickPayMemberId, setQuickPayMemberId] = useState<string | null>(null);

  // Group notifications
  const dueToday = notifications.filter((n) => n.dueType === 'today');
  const dueTomorrow = notifications.filter((n) => n.dueType === 'tomorrow');
  const overdue = notifications.filter((n) => n.dueType === 'overdue');

  const currentList =
    activeTab === 'today' ? dueToday : activeTab === 'tomorrow' ? dueTomorrow : overdue;

  const handleCopyPhone = (phone: string, name: string) => {
    navigator.clipboard.writeText(phone);
    showToast(`${name}ning telefon raqami nusxalandi: ${phone}`, 'info');
  };

  const handleOpenTelegram = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, '');
    window.open(`https://t.me/+${clean}`, '_blank');
    showToast(`${name} bilan Telegram orqali bog‘lanish oynasi ochildi.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Abonement Muddatlari va Eslatmalar</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
            {notifications.length} ta eslatma
          </span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Muddati bugun yoki ertaga tugaydigan hamda to‘lov muddati o‘tib ketgan a’zolar nazorati.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            {
              id: 'today',
              label: 'Bugun tugaydiganlar',
              count: dueToday.length,
              icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
            },
            {
              id: 'tomorrow',
              label: 'Ertaga tugaydiganlar',
              count: dueTomorrow.length,
              icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />,
            },
            {
              id: 'overdue',
              label: 'Muddati o‘tganlar',
              count: overdue.length,
              icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
            },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'today' | 'tomorrow' | 'overdue')}
        />

        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-lime-400" />
          <span>Harakatlar orqali mijoz bilan to‘g‘ridan-to‘g‘ri bog‘lanishingiz mumkin</span>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111827]/70 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mijoz (A’zo)</TableHead>
              <TableHead>Tarif Rejasi</TableHead>
              <TableHead>Tugash Sanasi</TableHead>
              <TableHead>Abonement Narxi</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead className="text-right">Aloqa va To‘lov</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentList.map((item) => (
              <TableRow key={item.id}>
                {/* Name & Phone */}
                <TableCell>
                  <div className="font-bold text-white text-sm">
                    {item.memberName}
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-zinc-500" />
                    <span>{formatPhoneNumber(item.memberPhone)}</span>
                  </div>
                </TableCell>

                {/* Plan */}
                <TableCell className="text-xs font-semibold text-zinc-200">
                  {item.planName}
                </TableCell>

                {/* Expiry Date */}
                <TableCell>
                  <div className="text-xs font-medium text-zinc-300">
                    {formatDateUz(item.expiryDate)}
                  </div>
                  {item.daysOverdue !== undefined && item.daysOverdue > 0 && (
                    <div className="text-[10px] text-rose-400 font-bold">
                      {item.daysOverdue} kun kechikkan
                    </div>
                  )}
                </TableCell>

                {/* Price & Debt */}
                <TableCell>
                  <div className="text-xs font-black text-lime-400">
                    {formatUZS(item.amount)}
                  </div>
                  {item.debtAmount && item.debtAmount > 0 && (
                    <div className="text-[10px] font-extrabold text-rose-400 mt-0.5">
                      ⚠️ Qarz: {formatUZS(item.debtAmount)}
                    </div>
                  )}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {item.dueType === 'today' ? (
                    <Badge variant="expired">Bugun tugaydi</Badge>
                  ) : item.dueType === 'tomorrow' ? (
                    <Badge variant="expiring">Ertaga tugaydi</Badge>
                  ) : (
                    <Badge variant="expired">Muddati o‘tgan</Badge>
                  )}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    {/* Copy Phone */}
                    <button
                      onClick={() => handleCopyPhone(item.memberPhone, item.memberName)}
                      title="Telefon raqamni nusxalash"
                      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Telegram link */}
                    <button
                      onClick={() => handleOpenTelegram(item.memberPhone, item.memberName)}
                      title="Telegramda xabar yozish"
                      className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400 hover:bg-sky-900 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Payment Button */}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setQuickPayMemberId(item.memberId)}
                      className="h-8 px-2.5 text-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      <span>To‘lov</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {currentList.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-400 text-xs">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm font-semibold text-zinc-200">
                    Ushbu toifada muddati tugayotgan a’zolar yo‘q!
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Barcha a’zolik muddatlari to‘g‘ri holatda.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MEMBERSHIP RULES & SMS ARCHITECTURE CALLOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rules Explainer */}
        <div className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Klub A’zolik Qoidalari va Tashriflar Nazorati</span>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <strong className="text-white block mb-0.5">
                1. &ldquo;Haftasiga 3 kun&rdquo; tarifi:
              </strong>
              A’zo o‘z jadvaliga mos istalgan 3 kunni tanlashi mumkin. Qat’iy haftaning kunlari talab qilinmaydi. Tizim a’zolik haftasi davomida ko‘pi bilan 3 ta qayd etilgan tashrifga ruxsat beradi (limitdan oshib ketishiga yo‘l qo‘yilmaydi).
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <strong className="text-white block mb-0.5">
                2. &ldquo;Oylik cheklanmagan&rdquo; tarifi:
              </strong>
              Faol a’zolik muddati davomida cheksiz va istalgan vaqtda kirish ruxsat etiladi.
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <strong className="text-white block mb-0.5">
                3. &ldquo;Bir martalik mashg‘ulot&rdquo; tarifi:
              </strong>
              Faqat 1 ta qayd etilgan mashg‘ulot uchun mo‘ljallangan.
            </div>
          </div>
        </div>

        {/* SMS / Notifications Disclaimer */}
        <div className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Avtomatik SMS Integratsiyasi Haqida</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mt-2">
              Ushbu frontend prototipda telefon raqamini nusxalash va Telegram / Qo‘ng‘iroq qilish havolalari keltirilgan. Haqiqiy SMS yuborish (Eskiz.uz yoki PlayMobile agregatorlari orqali) backend tizimi integratsiya qilingandan so‘ng avtomatik ishga tushiriladi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>SMS Shabloni:</span>
            <span className="text-lime-400 font-mono">&ldquo;Hurmatli [Ism], Power Zone abonementingiz...&rdquo;</span>
          </div>
        </div>
      </div>

      {/* Quick Payment Modal */}
      {quickPayMemberId && (
        <QuickPaymentModal
          isOpen={!!quickPayMemberId}
          onClose={() => setQuickPayMemberId(null)}
          preselectedMemberId={quickPayMemberId}
        />
      )}
    </div>
  );
}
