'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Clock,
  Plus,
  Receipt,
  UserCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { formatUZS, formatDateUz, getDaysDifference } from '@/lib/utils';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';

export default function AdminDashboardPage() {
  const { stats, members, payments } = useFitnesFlow();
  const [quickPayMemberId, setQuickPayMemberId] = useState<string | null>(null);

  // Recent payments (first 5)
  const recentPayments = payments.slice(0, 5);

  // Upcoming renewals (members expiring today, tomorrow, or in next 3 days)
  const upcomingRenewals = members
    .filter((m) => {
      const diff = getDaysDifference(m.expiryDate);
      return diff >= 0 && diff <= 3;
    })
    .sort((a, b) => getDaysDifference(a.expiryDate) - getDaysDifference(b.expiryDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-[#121c2d] border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Xush kelibsiz, Administrator! 👋
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            FitnesFlow klubingizning bugungi ko‘rsatkichlari va tushumlar hisoboti.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/admin/members">
            <Button variant="secondary" size="sm" className="text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>A’zolarni ko‘rish</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickPayMemberId(members[0]?.id || '')}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>To‘lov qabul qilish</span>
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <Card className="border-zinc-800/80 bg-[#101726]/80 hover:border-zinc-700 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Jami A’zolar
              </p>
              <div className="text-2xl font-black text-white mt-1">
                {stats.totalMembers}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12% o‘tgan oyga nisbatan</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Memberships */}
        <Card className="border-zinc-800/80 bg-[#101726]/80 hover:border-zinc-700 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Faol Abonementlar
              </p>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {stats.activeMemberships}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Jami a’zolardan{' '}
                {Math.round((stats.activeMemberships / (stats.totalMembers || 1)) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Today's Recorded Revenue */}
        <Card className="border-zinc-800/80 bg-[#101726]/80 hover:border-zinc-700 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Bugungi Tushum
              </p>
              <div className="text-2xl font-black text-lime-400 mt-1">
                {formatUZS(stats.todayRevenue)}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Kassada qayd etilgan
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center shadow-[0_0_15px_rgba(132,204,22,0.15)]">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="border-zinc-800/80 bg-[#101726]/80 hover:border-zinc-700 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Muddati Tugayotganlar
              </p>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {stats.expiringSoonCount}
              </div>
              <Link
                href="/admin/notifications"
                className="text-[11px] text-amber-400/90 hover:underline flex items-center gap-1 mt-1 font-medium"
              >
                <span>Bildirishnomalarda ko‘rish</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Section */}
      <Card className="border-zinc-800/80 bg-[#111827]/70">
        <CardContent className="p-6">
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Two Column Section: Recent Payments & Upcoming Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments Widget */}
        <Card className="border-zinc-800/80 bg-[#111827]/70 flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-lime-400" />
                  <span>So‘nggi To‘lovlar</span>
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Oxirgi qabul qilingan tushumlar
                </p>
              </div>
              <Link
                href="/admin/payments"
                className="text-xs text-lime-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Barchasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mijoz</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead>Summa</TableHead>
                    <TableHead className="text-right">Usul</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-semibold text-white text-xs">
                          {p.memberName}
                        </div>
                        <div className="text-[11px] text-zinc-400">{p.memberPhone}</div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-300">
                        {p.membershipPlanName}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-lime-400">
                        {formatUZS(p.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {p.paymentMethod}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </div>

          <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/20 text-center">
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-400 hover:text-white">
                Barcha to‘lovlar tarixini ko‘rish →
              </Button>
            </Link>
          </div>
        </Card>

        {/* Upcoming Renewals Widget */}
        <Card className="border-zinc-800/80 bg-[#111827]/70 flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Kutilayotgan To‘lovlar</span>
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Muddati 1-3 kun ichida tugaydigan a’zolar
                </p>
              </div>
              <Link
                href="/admin/notifications"
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Barchasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>A’zo</TableHead>
                    <TableHead>Tugash Sanasi</TableHead>
                    <TableHead>Holati</TableHead>
                    <TableHead className="text-right">Amal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingRenewals.map((m) => {
                    const diff = getDaysDifference(m.expiryDate);
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="font-semibold text-white text-xs">
                            {m.fullName}
                          </div>
                          <div className="text-[11px] text-zinc-400">{m.membershipPlanName}</div>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-300">
                          {formatDateUz(m.expiryDate)}
                        </TableCell>
                        <TableCell>
                          {diff === 0 ? (
                            <Badge variant="expired">Bugun tugaydi</Badge>
                          ) : diff === 1 ? (
                            <Badge variant="expiring">Ertaga tugaydi</Badge>
                          ) : (
                            <Badge variant="expiring">{diff} kun qoldi</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setQuickPayMemberId(m.id)}
                            className="h-7 px-2.5 text-[11px]"
                          >
                            To‘lov
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {upcomingRenewals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-xs text-zinc-400">
                        Yaqin kunlarda muddati tugaydigan a’zolar yo‘q.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </div>

          <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/20 text-center">
            <Link href="/admin/notifications">
              <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-400 hover:text-white">
                Bildirishnomalar paneliga o‘tish →
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Modal for quick payment */}
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
