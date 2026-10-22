'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  Camera,
  CameraOff,
  Upload,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Member, MemberStatus, PaymentMethod, Payment } from '@/types';
import { formatUZS, formatDateUz, formatPhoneNumber, getDaysDifference, parseNumericInput } from '@/lib/utils';
import { QuickPaymentModal } from '@/components/admin/quick-payment-modal';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function MembersPage() {
  const {
    members,
    plans,
    payments,
    addMember,
    updateMember,
    deleteMember,
    recordMemberVisit,
    addPayment,
    updatePayment,
    deletePayment,
  } = useFitnesFlow();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [paymentModalMemberId, setPaymentModalMemberId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Form states for Add Member
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+998');
  const [formTelegram, setFormTelegram] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [formPlanId, setFormPlanId] = useState(plans[0]?.id || '');
  const [formMonthsCount, setFormMonthsCount] = useState<number>(1);
  const [formPaidAmount, setFormPaidAmount] = useState<number | '' | null>(null);
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('cash');
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formGender, setFormGender] = useState<'erkak' | 'ayol'>('erkak');
  const [formAge, setFormAge] = useState<number | ''>(25);
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Camera & upload states for Add Member
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit form states for Member
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState<'erkak' | 'ayol'>('erkak');
  const [editAge, setEditAge] = useState<number | ''>(25);
  const [editPlanId, setEditPlanId] = useState('');
  const [editPriceAgreed, setEditPriceAgreed] = useState<number | ''>(200000);
  const [editStartDate, setEditStartDate] = useState('');
  const [editPaidMonths, setEditPaidMonths] = useState<number>(1);
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editStatus, setEditStatus] = useState<MemberStatus>('active');
  const [editTelegram, setEditTelegram] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  const [editDebtAmount, setEditDebtAmount] = useState<number | ''>(0);
  const [editNotes, setEditNotes] = useState('');
  const [isEditCameraActive, setIsEditCameraActive] = useState(false);
  const [editCameraError, setEditCameraError] = useState<string | null>(null);
  const editVideoRef = useRef<HTMLVideoElement | null>(null);
  const editStreamRef = useRef<MediaStream | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Debt metrics
  const debtorsCount = useMemo(
    () => members.filter((m) => m.debtAmount && m.debtAmount > 0).length,
    [members]
  );
  const totalDebt = useMemo(
    () => members.reduce((sum, m) => sum + (m.debtAmount || 0), 0),
    [members]
  );

  // Synchronized viewing member to prevent stale modal data
  const activeViewingMember = useMemo(() => {
    if (!viewingMember) return null;
    return members.find((m) => m.id === viewingMember.id) || viewingMember;
  }, [members, viewingMember]);

  // Payment editing & deleting states
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editPayPlanId, setEditPayPlanId] = useState<string>('');
  const [editPayAmount, setEditPayAmount] = useState<number | ''>(0);
  const [editPayMethod, setEditPayMethod] = useState<PaymentMethod>('cash');
  const [editPayDate, setEditPayDate] = useState<string>('');
  const [editPayMonths, setEditPayMonths] = useState<number>(1);
  const [editPayDebt, setEditPayDebt] = useState<number | ''>(0);
  const [editPayNotes, setEditPayNotes] = useState<string>('');
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const currentEditPayPlan = useMemo(
    () => plans.find((p) => p.id === editPayPlanId),
    [plans, editPayPlanId]
  );

  const editPayExpectedTotal = useMemo(() => {
    const rate = currentEditPayPlan?.price || 200000;
    const isSingle = currentEditPayPlan?.accessType === 'single_visit';
    return isSingle ? rate : rate * (Number(editPayMonths) || 1);
  }, [currentEditPayPlan, editPayMonths]);

  const projectedNewExpiryDateForPay = useMemo(() => {
    if (!editingPayment) return '';
    const targetMember = members.find((m) => m.id === editingPayment.memberId);
    const startDateBase =
      targetMember?.startDate || editPayDate || new Date().toISOString().split('T')[0];
    const durationDays =
      (currentEditPayPlan?.accessType === 'single_visit' ? 1 : 30) * (Number(editPayMonths) || 1);
    const dateObj = new Date(startDateBase);
    dateObj.setDate(dateObj.getDate() + durationDays);
    return dateObj.toISOString().split('T')[0];
  }, [editingPayment, members, editPayDate, currentEditPayPlan, editPayMonths]);

  const handleOpenEditPayment = (p: Payment) => {
    setEditingPayment(p);
    setEditPayPlanId(p.membershipPlanId || (plans[0]?.id ?? ''));
    setEditPayAmount(p.amount);
    setEditPayMethod(p.paymentMethod);
    setEditPayDate(p.paymentDate ? p.paymentDate.split('T')[0] : '');
    setEditPayMonths(p.monthsCount || 1);
    const m = members.find((mem) => mem.id === p.memberId);
    setEditPayDebt(p.remainingDebt !== undefined ? p.remainingDebt : (m?.debtAmount ?? 0));
    setEditPayNotes(p.notes || '');
  };

  const handleEditPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    const amountNum = Number(editPayAmount) || 0;
    const debtNum = Number(editPayDebt) || 0;
    const monthsNum = Number(editPayMonths) || 1;

    updatePayment(editingPayment.id, {
      amount: amountNum,
      paymentMethod: editPayMethod,
      paymentDate: editPayDate || editingPayment.paymentDate,
      monthsCount: monthsNum,
      remainingDebt: debtNum,
      notes: editPayNotes,
      membershipPlanId: currentEditPayPlan?.id || editingPayment.membershipPlanId,
      membershipPlanName: currentEditPayPlan?.name || editingPayment.membershipPlanName,
      newExpiryDate: projectedNewExpiryDateForPay,
    });

    setEditingPayment(null);
  };

  // Camera helpers
  const startCamera = async (isEdit = false) => {
    if (isEdit) setEditCameraError(null);
    else setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera texnologiyasi ushbu brauzerda mavjud emas');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (isEdit) {
        editStreamRef.current = stream;
        setIsEditCameraActive(true);
        setTimeout(() => {
          if (editVideoRef.current) {
            editVideoRef.current.srcObject = stream;
            editVideoRef.current.play();
          }
        }, 100);
      } else {
        streamRef.current = stream;
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }, 100);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg =
        'Kameraga ulanib bo‘lmadi yoki ruxsat berilmadi. Iltimos, brauzer sozlamalarida kameraga ruxsat bering yoki qurilmadan rasm yuklang.';
      if (isEdit) setEditCameraError(msg);
      else setCameraError(msg);
    }
  };

  const stopCamera = (isEdit = false) => {
    if (isEdit) {
      if (editStreamRef.current) {
        editStreamRef.current.getTracks().forEach((track) => track.stop());
        editStreamRef.current = null;
      }
      setIsEditCameraActive(false);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    }
  };

  const capturePhoto = (isEdit = false) => {
    const video = isEdit ? editVideoRef.current : videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      if (isEdit) {
        setEditPhoto(dataUrl);
      } else {
        setFormPhoto(dataUrl);
      }
    }
    stopCamera(isEdit);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        const errorMsg = 'Faqat rasm formatidagi fayllarni yuklash mumkin';
        if (isEdit) setEditCameraError(errorMsg);
        else setCameraError(errorMsg);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isEdit) setEditPhoto(reader.result);
          else setFormPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormPhone('+998');
    setFormTelegram('');
    setFormInstagram('');
    setFormPhoto(null);
    setCameraError(null);
    setFormMonthsCount(1);
    setFormPaidAmount(null);
    setFormPaymentMethod('cash');
    setFormNotes('');
    setIsCameraActive(false);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    stopCamera(false);
    setIsAddModalOpen(false);
    setFormPhoto(null);
    setCameraError(null);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setEditFullName(member.fullName);
    setEditPhone(member.phone);
    setEditGender(member.gender || 'erkak');
    setEditAge(member.age || 25);
    setEditPlanId(member.membershipPlanId);
    setEditPriceAgreed(
      member.membershipPriceAgreed ||
        (plans.find((p) => p.id === member.membershipPlanId)?.price ?? 200000)
    );
    setEditStartDate(member.startDate);
    setEditPaidMonths(member.paidMonths || 1);
    setEditExpiryDate(member.expiryDate);
    setEditStatus(member.status);
    setEditTelegram(member.telegramUsername || '');
    setEditInstagram(member.instagramUsername || '');
    setEditPhoto(member.photoUrl || null);
    setEditDebtAmount(member.debtAmount || 0);
    setEditNotes(member.notes || '');
    setEditCameraError(null);
    setIsEditCameraActive(false);
  };

  const handleCloseEditModal = () => {
    stopCamera(true);
    setEditingMember(null);
    setEditCameraError(null);
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        (m.telegramUsername && m.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.instagramUsername && m.instagramUsername.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'debtors'
          ? (m.debtAmount || 0) > 0
          : m.status === statusFilter;

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
    const months = selectedPlan.accessType === 'single_visit' ? 1 : formMonthsCount;

    const startDateObj = new Date(formStartDate);
    const expiryDateObj = new Date(formStartDate);
    expiryDateObj.setDate(startDateObj.getDate() + duration * months);
    const expiryDateStr = expiryDateObj.toISOString().split('T')[0];

    const planTotal = selectedPlan.price * months;
    const actualPaid =
      formPaidAmount !== null
        ? formPaidAmount === ''
          ? 0
          : Number(formPaidAmount)
        : planTotal;
    const initialDebt = Math.max(0, planTotal - actualPaid);

    // Final photo: captured/uploaded or gender default
    const defaultPhoto =
      formGender === 'ayol'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    const finalPhoto = formPhoto || defaultPhoto;

    const cleanTelegram = formTelegram.trim()
      ? formTelegram.trim().startsWith('@')
        ? formTelegram.trim()
        : `@${formTelegram.trim()}`
      : undefined;

    const cleanInstagram = formInstagram.trim()
      ? formInstagram.trim().replace(/^@/, '')
      : undefined;

    const newMember = addMember({
      fullName: formName.trim(),
      phone: formPhone.trim(),
      photoUrl: finalPhoto,
      telegramUsername: cleanTelegram,
      instagramUsername: cleanInstagram,
      membershipPlanId: selectedPlan.id,
      membershipPlanName: selectedPlan.name,
      membershipPriceAgreed: selectedPlan.price,
      debtAmount: initialDebt,
      paidMonths: months,
      accessType: selectedPlan.accessType,
      startDate: formStartDate,
      expiryDate: expiryDateStr,
      status: 'active',
      gender: formGender,
      age: formAge === '' ? 25 : Number(formAge),
      notes: formNotes.trim() || undefined,
    });

    // Record initial payment if any paid amount
    if (actualPaid > 0) {
      addPayment({
        memberId: newMember.id,
        memberName: newMember.fullName,
        memberPhone: newMember.phone,
        membershipPlanId: selectedPlan.id,
        membershipPlanName: selectedPlan.name,
        amount: actualPaid,
        monthsCount: months,
        expectedAmount: planTotal,
        remainingDebt: initialDebt,
        paymentDate: formStartDate,
        paymentMethod: formPaymentMethod,
        status: 'completed',
        notes:
          initialDebt > 0
            ? `Ro‘yxatdan o‘tishda qisman to‘lov (${months} oy). Qarz: ${formatUZS(initialDebt)}`
            : `Ro‘yxatdan o‘tishda to‘liq to‘lov (${months} oy)`,
        customExpiryDate: expiryDateStr,
      });
    }

    handleCloseAddModal();
  };

  // Handle Edit Member Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const cleanTelegram = editTelegram.trim()
      ? editTelegram.trim().startsWith('@')
        ? editTelegram.trim()
        : `@${editTelegram.trim()}`
      : undefined;

    const cleanInstagram = editInstagram.trim()
      ? editInstagram.trim().replace(/^@/, '')
      : undefined;

    const selectedPlan = plans.find((p) => p.id === editPlanId) || plans[0];
    const isSingle = selectedPlan.accessType === 'single_visit';
    const months = isSingle ? 1 : editPaidMonths;

    let finalExpiry = editExpiryDate;
    if (!finalExpiry && editStartDate) {
      const base = new Date(editStartDate);
      base.setDate(base.getDate() + (isSingle ? 1 : 30 * months));
      finalExpiry = base.toISOString().split('T')[0];
    }

    updateMember(editingMember.id, {
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      gender: editGender,
      age: editAge === '' ? 25 : Number(editAge),
      photoUrl: editPhoto || editingMember.photoUrl,
      telegramUsername: cleanTelegram,
      instagramUsername: cleanInstagram,
      membershipPlanId: selectedPlan.id,
      membershipPlanName: selectedPlan.name,
      membershipPriceAgreed: editPriceAgreed === '' ? selectedPlan.price : Number(editPriceAgreed),
      accessType: selectedPlan.accessType,
      startDate: editStartDate,
      expiryDate: finalExpiry,
      paidMonths: months,
      status: editStatus,
      notes: editNotes.trim() || undefined,
      debtAmount: editDebtAmount === '' ? 0 : Number(editDebtAmount),
    });

    handleCloseEditModal();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
            <span>A’zolar Boshqaruvi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-lime-400 font-bold border border-zinc-700">
              {members.length} ta a’zo
            </span>
            {debtorsCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 font-bold border border-rose-800">
                ⚠️ Qarzlar: {formatUZS(totalDebt)} ({debtorsCount} kishi)
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Mijozlar ma’lumotlari, tariflar, tashriflar va to‘lov statuslari nazorati.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAddModal}
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
            {
              id: 'debtors',
              label: `⚠️ Qarzdorlar (${debtorsCount})`,
              isWarning: debtorsCount > 0,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === item.id
                  ? item.id === 'debtors'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm font-bold'
                    : 'bg-lime-500 text-zinc-950 border-lime-400 shadow-sm font-bold'
                  : item.id === 'debtors' && debtorsCount > 0
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:text-white hover:bg-rose-900/60'
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
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <div className="text-xs text-zinc-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{formatPhoneNumber(member.phone)}</span>
                          </div>
                          {member.telegramUsername && (
                            <a
                              href={`https://t.me/${member.telegramUsername.replace(/^@/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50"
                              title={`Telegram: ${member.telegramUsername}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>{member.telegramUsername}</span>
                            </a>
                          )}
                          {member.instagramUsername && (
                            <a
                              href={`https://instagram.com/${member.instagramUsername.replace(/^@/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-0.5 bg-pink-950/60 px-1.5 py-0.5 rounded border border-pink-800/50"
                              title={`Instagram: @${member.instagramUsername.replace(/^@/, '')}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <InstagramIcon className="w-2.5 h-2.5" />
                              <span>@{member.instagramUsername.replace(/^@/, '')}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Plan & Agreed Price */}
                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-200">
                      {member.membershipPlanName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-lime-400 font-bold">
                        {formatUZS(member.membershipPriceAgreed)}
                      </span>
                      {member.paidMonths && member.paidMonths > 1 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20">
                          {member.paidMonths} oy
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status & Debt */}
                  <TableCell>
                    <Badge status={member.status}>
                      {member.status === 'active' && 'Faol'}
                      {member.status === 'expiring' && 'Muddati oz qolgan'}
                      {member.status === 'expired' && 'Tugagan'}
                      {member.status === 'frozen' && 'Muzlatilgan'}
                    </Badge>
                    {member.debtAmount && member.debtAmount > 0 ? (
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentModalMemberId(member.id);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800 hover:bg-rose-900 cursor-pointer transition-colors shadow-sm"
                          title="Qarzni so‘ndirish"
                        >
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                          <span>Qarz: {formatUZS(member.debtAmount)}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                        Qarz yo‘q
                      </div>
                    )}
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
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-lime-500 hover:text-zinc-950 text-zinc-300 transition-colors cursor-pointer"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                      </button>

                      {/* Payment / Debt Action */}
                      <button
                        onClick={() => setPaymentModalMemberId(member.id)}
                        title={
                          member.debtAmount && member.debtAmount > 0
                            ? `Qarzni to‘lash (${formatUZS(member.debtAmount)})`
                            : 'To‘lov qabul qilish / Muddatni uzaytirish'
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          member.debtAmount && member.debtAmount > 0
                            ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 shadow-sm'
                            : 'bg-zinc-800/80 hover:bg-lime-500 hover:text-zinc-950 text-zinc-300'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
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
                        onClick={() => handleOpenEditModal(member)}
                        title="Tahrirlash"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setMemberToDelete(member)}
                        title="O‘chirish"
                        className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
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
        onClose={handleCloseAddModal}
        title="Yangi A’zo Qo‘shish"
        description="Fitnes klubga yangi mijozni ro‘yxatdan o‘tkazing, suratini oling va abonement biriktiring."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* Member Photo Capture & Upload Area */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-lime-400" />
                <span>Mijoz Fotosurati</span>
              </label>
              <span className="text-[10px] text-zinc-400">
                Jonli kamera yoki qurilma xotirasidan
              </span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, false)}
              accept="image/*"
              className="hidden"
            />

            {cameraError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {cameraError}
              </div>
            )}

            {isCameraActive ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-lime-500/50 aspect-video max-h-56 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Jonli Kamera</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => stopCamera(false)}
                    className="text-xs border-zinc-700 text-zinc-300"
                  >
                    <CameraOff className="w-3.5 h-3.5 mr-1" />
                    <span>Kamerani Yopish</span>
                  </Button>

                  <Button
                    type="button"
                    variant="lime"
                    size="sm"
                    onClick={() => capturePhoto(false)}
                    className="text-xs shadow-md shadow-lime-500/20"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1" />
                    <span>Hozir Rasmga Olish</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Current Photo Preview */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 shrink-0 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      formPhoto ||
                      (formGender === 'ayol'
                        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
                        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')
                    }
                    alt="Mijoz fotosurati"
                    className="w-full h-full object-cover"
                  />
                  {formPhoto && (
                    <div className="absolute bottom-0 inset-x-0 bg-lime-500/95 text-zinc-950 text-[9px] font-extrabold text-center py-0.5">
                      Yuklandi
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Take Photo with Camera */}
                    <Button
                      type="button"
                      variant="lime"
                      size="sm"
                      onClick={() => startCamera(false)}
                      className="text-xs h-8 px-3"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      <span>Kamerani Yoqish</span>
                    </Button>

                    {/* Upload File */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs h-8 px-3 border-zinc-700 hover:bg-zinc-800"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                      <span>Fayl Yuklash</span>
                    </Button>

                    {formPhoto && (
                      <button
                        type="button"
                        onClick={() => setFormPhoto(null)}
                        className="text-[11px] text-zinc-400 hover:text-rose-400 underline transition-colors"
                      >
                        Tozalash
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Klub veb-kamerasi orqali bevosita zalda rasmga oling yoki fayl tanlang.
                  </p>
                </div>
              </div>
            )}
          </div>

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
              onChange={(e) => setFormAge(parseNumericInput(e.target.value))}
            />
          </div>

          {/* Telegram and Instagram Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telegram Profili (ixtiyoriy)"
              placeholder="@username yoki raqam"
              value={formTelegram}
              onChange={(e) => setFormTelegram(e.target.value)}
              leftIcon={<Send className="w-3.5 h-3.5 text-sky-400" />}
            />

            <Input
              label="Instagram Profili (ixtiyoriy)"
              placeholder="username (masalan: ali_fitness)"
              value={formInstagram}
              onChange={(e) => setFormInstagram(e.target.value)}
              leftIcon={<InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tarif Rejasi"
              options={plans.map((p) => ({
                label: `${p.name} (${formatUZS(p.price)}/oy)`,
                value: p.id,
              }))}
              value={formPlanId}
              onChange={(e) => {
                const newPlanId = e.target.value;
                setFormPlanId(newPlanId);
                const p = plans.find((item) => item.id === newPlanId);
                if (p) {
                  const months = p.accessType === 'single_visit' ? 1 : formMonthsCount;
                  setFormPaidAmount(p.price * months);
                }
              }}
            />

            <Input
              label="Boshlanish Sanasi"
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              required
            />
          </div>

          {/* DURATION (MONTHS) SELECTION IN ADD MODAL */}
          {(() => {
            const currentPlan = plans.find((p) => p.id === formPlanId) || plans[0];
            const isSingle = currentPlan?.accessType === 'single_visit';
            const months = isSingle ? 1 : formMonthsCount;
            const totalRequired = (currentPlan?.price || 200000) * months;
            const actualPaid = formPaidAmount !== null ? formPaidAmount : totalRequired;
            const numPaid = actualPaid === '' ? 0 : Number(actualPaid);
            const debt = Math.max(0, totalRequired - numPaid);

            return (
              <div className="space-y-3 pt-2 pb-1 border-t border-zinc-800">
                {!isSingle && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>A’zolik Muddati (Necha oylik to‘lov?)</span>
                      </span>
                      <span className="text-xs font-bold text-lime-400">
                        {months} oy ({months * 30} kun)
                      </span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 6, 12].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setFormMonthsCount(m);
                            setFormPaidAmount((currentPlan?.price || 200000) * m);
                          }}
                          className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                            formMonthsCount === m
                              ? 'bg-lime-500 text-zinc-950 border-lime-400 font-extrabold shadow-sm'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {m} oy
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* INITIAL PAYMENT & DEBT CALCULATION */}
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Hisoblangan to‘liq summa:</span>
                    <span className="text-sm font-black text-lime-400">
                      {formatUZS(totalRequired)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Input
                      label="Boshlang‘ich To‘langan Summa (UZS)"
                      type="number"
                      min={0}
                      step={5000}
                      value={actualPaid}
                      onChange={(e) => setFormPaidAmount(parseNumericInput(e.target.value))}
                      helperText={
                        debt > 0
                          ? `⚠️ Qarz: ${formatUZS(debt)}`
                          : 'To‘liq to‘lov (0 UZS qarz)'
                      }
                    />

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        To‘lov Usuli
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'cash', label: 'Naqd' },
                          { id: 'card', label: 'Karta' },
                          { id: 'click', label: 'Click' },
                          { id: 'payme', label: 'Payme' },
                        ].map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setFormPaymentMethod(method.id as PaymentMethod)}
                            className={`py-1.5 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                              formPaymentMethod === method.id
                                ? 'bg-lime-500 text-zinc-950 border-lime-400 font-bold'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {debt > 0 && (
                    <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Mijoz hisobiga <strong>{formatUZS(debt)}</strong> qarz sifatida
                        yoziladi.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

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
              onClick={handleCloseAddModal}
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
          onClose={handleCloseEditModal}
          title="A’zo Ma’lumotlarini Tahrirlash"
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Edit Photo Area */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-lime-400" />
                  <span>A’zo Fotosuratini Yangilash</span>
                </label>
              </div>

              <input
                type="file"
                ref={editFileInputRef}
                onChange={(e) => handleFileChange(e, true)}
                accept="image/*"
                className="hidden"
              />

              {editCameraError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                  {editCameraError}
                </div>
              )}

              {isEditCameraActive ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-lime-500/50 aspect-video max-h-56 flex items-center justify-center">
                    <video
                      ref={editVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Jonli Kamera</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => stopCamera(true)}
                      className="text-xs border-zinc-700 text-zinc-300"
                    >
                      <CameraOff className="w-3.5 h-3.5 mr-1" />
                      <span>Kamerani Yopish</span>
                    </Button>

                    <Button
                      type="button"
                      variant="lime"
                      size="sm"
                      onClick={() => capturePhoto(true)}
                      className="text-xs shadow-md shadow-lime-500/20"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      <span>Hozir Rasmga Olish</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editPhoto || editingMember.photoUrl}
                      alt={editingMember.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="lime"
                      size="sm"
                      onClick={() => startCamera(true)}
                      className="text-xs h-8 px-3"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      <span>Kamerani Yoqish</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editFileInputRef.current?.click()}
                      className="text-xs h-8 px-3 border-zinc-700 hover:bg-zinc-800"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                      <span>Yangi Fayl Yuklash</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Ism-Familiya"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Telefon Raqami"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />

              <Select
                label="Jinsi"
                options={[
                  { label: 'Erkak', value: 'erkak' },
                  { label: 'Ayol', value: 'ayol' },
                ]}
                value={editGender}
                onChange={(e) => setEditGender(e.target.value as 'erkak' | 'ayol')}
              />

              <Input
                label="Yoshi"
                type="number"
                min={10}
                max={99}
                value={editAge}
                onChange={(e) => setEditAge(parseNumericInput(e.target.value))}
              />
            </div>

            {/* Telegram & Instagram in Edit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Telegram Profili"
                placeholder="@username"
                value={editTelegram}
                onChange={(e) => setEditTelegram(e.target.value)}
                leftIcon={<Send className="w-3.5 h-3.5 text-sky-400" />}
              />

              <Input
                label="Instagram Profili"
                placeholder="username"
                value={editInstagram}
                onChange={(e) => setEditInstagram(e.target.value)}
                leftIcon={<InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
              />
            </div>

            {/* PLAN AND AGREED PRICE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <Select
                label="Tarif Rejasi"
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
                    setEditPriceAgreed(pl.price);
                    if (pl.accessType === 'single_visit') {
                      setEditPaidMonths(1);
                    }
                    if (editStartDate) {
                      const base = new Date(editStartDate);
                      base.setDate(base.getDate() + (pl.accessType === 'single_visit' ? 1 : 30 * editPaidMonths));
                      setEditExpiryDate(base.toISOString().split('T')[0]);
                    }
                  }
                }}
              />

              <Input
                label="Kelishilgan Oylik Narx (UZS)"
                type="number"
                value={editPriceAgreed}
                onChange={(e) => setEditPriceAgreed(parseNumericInput(e.target.value))}
                min={0}
                step={5000}
                helperText={`Asl narx: ${formatUZS(plans.find((p) => p.id === editPlanId)?.price || 200000)}`}
              />
            </div>

            {/* START DATE & DURATION (MONTHS) */}
            <div className="space-y-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Boshlanish Sanasi"
                  type="date"
                  value={editStartDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setEditStartDate(newStart);
                    if (newStart) {
                      const base = new Date(newStart);
                      base.setDate(base.getDate() + 30 * editPaidMonths);
                      setEditExpiryDate(base.toISOString().split('T')[0]);
                    }
                  }}
                  required
                />

                <Input
                  label="Tugash Sanasi"
                  type="date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  required
                />
              </div>

              {/* Quick Months Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-lime-400" />
                    <span>A’zolik Muddati (oylar soni)</span>
                  </span>
                  <span className="text-xs font-bold text-lime-400">
                    {editPaidMonths} oy ({editPaidMonths * 30} kun)
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setEditPaidMonths(m);
                        if (editStartDate) {
                          const base = new Date(editStartDate);
                          base.setDate(base.getDate() + 30 * m);
                          setEditExpiryDate(base.toISOString().split('T')[0]);
                        }
                      }}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                        editPaidMonths === m
                          ? 'bg-lime-500 text-zinc-950 border-lime-400 font-extrabold shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m} oy
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Holati"
                options={[
                  { label: 'Faol', value: 'active' },
                  { label: 'Muddati oz qolgan', value: 'expiring' },
                  { label: 'Tugagan', value: 'expired' },
                  { label: 'Muzlatilgan', value: 'frozen' },
                ]}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MemberStatus)}
              />

              <Input
                label="Qarz Miqdori (UZS)"
                type="number"
                min={0}
                step={5000}
                value={editDebtAmount}
                onChange={(e) => setEditDebtAmount(parseNumericInput(e.target.value))}
                helperText={
                  (Number(editDebtAmount) || 0) > 0
                    ? `Mijozda ${formatUZS(editDebtAmount)} to‘lanmagan qarz hisoblanadi.`
                    : 'Qarz yo‘q (0 UZS).'
                }
              />
            </div>

            {/* ASSOCIATED PAYMENTS SECTION */}
            {(() => {
              const memberPayments = payments.filter((p) => p.memberId === editingMember.id);
              if (memberPayments.length === 0) return null;
              return (
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Bog‘langan To‘lov Kvitansiyalari ({memberPayments.length} ta)
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      To‘lov xato kiritilgan bo‘lsa tahrirlang
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {memberPayments.map((p) => (
                      <div
                        key={p.id}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono text-lime-400 font-bold mr-2">
                            {p.receiptNumber}
                          </span>
                          <span className="text-white font-medium mr-2">
                            {formatUZS(p.amount)}
                          </span>
                          <span className="text-zinc-400 uppercase text-[10px]">
                            {p.paymentMethod} • {formatDateUz(p.paymentDate)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleCloseEditModal();
                            handleOpenEditPayment(p);
                          }}
                          className="h-7 px-2 text-[11px] border-zinc-700 hover:border-lime-500 hover:text-lime-400"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          <span>To‘lovni Tahrirlash</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <Input
              label="Izoh"
              placeholder="Qo‘shimcha izoh..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditModal}
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
      {activeViewingMember && (
        <Modal
          isOpen={!!activeViewingMember}
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
                  src={activeViewingMember.photoUrl}
                  alt={activeViewingMember.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {activeViewingMember.fullName}
                  </h3>
                  <Badge status={activeViewingMember.status}>
                    {activeViewingMember.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-lime-400" />
                  <span>{formatPhoneNumber(activeViewingMember.phone)}</span>
                </p>

                {/* Telegram & Instagram buttons */}
                {(activeViewingMember.telegramUsername || activeViewingMember.instagramUsername) && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {activeViewingMember.telegramUsername && (
                      <a
                        href={`https://t.me/${activeViewingMember.telegramUsername.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-950/70 border border-sky-500/40 text-xs font-bold text-sky-400 hover:bg-sky-900/80 transition-colors"
                        title="Telegramda xabar yozish"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Telegram: {activeViewingMember.telegramUsername}</span>
                        <ExternalLink className="w-3 h-3 text-sky-400/70" />
                      </a>
                    )}

                    {activeViewingMember.instagramUsername && (
                      <a
                        href={`https://instagram.com/${activeViewingMember.instagramUsername.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-950/70 border border-pink-500/40 text-xs font-bold text-pink-400 hover:bg-pink-900/80 transition-colors"
                        title="Instagram profilini ko‘rish"
                      >
                        <InstagramIcon className="w-3.5 h-3.5" />
                        <span>Instagram: @{activeViewingMember.instagramUsername.replace(/^@/, '')}</span>
                        <ExternalLink className="w-3 h-3 text-pink-400/70" />
                      </a>
                    )}
                  </div>
                )}

                <div className="text-xs text-zinc-500 mt-2">
                  A’zo bo‘lgan sana: {formatDateUz(activeViewingMember.createdAt)}
                </div>
              </div>
            </div>

            {/* DEBT BANNER IF MEMBER HAS OUTSTANDING BALANCE */}
            {activeViewingMember.debtAmount && activeViewingMember.debtAmount > 0 ? (
              <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-700 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      To‘lanmagan Qarz Mavjud
                    </div>
                    <div className="text-xl font-black text-white">
                      {formatUZS(activeViewingMember.debtAmount)}
                    </div>
                    <p className="text-[11px] text-rose-300/80">
                      Mijoz to‘lov summasidan kam pul bergan va hisobida qarz qolgan.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    const memberId = activeViewingMember.id;
                    setViewingMember(null);
                    setPaymentModalMemberId(memberId);
                  }}
                  className="shadow-md shadow-lime-500/20 shrink-0"
                >
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  <span>Qarzni To‘lash</span>
                </Button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex items-center justify-between">
                <span className="text-zinc-400">Qarzdorlik holati:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Qarz yo‘q (To‘lovlar to‘liq amalga oshirilgan)</span>
                </span>
              </div>
            )}

            {/* Plan Info Card */}
            <div className="p-4 rounded-xl bg-[#090d16] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Amaldagi Tarif
                  </span>
                  <div className="text-base font-bold text-white">
                    {activeViewingMember.membershipPlanName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 uppercase font-semibold">
                    Kelishilgan Narx (Tarixiy)
                  </span>
                  <div className="text-base font-black text-lime-400">
                    {formatUZS(activeViewingMember.membershipPriceAgreed)}
                  </div>
                </div>
              </div>

              {/* Attendance rule alert */}
              {activeViewingMember.accessType === 'weekly_3_days' && (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-600/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Haftasiga 3 kun qoidasi:</span> Ushbu tarifda a’zo haftaning istalgan 3 kunini tanlashi mumkin. Bu haftada: {activeViewingMember.visitsThisWeek}/3 kun qayd etilgan.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500">Boshlanish:</span>
                  <p className="font-semibold text-zinc-200">{formatDateUz(activeViewingMember.startDate)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Tugash:</span>
                  <p className="font-semibold text-zinc-200">{formatDateUz(activeViewingMember.expiryDate)}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Bu haftadagi tashrif:</span>
                  <p className="font-semibold text-lime-400">{activeViewingMember.visitsThisWeek} marta</p>
                </div>
                <div>
                  <span className="text-zinc-500">Jami tashriflar:</span>
                  <p className="font-semibold text-zinc-200">{activeViewingMember.totalVisits} marta</p>
                </div>
              </div>
            </div>

            {/* Member's payment history */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  A’zoning To‘lovlar Tarixi
                </h4>
                <span className="text-[11px] text-zinc-500 font-medium">
                  {payments.filter((p) => p.memberId === activeViewingMember.id).length} ta to‘lov
                </span>
              </div>
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sana</TableHead>
                      <TableHead>Kvitansiya</TableHead>
                      <TableHead>Summa</TableHead>
                      <TableHead>Usuli</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .filter((p) => p.memberId === activeViewingMember.id)
                      .map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs">{formatDateUz(p.paymentDate)}</TableCell>
                          <TableCell className="text-xs font-mono text-zinc-400">{p.receiptNumber}</TableCell>
                          <TableCell className="text-xs font-bold text-lime-400">
                            {formatUZS(p.amount)}
                            {p.monthsCount && p.monthsCount > 1 ? (
                              <span className="block text-[10px] font-normal text-zinc-400">
                                ({p.monthsCount} oy)
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-xs uppercase text-zinc-300">{p.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPayment(p)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                title="To‘lovni tahrirlash"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentToDelete(p)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                title="To‘lovni o‘chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {payments.filter((p) => p.memberId === activeViewingMember.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-xs text-zinc-500">
                          To‘lovlar tarixi topilmadi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => recordMemberVisit(activeViewingMember.id)}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Tashrifni qayd etish (+1)</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const toDel = activeViewingMember;
                    setViewingMember(null);
                    setMemberToDelete(toDel);
                  }}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                  title="A’zoni o‘chirish"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>O‘chirish</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const toEdit = activeViewingMember;
                    setViewingMember(null);
                    handleOpenEditModal(toEdit);
                  }}
                  className="hover:border-lime-500 hover:text-lime-400"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Ma’lumotlarni Tahrirlash</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const id = activeViewingMember.id;
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

      {/* EDIT PAYMENT MODAL */}
      {editingPayment && (
        <Modal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          title="To‘lovni Tahrirlash"
          description="Noto‘g‘ri kiritilgan summa, to‘lov usuli yoki qarz qoldig‘ini to‘g‘rilang."
          maxWidth="md"
        >
          <form onSubmit={handleEditPaymentSubmit} className="space-y-4">
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
                value={editPayPlanId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setEditPayPlanId(newId);
                  const pl = plans.find((item) => item.id === newId);
                  if (pl) {
                    const months = pl.accessType === 'single_visit' ? 1 : editPayMonths;
                    if (pl.accessType === 'single_visit') setEditPayMonths(1);
                    const newTotal = pl.price * months;
                    setEditPayAmount(newTotal);
                    setEditPayDebt(0);
                  }
                }}
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                <span>Reja bo‘yicha to‘liq summa: <strong className="text-lime-400">{formatUZS(editPayExpectedTotal)}</strong></span>
                {projectedNewExpiryDateForPay && (
                  <span>Yangi a’zolik muddati: <strong className="text-zinc-200">{formatDateUz(projectedNewExpiryDateForPay)}</strong></span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Input
                label="To‘langan Summa (UZS)"
                type="number"
                value={editPayAmount}
                onChange={(e) => {
                  const val = parseNumericInput(e.target.value);
                  setEditPayAmount(val);
                  const numVal = val === '' ? 0 : Number(val);
                  setEditPayDebt(Math.max(0, editPayExpectedTotal - numVal));
                }}
                min={0}
                step={5000}
                required
                helperText={`Formatlangan: ${formatUZS(editPayAmount)}`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditPayAmount(editPayExpectedTotal);
                    setEditPayDebt(0);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-lime-400 font-medium transition-colors cursor-pointer"
                >
                  To‘liq summa qilish ({formatUZS(editPayExpectedTotal)})
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
                value={editPayMethod}
                onChange={(e) => setEditPayMethod(e.target.value as PaymentMethod)}
              />

              <Input
                label="To‘lov Sanasi"
                type="date"
                value={editPayDate}
                onChange={(e) => setEditPayDate(e.target.value)}
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
                value={String(editPayMonths)}
                onChange={(e) => {
                  const m = Number(e.target.value) || 1;
                  setEditPayMonths(m);
                  const rate = currentEditPayPlan?.price || 200000;
                  const newTotal = rate * m;
                  setEditPayAmount(newTotal);
                  setEditPayDebt(0);
                }}
              />

              <Input
                label="Qoldiq Qarz (UZS)"
                type="number"
                value={editPayDebt}
                onChange={(e) => setEditPayDebt(parseNumericInput(e.target.value))}
                min={0}
                step={5000}
                helperText={
                  Number(editPayDebt) > 0
                    ? `Mijozda ${formatUZS(editPayDebt)} qarz qoladi`
                    : 'To‘liq to‘langan (0 UZS qarz)'
                }
              />
            </div>

            <Input
              label="Izoh (ixtiyoriy)"
              placeholder="Masalan: Summadagi xatolik to‘g‘rilandi"
              value={editPayNotes}
              onChange={(e) => setEditPayNotes(e.target.value)}
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

      {/* Quick Payment Modal opened from member detail */}
      {paymentModalMemberId && (
        <QuickPaymentModal
          isOpen={!!paymentModalMemberId}
          onClose={() => setPaymentModalMemberId(null)}
          preselectedMemberId={paymentModalMemberId}
        />
      )}

      {/* Delete Member Confirmation Modal */}
      {memberToDelete && (
        <ConfirmDeleteModal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={() => {
            if (memberToDelete) {
              deleteMember(memberToDelete.id);
              setMemberToDelete(null);
            }
          }}
          title="A’zoni O‘chirish"
          description="Haqiqatan ham ushbu mijozni tizimdan o‘chirmoqchimisiz?"
          itemType="A’zo"
          itemName={memberToDelete.fullName}
          itemDetails={
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memberToDelete.photoUrl}
                  alt={memberToDelete.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-white">
                  Telefon: {formatPhoneNumber(memberToDelete.phone)}
                </p>
                <p className="text-zinc-400">
                  Tarif: <span className="text-lime-400 font-medium">{memberToDelete.membershipPlanName}</span> • Muddati: {formatDateUz(memberToDelete.expiryDate)}
                </p>
                {memberToDelete.debtAmount && memberToDelete.debtAmount > 0 ? (
                  <p className="text-rose-400 font-bold">
                    ⚠️ Qarz: {formatUZS(memberToDelete.debtAmount)}
                  </p>
                ) : null}
              </div>
            </div>
          }
          warningText="Ushbu a’zoni o‘chirishingiz bilan uning to‘lov tarixlari va barcha tashrif yozuvlari butunlay o‘chiriladi."
          confirmText="Ha, a’zoni o‘chirish"
        />
      )}
    </div>
  );
}
