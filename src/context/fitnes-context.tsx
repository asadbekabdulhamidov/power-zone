'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Member,
  MemberStatus,
  MembershipPlan,
  Payment,
  PaymentMethod,
  Product,
  NotificationItem,
  DashboardStats,
  AdminProfile,
  WebsiteContent,
  WebsiteHero,
  WebsiteStat,
  WebsiteFeature,
  WebsiteBanner,
  WebsiteContactInfo,
  ContactMessage,
  MessageStatus,
} from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_MEMBERSHIP_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_PRODUCTS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_CONTACT_MESSAGES,
} from '@/lib/mock-data';
import { getDaysDifference, generateId, generateReceiptNumber, formatUZS } from '@/lib/utils';

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
  addPayment: (data: Omit<Payment, 'id' | 'receiptNumber'> & { customExpiryDate?: string }) => Payment;
  updatePayment: (id: string, updates: Partial<Payment> & { newExpiryDate?: string }) => void;
  deletePayment: (id: string) => void;
  settleMemberDebt: (memberId: string, paidAmount: number, paymentMethod?: PaymentMethod) => void;

  // Product actions
  addProduct: (data: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  resetProducts: () => void;

  // Admin Profile & Security
  adminProfile: AdminProfile;
  updateAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  updateAdminProfile: (data: Partial<AdminProfile>) => void;

  // Website Content Management (CMS)
  websiteContent: WebsiteContent;
  updateWebsiteHero: (hero: Partial<WebsiteHero>) => void;
  updateWebsiteStats: (stats: WebsiteStat[]) => void;
  addWebsiteFeature: (feat: Omit<WebsiteFeature, 'id'>) => WebsiteFeature;
  updateWebsiteFeature: (id: string, feat: Partial<WebsiteFeature>) => void;
  deleteWebsiteFeature: (id: string) => void;
  updateWebsiteBanner: (banner: Partial<WebsiteBanner>) => void;
  updateWebsiteContact: (contact: Partial<WebsiteContactInfo>) => void;

  // Contact Messages & Inquiries
  contactMessages: ContactMessage[];
  addContactMessage: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => ContactMessage;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  deleteContactMessage: (id: string) => void;

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
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(INITIAL_CONTACT_MESSAGES);
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
      const savedContent = localStorage.getItem('powerzone_website_content');
      const savedMessages = localStorage.getItem('powerzone_contact_messages');

      if (savedMembers) {
        try {
          const parsedMembers: Member[] = JSON.parse(savedMembers);
          // Auto-heal members whose expiryDate was accidentally doubled
          const healed = parsedMembers.map((m) => {
            if (m.startDate === '2026-10-21' && m.paidMonths === 2 && m.expiryDate === '2027-02-18') {
              return { ...m, expiryDate: '2026-12-20' };
            }
            return m;
          });
          setMembers(healed);
        } catch {
          setMembers(INITIAL_MEMBERS);
        }
      }
      if (savedPlans) setPlans(JSON.parse(savedPlans));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      if (savedProducts) {
        try {
          const parsedProducts: Product[] = JSON.parse(savedProducts);
          // Auto-heal old or broken Unsplash URLs from earlier versions
          const healed = parsedProducts.map((p) => {
            if (p.imageUrl?.includes('photo-1548839140-29a749e1bc4e')) {
              return {
                ...p,
                imageUrl:
                  'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
              };
            }
            if (p.imageUrl?.includes('photo-1600880292203-757bb62b4baf')) {
              return {
                ...p,
                imageUrl:
                  'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
              };
            }
            if (
              p.imageUrl?.includes('photo-1622484216250-9d0442345e7f') ||
              p.imageUrl?.includes('photo-1622467899467')
            ) {
              return {
                ...p,
                imageUrl:
                  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
              };
            }
            if (p.imageUrl?.includes('photo-1577705998148-6da4f3963bc8')) {
              return {
                ...p,
                imageUrl:
                  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
              };
            }
            return p;
          });
          setProducts(healed);
        } catch {
          setProducts(INITIAL_PRODUCTS);
        }
      }
      if (savedAdmin) setAdminProfile(JSON.parse(savedAdmin));
      if (savedContent) setWebsiteContent(JSON.parse(savedContent));
      if (savedMessages) setContactMessages(JSON.parse(savedMessages));
    } catch {
      // LocalStorage access might fail in private windows or restrictions
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Silently sync from live backend API if available
  useEffect(() => {
    async function syncFromApi() {
      try {
        const { api } = await import('@/lib/api-client');
        // 1. Sync plans from live PostgreSQL
        try {
          const apiPlans = await api.plans.getAll();
          if (Array.isArray(apiPlans) && apiPlans.length > 0) {
            setPlans(apiPlans);
          }
        } catch {
          // Fallback to local
        }

        // 2. Sync products from live PostgreSQL
        try {
          const apiProducts = await api.products.getAll(true);
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            setProducts(apiProducts);
          }
        } catch {
          // Fallback to local
        }

        // 3. If admin is logged in with token, sync real members and payments
        const token = typeof window !== 'undefined' ? localStorage.getItem('powerzone_token') : null;
        if (token) {
          try {
            const membersRes = await api.members.getAll({ limit: 100 });
            if (membersRes && Array.isArray(membersRes.data) && membersRes.data.length > 0) {
              setMembers(membersRes.data);
            }
          } catch {
            // Fallback to local
          }
          try {
            const paymentsRes = await api.payments.getAll({ limit: 100 });
            if (paymentsRes && Array.isArray(paymentsRes.data) && paymentsRes.data.length > 0) {
              setPayments(paymentsRes.data);
            }
          } catch {
            // Fallback to local
          }
        }
      } catch {
        // Backend offline or unreachable, local fallback remains active
      }
    }

    if (isInitialized) {
      syncFromApi();
    }
  }, [isInitialized]);

  // Save to localStorage when updated
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('fitnesflow_members', JSON.stringify(members));
      localStorage.setItem('fitnesflow_plans', JSON.stringify(plans));
      localStorage.setItem('fitnesflow_payments', JSON.stringify(payments));
      localStorage.setItem('fitnesflow_products', JSON.stringify(products));
      localStorage.setItem('powerzone_website_content', JSON.stringify(websiteContent));
      localStorage.setItem('powerzone_contact_messages', JSON.stringify(contactMessages));
    } catch {
      // Ignore storage errors
    }
  }, [members, plans, payments, products, websiteContent, contactMessages, isInitialized]);

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
          debtAmount: m.debtAmount,
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
          debtAmount: m.debtAmount,
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
          debtAmount: m.debtAmount,
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

    // If member's name, phone, or plan changes, synchronize corresponding payment records
    if (data.fullName || data.phone || data.membershipPlanId || data.membershipPlanName) {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.memberId === id) {
            return {
              ...p,
              memberName: data.fullName ?? p.memberName,
              memberPhone: data.phone ?? p.memberPhone,
              membershipPlanId: data.membershipPlanId ?? p.membershipPlanId,
              membershipPlanName: data.membershipPlanName ?? p.membershipPlanName,
            };
          }
          return p;
        })
      );
    }

    showToast('A’zo ma’lumotlari muvaffaqiyatli yangilandi!', 'success');
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

    if (member.status === 'frozen') {
      showToast(`Abonement muzlatilgan! Avval a’zo statusini "Faol" holatiga o‘tkazing.`, 'error');
      return { success: false, message: "Abonement muzlatilgan." };
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
  const addPayment = (
    data: Omit<Payment, 'id' | 'receiptNumber'> & { customExpiryDate?: string }
  ): Payment => {
    const months = data.monthsCount && data.monthsCount > 0 ? data.monthsCount : 1;
    const plan = plans.find((p) => p.id === data.membershipPlanId);
    const unitPrice = plan?.price || 200000;
    const expected = data.expectedAmount !== undefined ? data.expectedAmount : unitPrice * months;
    const debt = data.remainingDebt !== undefined ? data.remainingDebt : Math.max(0, expected - data.amount);

    const newPayment: Payment = {
      ...data,
      monthsCount: months,
      expectedAmount: expected,
      remainingDebt: debt,
      id: generateId('pay'),
      receiptNumber: generateReceiptNumber(),
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Automatically update member's status, expiration and debt
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === data.memberId) {
          const payDate = data.paymentDate || new Date().toISOString().split('T')[0];
          const durationDays = (plan?.durationDays || 30) * months;

          // If customExpiryDate is provided (e.g. from new member registration or quick payment projected date),
          // use it directly to prevent doubling the duration!
          let expiryDateStr = data.customExpiryDate;
          if (!expiryDateStr) {
            const currentExp = new Date(m.expiryDate);
            const paymentDateObj = new Date(payDate);
            const baseDate = currentExp > paymentDateObj ? new Date(currentExp) : new Date(paymentDateObj);
            baseDate.setDate(baseDate.getDate() + durationDays);
            expiryDateStr = baseDate.toISOString().split('T')[0];
          }

          return {
            ...m,
            startDate: payDate,
            expiryDate: expiryDateStr,
            status: 'active',
            membershipPlanId: data.membershipPlanId,
            membershipPlanName: data.membershipPlanName,
            membershipPriceAgreed: m.membershipPriceAgreed || unitPrice,
            debtAmount: debt,
            paidMonths: months,
            accessType: plan?.accessType || m.accessType,
            visitsThisWeek: 0, // Reset visits counter on renewal
          };
        }
        return m;
      })
    );

    if (debt > 0) {
      showToast(
        `Qisman to‘lov qabul qilindi. Qolgan qarz: ${formatUZS(debt)}. Kvitansiya: ${newPayment.receiptNumber}`,
        'info'
      );
    } else {
      showToast(
        `To‘lov to‘liq qabul qilindi (${months} oylik). Kvitansiya: ${newPayment.receiptNumber}`,
        'success'
      );
    }
    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment> & { newExpiryDate?: string }) => {
    let targetMemberId = '';
    let updatedPayment: Payment | null = null;

    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedPayment = { ...p, ...updates };
          targetMemberId = p.memberId;
          return updatedPayment;
        }
        return p;
      })
    );

    // If remaining debt, dates, or plan are updated, sync with the member
    if (targetMemberId && updatedPayment) {
      const up = updatedPayment as Payment;
      const associatedPlan = plans.find((pl) => pl.id === up.membershipPlanId);

      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === targetMemberId) {
            return {
              ...m,
              debtAmount: up.remainingDebt !== undefined ? up.remainingDebt : m.debtAmount,
              expiryDate: updates.newExpiryDate || m.expiryDate,
              paidMonths: up.monthsCount || m.paidMonths,
              membershipPlanId: up.membershipPlanId || m.membershipPlanId,
              membershipPlanName: up.membershipPlanName || m.membershipPlanName,
              accessType: associatedPlan?.accessType || m.accessType,
            };
          }
          return m;
        })
      );
    }

    showToast('To‘lov ma’lumotlari muvaffaqiyatli yangilandi.', 'success');
  };

  const deletePayment = (id: string) => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;

    const targetMemberId = payment.memberId;
    const remainingPayments = payments.filter((p) => p.id !== id && p.memberId === targetMemberId);

    setPayments((prev) => prev.filter((p) => p.id !== id));

    // Rollback or adjust member's financial & subscription state
    if (targetMemberId) {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === targetMemberId) {
            if (remainingPayments.length > 0) {
              // Roll back expiry date by the duration of the deleted payment
              const months = payment.monthsCount || 1;
              const durationDays = months * 30;
              const currentExp = new Date(m.expiryDate);
              currentExp.setDate(currentExp.getDate() - durationDays);
              const rolledBackExpiry = currentExp.toISOString().split('T')[0];

              // Latest remaining payment's debt
              const latestRemaining = remainingPayments[remainingPayments.length - 1];

              return {
                ...m,
                expiryDate: rolledBackExpiry,
                debtAmount: latestRemaining.remainingDebt ?? m.debtAmount,
              };
            } else {
              // No payments left (e.g. initial payment was deleted because of mistaken admission)
              const fullAgreedPrice = m.membershipPriceAgreed || 200000;
              return {
                ...m,
                debtAmount: fullAgreedPrice * (m.paidMonths || 1),
                status: 'expired' as MemberStatus,
              };
            }
          }
          return m;
        })
      );
    }

    showToast(`Kvitansiya № ${payment.receiptNumber} to‘lovi o‘chirildi.`, 'info');
  };

  const settleMemberDebt = (
    memberId: string,
    paidAmount: number,
    paymentMethod: PaymentMethod = 'cash'
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const prevDebt = member.debtAmount || 0;
    const newDebt = Math.max(0, prevDebt - paidAmount);

    const payment: Payment = {
      id: generateId('pay'),
      receiptNumber: generateReceiptNumber(),
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      membershipPlanId: member.membershipPlanId,
      membershipPlanName: `${member.membershipPlanName} (Qarz to‘lovi)`,
      amount: paidAmount,
      monthsCount: member.paidMonths || 1,
      expectedAmount: prevDebt,
      remainingDebt: newDebt,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: 'completed',
      notes: `Mavjud qarzdan ${formatUZS(paidAmount)} so‘ndirildi. Qoldiq qarz: ${formatUZS(newDebt)}`,
    };

    setPayments((prev) => [payment, ...prev]);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, debtAmount: newDebt } : m))
    );

    if (newDebt === 0) {
      showToast(`Mijozning barcha qarzlari to‘liq yopildi! Kvitansiya: ${payment.receiptNumber}`, 'success');
    } else {
      showToast(`Qarzning bir qismi to‘landi. Qoldiq qarz: ${formatUZS(newDebt)}`, 'info');
    }
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

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem('fitnesflow_products', JSON.stringify(INITIAL_PRODUCTS));
    } catch {
      // ignore
    }
    showToast('Barcha mahsulotlar va rasmlar yangilandi!', 'success');
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

  // Website Content Management actions
  const updateWebsiteHero = (heroData: Partial<WebsiteHero>) => {
    setWebsiteContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroData },
    }));
    showToast('Hero bo‘limi muvaffaqiyatli yangilandi!');
  };

  const updateWebsiteStats = (statsData: WebsiteStat[]) => {
    setWebsiteContent((prev) => ({
      ...prev,
      stats: statsData,
    }));
    showToast('Zal statistikasi ko‘rsatkichlari yangilandi!');
  };

  const addWebsiteFeature = (featData: Omit<WebsiteFeature, 'id'>): WebsiteFeature => {
    const newFeature: WebsiteFeature = {
      ...featData,
      id: generateId('feat'),
    };
    setWebsiteContent((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
    showToast(`"${newFeature.title}" qulayligi qo‘shildi!`);
    return newFeature;
  };

  const updateWebsiteFeature = (id: string, featData: Partial<WebsiteFeature>) => {
    setWebsiteContent((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === id ? { ...f, ...featData } : f)),
    }));
    showToast('Qulaylik kartochkasi ma’lumotlari yangilandi!');
  };

  const deleteWebsiteFeature = (id: string) => {
    setWebsiteContent((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
    showToast('Qulaylik kartochkasi o‘chirildi.', 'info');
  };

  const updateWebsiteBanner = (bannerData: Partial<WebsiteBanner>) => {
    setWebsiteContent((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...bannerData },
    }));
    showToast('Aksiya banneri muvaffaqiyatli yangilandi!');
  };

  const updateWebsiteContact = (contactData: Partial<WebsiteContactInfo>) => {
    setWebsiteContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactData },
    }));
    showToast('Aloqa va ijtimoiy tarmoqlar yangilandi!');
  };

  // Contact Messages actions
  const addContactMessage = (
    data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
  ): ContactMessage => {
    const newMsg: ContactMessage = {
      ...data,
      id: generateId('msg'),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    showToast('Murojaatingiz yuborildi! Tez orada siz bilan bog‘lanamiz.', 'success');
    return newMsg;
  };

  const updateMessageStatus = (id: string, status: MessageStatus) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast('Murojaat holati yangilandi.');
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Murojaat o‘chirildi.', 'info');
  };

  const resetToDefault = () => {
    setMembers(INITIAL_MEMBERS);
    setPlans(INITIAL_MEMBERSHIP_PLANS);
    setPayments(INITIAL_PAYMENTS);
    setProducts(INITIAL_PRODUCTS);
    setAdminProfile(DEFAULT_ADMIN);
    setWebsiteContent(INITIAL_WEBSITE_CONTENT);
    setContactMessages(INITIAL_CONTACT_MESSAGES);
    try {
      localStorage.removeItem('fitnesflow_members');
      localStorage.removeItem('fitnesflow_plans');
      localStorage.removeItem('fitnesflow_payments');
      localStorage.removeItem('fitnesflow_products');
      localStorage.removeItem('powerzone_admin_profile');
      localStorage.removeItem('powerzone_website_content');
      localStorage.removeItem('powerzone_contact_messages');
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
        updatePayment,
        deletePayment,
        settleMemberDebt,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        resetProducts,
        adminProfile,
        updateAdminPassword,
        updateAdminProfile,
        websiteContent,
        updateWebsiteHero,
        updateWebsiteStats,
        addWebsiteFeature,
        updateWebsiteFeature,
        deleteWebsiteFeature,
        updateWebsiteBanner,
        updateWebsiteContact,
        contactMessages,
        addContactMessage,
        updateMessageStatus,
        deleteContactMessage,
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
