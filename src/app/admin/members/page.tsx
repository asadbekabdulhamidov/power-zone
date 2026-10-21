'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  User,
  Phone,
  CreditCard,
  AlertTriangle,
  Eye,
  Edit2,
  Trash2,
  Dumbbell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Member, MemberStatus } from '@/types';
import { formatUZS, formatDateUz, formatPhoneNumber, getDaysDifference } from '@/lib/utils';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';

export default function MembersPage() {
  const { members, plans, payments, addMember, updateMember, deleteMember, recordMemberVisit } =
    useFitnesFlow();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [paymentModalMemberId, setPaymentModalMemberId] = useState<string | null>(null);

  // Form states for Add Member
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+998');
  const [formPlanId, setFormPlanId] = useState(plans[0]?.id || '');
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formGender, setFormGender] = useState<'erkak' | 'ayol'>('erkak');
  const [formAge, setFormAge] = useState<number>(25);
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);

      const matchStatus =
        statusFilter === 'all' || m.status === statusFilter;

      const matchPlan =
        planFilter === 'all' || m.membershipPlanId === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [members, searchQuery, statusFilter, planFilter]);

  // Handle Add Member Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || formName.trim().length < 3) {
      setFormError('Ism-familiya kamida 3 ta harfdan iborat bo‘lishi kerak');
      return;
    }
    if (!formPhone || formPhone.length < 9) {
      setFormError('To‘g‘ri telefon raqamini kiriting');
      return;
    }

    const selectedPlan = plans.find((p) => p.id === formPlanId) || plans[0];
    const duration = selectedPlan.durationDays || 30;

    const startDateObj = new Date(formStartDate);
    const expiryDateObj = new Date(formStartDate);
    expiryDateObj.setDate(startDateObj.getDate() + duration);
    const expiryDateStr = expiryDateObj.toISOString().split('T')[0];

    // Placeholder avatar based on gender
    const defaultPhoto =
      formGender === 'ayol'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    addMember({
      fullName: formName.trim(),
      phone: formPhone.trim(),
      photoUrl: defaultPhoto,
      membershipPlanId: selectedPlan.id,
      membershipPlanName: selectedPlan.name,
      membershipPriceAgreed: selectedPlan.price,
      accessType: selectedPlan.accessType,
      startDate: formStartDate,
      expiryDate: expiryDateStr,
      status: 'active',
      gender: formGender,
      age: formAge,
      notes: formNotes.trim() || undefined,
    });

    // Reset and close
    setFormName('');
    setFormPhone('+998');
    setFormNotes('');
    setIsAddModalOpen(false);
  };

  // Handle Edit Member Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    updateMember(editingMember.id, {
      fullName: editingMember.fullName,
      phone: editingMember.phone,
      status: editingMember.status,
      notes: editingMember.notes,
      expiryDate: editingMember.expiryDate,
      startDate: editingMember.startDate,
    });

    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>A’zolar Boshqaruvi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-lime-400 font-bold border border-zinc-700">
              {members.length} ta a’zo
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Mijozlar ma’lumotlari, tariflar, tashriflar va to‘lov statuslari nazorati.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-lg shadow-lime-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi A’zo Qo‘shish</span>
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Ism yoki telefon raqami bo‘yicha izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-zinc-400" />}
            className="bg-[#090d16]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'active', label: 'Faol' },
            { id: 'expiring', label: 'Tugayotgan' },
            { id: 'expired', label: 'Tugagan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-lime-500 text-zinc-950 border-lime-400 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Plan Filter */}
        <div className="w-full md:w-48">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full bg-[#090d16] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
          >
            <option value="all">Barcha tariflar</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111827]/70 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>A’zo</TableHead>
              <TableHead>Tarif Rejasi</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead>Tugash Sanasi</TableHead>
              <TableHead>Haftalik Tashrif</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const daysLeft = getDaysDifference(member.expiryDate);

              return (
                <TableRow key={member.id}>
                  {/* Photo & Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photoUrl}
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm hover:text-lime-400 transition-colors">
                          {member.fullName}
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          <span>{formatPhoneNumber(member.phone)}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Plan & Agreed Price */}
                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-200">
                      {member.membershipPlanName}
                    </div>
                    <div className="text-[11px] text-lime-400 font-bold">
                      {formatUZS(member.membershipPriceAgreed)}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge status={member.status}>
                      {member.status === 'active' && 'Faol'}
                      {member.status === 'expiring' && 'Muddati oz qolgan'}
                      {member.status === 'expired' && 'Tugagan'}
                      {member.status === 'frozen' && 'Muzlatilgan'}
                    </Badge>
                  </TableCell>

                  {/* Dates */}
                  <TableCell>
                    <div className="text-xs text-zinc-300">
                      {formatDateUz(member.expiryDate)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)} kun avval o‘tgan`
                        : daysLeft === 0
                        ? 'Bugun tugaydi'
                        : `${daysLeft} kun qoldi`}
                    </div>
                  </TableCell>

                  {/* Weekly Visits Tracker */}
                  <TableCell>
                    {member.accessType === 'weekly_3_days' ? (
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                          <span className="text-zinc-400">Bu hafta:</span>
                          <span
                            className={
                              member.visitsThisWeek >= 3
                                ? 'text-rose-400 font-bold'
                                : 'text-lime-400'
                            }
                          >
                            {member.visitsThisWeek}/3 kun
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              member.visitsThisWeek >= 3 ? 'bg-rose-500' : 'bg-lime-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (member.visitsThisWeek / 3) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : member.accessType === 'single_visit' ? (
                      <span className="text-xs text-zinc-400">1 martalik ruxsat</span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">
                        Cheksiz tashrif
                      </span>
                    )}
                  </TableCell>

                  {/* Action buttons */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Check-in / Visit button */}
                      <button
                        onClick={() => recordMemberVisit(member.id)}
                        title="Tashrifni qayd etish"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-lime-500 hover:text-zinc-950 text-zinc-300 transition-colors"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                      </button>

                      {/* View details */}
                      <button
                        onClick={() => setViewingMember(member)}
                        title="Tafsilotlarni ko‘rish"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingMember(member)}
                        title="Tahrirlash"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Haqiqatan ham "${member.fullName}"ni o‘chirasizmi?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        title="O‘chirish"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="max-w-xs mx-auto text-zinc-400">
                    <User className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                    <p className="text-sm font-semibold text-zinc-300">A’zolar topilmadi</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Qidiruv mezonlariga mos a’zo mavjud emas yoki ro‘yxat bo‘sh.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi A’zo Qo‘shish"
        description="Fitnes klubga yangi mijozni ro‘yxatdan o‘tkazing va abonement biriktiring."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <Input
            label="To‘liq Ism-Familiya"
            placeholder="Masalan: Dilshodbek Aliyev"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Telefon Raqami"
              placeholder="+998 90 123 45 67"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              required
            />

            <Select
              label="Jinsi"
              options={[
                { label: 'Erkak', value: 'erkak' },
                { label: 'Ayol', value: 'ayol' },
              ]}
              value={formGender}
              onChange={(e) => setFormGender(e.target.value as 'erkak' | 'ayol')}
            />

            <Input
              label="Yoshi"
              type="number"
              min={10}
              max={99}
              value={formAge}
              onChange={(e) => setFormAge(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tarif Rejasi"
              options={plans.map((p) => ({
                label: `${p.name} (${formatUZS(p.price)})`,
                value: p.id,
              }))}
              value={formPlanId}
              onChange={(e) => setFormPlanId(e.target.value)}
            />

            <Input
              label="Boshlanish Sanasi"
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Qo‘shimcha Izoh (ixtiyoriy)"
            placeholder="Salomatlik, maqsadlar yoki boshqa ma'lumotlar..."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="w-4 h-4" />
              <span>A’zoni Saqlash</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <Modal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          title="A’zo Ma’lumotlarini Tahrirlash"
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Ism-Familiya"
              value={editingMember.fullName}
              onChange={(e) =>
                setEditingMember({ ...editingMember, fullName: e.target.value })
              }
              required
            />

            <Input
              label="Telefon Raqami"
              value={editingMember.phone}
              onChange={(e) =>
                setEditingMember({ ...editingMember, phone: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Holati"
                options={[
                  { label: 'Faol', value: 'active' },
                  { label: 'Muddati oz qolgan', value: 'expiring' },
                  { label: 'Tugagan', value: 'expired' },
                  { label: 'Muzlatilgan', value: 'frozen' },
                ]}
                value={editingMember.status}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
                    status: e.target.value as MemberStatus,
                  })
                }
              />

              <Input
                label="Tugash Sanasi"
                type="date"
                value={editingMember.expiryDate}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, expiryDate: e.target.value })
                }
              />
            </div>

            <Input
              label="Izoh"
              value={editingMember.notes || ''}
              onChange={(e) =>
                setEditingMember({ ...editingMember, notes: e.target.value })
              }
            />

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingMember(null)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="primary">
                O‘zgarishlarni Saqlash
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MEMBER DETAIL VIEW MODAL */}
      {viewingMember && (
        <Modal
          isOpen={!!viewingMember}
          onClose={() => setViewingMember(null)}
          title="A’zo Profili va Tafsilotlari"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-zinc-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewingMember.photoUrl}
                  alt={viewingMember.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {viewingMember.fullName}
                  </h3>
                  <Badge status={viewingMember.status}>
                    {viewingMember.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-lime-400" />
                  <span>{formatPhoneNumber(viewingMember.phone)}</span>
                </p>
                <div className="text-xs text-zinc-500 mt-1">
                  A’zo bo‘lgan sana: {formatDateUz(viewingMember.createdAt)}
                </div>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className="p-4 rounded-xl bg-[#090d16] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Amaldagi Tarif
                  </span>
                  <div className="text-base font-bold text-white">
                    {viewingMember.membershipPlanName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Kelishilgan Narx (Tarixiy)
                  </span>
                  <div className="text-base font-black text-lime-400">
                    {formatUZS(viewingMember.membershipPriceAgreed)}
                  </div>
                </div>
              </div>

              {/* Attendance rule alert */}
              {viewingMember.accessType === 'weekly_3_days' && (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-600/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Haftasiga 3 kun qoidasi:</span> Ushbu tarifda a’zo haftaning istalgan 3 kunini tanlashi mumkin. Bu haftada: {viewingMember.visitsThisWeek}/3 kun qayd etilgan.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500">Boshlanish:</span>
                  <p className="font-semibold text-zinc-200">{formatDateUz(viewingMember.startDate)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Tugash:</span>
                  <p className="font-semibold text-zinc-200">{formatDateUz(viewingMember.expiryDate)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Bu haftadagi tashrif:</span>
                  <p className="font-semibold text-lime-400">{viewingMember.visitsThisWeek} marta</p>
                </div>
                <div>
                  <span className="text-zinc-500">Jami tashriflar:</span>
                  <p className="font-semibold text-zinc-200">{viewingMember.totalVisits} marta</p>
                </div>
              </div>
            </div>

            {/* Member's payment history */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                A’zoning To‘lovlar Tarixi
              </h4>
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sana</TableHead>
                      <TableHead>Kvitansiya</TableHead>
                      <TableHead>Summa</TableHead>
                      <TableHead>Usuli</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .filter((p) => p.memberId === viewingMember.id)
                      .map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs">{formatDateUz(p.paymentDate)}</TableCell>
                          <TableCell className="text-xs font-mono text-zinc-400">{p.receiptNumber}</TableCell>
                          <TableCell className="text-xs font-bold text-lime-400">{formatUZS(p.amount)}</TableCell>
                          <TableCell className="text-xs uppercase text-zinc-300">{p.paymentMethod}</TableCell>
                        </TableRow>
                      ))}
                    {payments.filter((p) => p.memberId === viewingMember.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-xs text-zinc-500">
                          To‘lovlar tarixi topilmadi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => recordMemberVisit(viewingMember.id)}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Tashrifni qayd etish (+1)</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const id = viewingMember.id;
                    setViewingMember(null);
                    setPaymentModalMemberId(id);
                  }}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Yangi To‘lov Kiritish</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewingMember(null)}
                >
                  Yopish
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Payment Modal opened from member detail */}
      {paymentModalMemberId && (
        <QuickPaymentModal
          isOpen={!!paymentModalMemberId}
          onClose={() => setPaymentModalMemberId(null)}
          preselectedMemberId={paymentModalMemberId}
        />
      )}
    </div>
  );
}
