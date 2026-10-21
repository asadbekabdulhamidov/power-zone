'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Member,
  MembershipPlan,
  Payment,
  Product,
  NotificationItem,
  DashboardStats,
  AdminProfile,
} from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_MEMBERSHIP_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_PRODUCTS,
} from '@/lib/mock-data';
import { getDaysDifference, generateId, generateReceiptNumber } from '@/lib/utils';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface FitnesContextType {
  members: Member[];
  plans: MembershipPlan[];
  payments: Payment[];
  products: Product[];
  notifications: NotificationItem[];
  stats: DashboardStats;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Member actions
  addMember: (data: Omit<Member, 'id' | 'createdAt' | 'totalVisits' | 'visitsThisWeek'>) => Member;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  recordMemberVisit: (memberId: string) => { success: boolean; message: string };

  // Plan actions
  addPlan: (data: Omit<MembershipPlan, 'id'>) => MembershipPlan;
  updatePlan: (id: string, data: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;
  togglePlanStatus: (id: string) => void;

  // Payment actions
  addPayment: (data: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;

  // Product actions
  addProduct: (data: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;

  // Admin Profile & Security
  adminProfile: AdminProfile;
  updateAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  updateAdminProfile: (data: Partial<AdminProfile>) => void;

  // Reset to initial mock data
  resetToDefault: () => void;
}

const DEFAULT_ADMIN: AdminProfile = {
  fullName: 'Azizbek Admin',
  email: 'admin@powerzone.uz',
  phone: '+998 (90) 123-45-67',
  role: 'Bosh Administrator',
  password: 'power2026!',
};

const FitnesContext = createContext<FitnesContextType | undefined>(undefined);

export function FitnesFlowProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(DEFAULT_ADMIN);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage if present (client-side only)
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('fitnesflow_members');
      const savedPlans = localStorage.getItem('fitnesflow_plans');
      const savedPayments = localStorage.getItem('fitnesflow_payments');
      const savedProducts = localStorage.getItem('fitnesflow_products');
      const savedAdmin = localStorage.getItem('powerzone_admin_profile');

      if (savedMembers) setMembers(JSON.parse(savedMembers));
      if (savedPlans) setPlans(JSON.parse(savedPlans));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedAdmin) setAdminProfile(JSON.parse(savedAdmin));
    } catch {
      // LocalStorage access might fail in private windows or restrictions
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('fitnesflow_members', JSON.stringify(members));
      localStorage.setItem('fitnesflow_plans', JSON.stringify(plans));
      localStorage.setItem('fitnesflow_payments', JSON.stringify(payments));
      localStorage.setItem('fitnesflow_products', JSON.stringify(products));
    } catch {
      // Ignore storage errors
    }
  }, [members, plans, payments, products, isInitialized]);

  // Toast feedback system
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derive notifications from members
  const notifications: NotificationItem[] = useMemo(() => {
    const items: NotificationItem[] = [];

    members.forEach((m) => {
      const diff = getDaysDifference(m.expiryDate);
      if (diff === 0) {
        items.push({
          id: `notif-${m.id}`,
          memberId: m.id,
          memberName: m.fullName,
          memberPhone: m.phone,
          planName: m.membershipPlanName,
          expiryDate: m.expiryDate,
          dueType: 'today',
          amount: m.membershipPriceAgreed,
          status: 'expiring',
        });
      } else if (diff === 1) {
        items.push({
          id: `notif-${m.id}`,
          memberId: m.id,
          memberName: m.fullName,
          memberPhone: m.phone,
          planName: m.membershipPlanName,
          expiryDate: m.expiryDate,
          dueType: 'tomorrow',
          amount: m.membershipPriceAgreed,
          status: 'expiring',
        });
      } else if (diff < 0) {
        items.push({
          id: `notif-${m.id}`,
          memberId: m.id,
          memberName: m.fullName,
          memberPhone: m.phone,
          planName: m.membershipPlanName,
          expiryDate: m.expiryDate,
          dueType: 'overdue',
          daysOverdue: Math.abs(diff),
          amount: m.membershipPriceAgreed,
          status: 'expired',
        });
      }
    });

    return items;
  }, [members]);

  // Derive stats
  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecordedRevenue = payments
      .filter((p) => p.paymentDate.startsWith(today) && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const activeCount = members.filter((m) => m.status === 'active' || m.status === 'expiring').length;
    const expiringTodayOrTomorrow = members.filter((m) => {
      const diff = getDaysDifference(m.expiryDate);
      return diff === 0 || diff === 1;
    }).length;
    const overdueTotal = members.filter((m) => getDaysDifference(m.expiryDate) < 0).length;

    return {
      totalMembers: members.length,
      activeMemberships: activeCount,
      todayRevenue: todayRecordedRevenue,
      expiringSoonCount: expiringTodayOrTomorrow,
      overdueCount: overdueTotal,
      revenueWeeklyGrowth: 14.8,
    };
  }, [members, payments]);

  // Member CRUD actions
  const addMember = (data: Omit<Member, 'id' | 'createdAt' | 'totalVisits' | 'visitsThisWeek'>): Member => {
    const newMember: Member = {
      ...data,
      id: generateId('mem'),
      totalVisits: 0,
      visitsThisWeek: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [newMember, ...prev]);
    showToast(`Yangi a’zo "${newMember.fullName}" muvaffaqiyatli qo‘shildi!`);
    return newMember;
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    showToast('A’zo ma’lumotlari yangilandi!');
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast(`"${member?.fullName || "A'zo"}" ro‘yxatdan o‘chirildi.`, 'info');
  };

  // Record a gym visit (handles rules & visit counters)
  const recordMemberVisit = (memberId: string): { success: boolean; message: string } => {
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      return { success: false, message: "A'zo topilmadi." };
    }

    if (member.status === 'expired') {
      showToast(`Muddati o‘tgan a'zo! Yangi to‘lov kiritilishi shart.`, 'error');
      return { success: false, message: "Abonement muddati tugagan." };
    }

    if (member.accessType === 'weekly_3_days' && member.visitsThisWeek >= 3) {
      showToast(`Haftalik limit (3/3) to'lgan! Keyingi haftagacha tashrif cheklangan.`, 'error');
      return {
        success: false,
        message: "Ushbu a'zo bu hafta uchun 3 ta ruxsat etilgan tashrifini to'liq ishlatib bo'lgan.",
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const newVisitsThisWeek = member.accessType === 'single_visit' ? 1 : member.visitsThisWeek + 1;
    const newTotalVisits = member.totalVisits + 1;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              visitsThisWeek: newVisitsThisWeek,
              totalVisits: newTotalVisits,
              lastVisitDate: today,
              // If single visit, mark as expired after the visit
              status: m.accessType === 'single_visit' ? 'expired' : m.status,
            }
          : m
      )
    );

    const msg = member.accessType === 'weekly_3_days'
      ? `Tashrif qayd etildi! Ushbu haftada: ${newVisitsThisWeek}/3 kun ishlatildi.`
      : `Tashrif muvaffaqiyatli qayd etildi! Jami tashriflar: ${newTotalVisits}.`;
    showToast(msg, 'success');
    return { success: true, message: msg };
  };

  // Membership Plan actions
  // Note: updating a plan does NOT overwrite existing members' membershipPriceAgreed
  const addPlan = (data: Omit<MembershipPlan, 'id'>): MembershipPlan => {
    const newPlan: MembershipPlan = {
      ...data,
      id: generateId('plan'),
    };
    setPlans((prev) => [...prev, newPlan]);
    showToast(`"${newPlan.name}" tarif rejasi yaratildi!`);
    return newPlan;
  };

  const updatePlan = (id: string, data: Partial<MembershipPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('Tarif rejasi yangilandi! Mavjud a’zolarning kelishilgan narxlari saqlab qolindi.');
  };

  const deletePlan = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${plan?.name}" rejasi o‘chirildi.`, 'info');
  };

  const togglePlanStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'archived' : 'active' }
          : p
      )
    );
    showToast('Tarif holati o‘zgartirildi.');
  };

  // Payment actions
  const addPayment = (data: Omit<Payment, 'id' | 'receiptNumber'>): Payment => {
    const newPayment: Payment = {
      ...data,
      id: generateId('pay'),
      receiptNumber: generateReceiptNumber(),
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Automatically update member's status and expiration if valid
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === data.memberId) {
          const startDate = data.paymentDate || new Date().toISOString().split('T')[0];
          const plan = plans.find((p) => p.id === data.membershipPlanId);
          const duration = plan?.durationDays || 30;
          
          const newExpDate = new Date(startDate);
          newExpDate.setDate(newExpDate.getDate() + duration);
          const expiryDateStr = newExpDate.toISOString().split('T')[0];

          return {
            ...m,
            startDate,
            expiryDate: expiryDateStr,
            status: 'active',
            membershipPlanId: data.membershipPlanId,
            membershipPlanName: data.membershipPlanName,
            membershipPriceAgreed: data.amount,
            accessType: plan?.accessType || m.accessType,
            visitsThisWeek: 0, // Reset visits counter on renewal
          };
        }
        return m;
      })
    );

    showToast(`To‘lov qabul qilindi! Kvitansiya: ${newPayment.receiptNumber}`);
    return newPayment;
  };

  // Product actions
  const addProduct = (data: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...data,
      id: generateId('prod'),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" mahsuloti qo‘shildi!`);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('Mahsulot ma’lumotlari yangilandi!');
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${product?.name}" mahsuloti o‘chirildi.`, 'info');
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    showToast('Mahsulot faollik holati yangilandi.');
  };

  const updateAdminPassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    if (currentPass !== adminProfile.password) {
      showToast('Joriy parol noto‘g‘ri kiritildi!', 'error');
      return { success: false, message: 'Joriy parol noto‘g‘ri kiritildi!' };
    }
    if (!newPass || newPass.length < 6) {
      showToast('Yangi parol kamida 6 ta belgidan iborat bo‘lishi shart!', 'error');
      return { success: false, message: 'Yangi parol kamida 6 ta belgidan iborat bo‘lishi shart!' };
    }
    const updated = { ...adminProfile, password: newPass };
    setAdminProfile(updated);
    try {
      localStorage.setItem('powerzone_admin_profile', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast('Admin paroli muvaffaqiyatli almashtirildi!', 'success');
    return { success: true, message: 'Admin paroli muvaffaqiyatli almashtirildi!' };
  };

  const updateAdminProfile = (data: Partial<AdminProfile>) => {
    const updated = { ...adminProfile, ...data };
    setAdminProfile(updated);
    try {
      localStorage.setItem('powerzone_admin_profile', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast('Admin profili ma’lumotlari yangilandi!', 'success');
  };

  const resetToDefault = () => {
    setMembers(INITIAL_MEMBERS);
    setPlans(INITIAL_MEMBERSHIP_PLANS);
    setPayments(INITIAL_PAYMENTS);
    setProducts(INITIAL_PRODUCTS);
    setAdminProfile(DEFAULT_ADMIN);
    try {
      localStorage.removeItem('fitnesflow_members');
      localStorage.removeItem('fitnesflow_plans');
      localStorage.removeItem('fitnesflow_payments');
      localStorage.removeItem('fitnesflow_products');
      localStorage.removeItem('powerzone_admin_profile');
    } catch {
      // Ignore
    }
    showToast('Barcha ma’lumotlar dastlabki holatga qaytarildi.', 'info');
  };

  return (
    <FitnesContext.Provider
      value={{
        members,
        plans,
        payments,
        products,
        notifications,
        stats,
        toasts,
        showToast,
        removeToast,
        addMember,
        updateMember,
        deleteMember,
        recordMemberVisit,
        addPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        addPayment,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        adminProfile,
        updateAdminPassword,
        updateAdminProfile,
        resetToDefault,
      }}
    >
      {children}

      {/* Global Toast Notification Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border text-sm transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800 backdrop-blur-md'
                : toast.type === 'info'
                ? 'bg-zinc-900/90 text-zinc-200 border-zinc-700 backdrop-blur-md'
                : 'bg-zinc-950/95 text-lime-400 border-lime-500/40 backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-zinc-400 hover:text-white transition-colors text-xs font-semibold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </FitnesContext.Provider>
  );
}

export function useFitnesFlow() {
  const context = useContext(FitnesContext);
  if (!context) {
    throw new Error('useFitnesFlow must be used within a FitnesFlowProvider');
  }
  return context;
}
