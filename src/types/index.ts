export type AccessType = 'weekly_3_days' | 'monthly_unlimited' | 'single_visit';

export type PlanStatus = 'active' | 'archived';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // in UZS
  description: string;
  durationDays: number;
  accessType: AccessType;
  status: PlanStatus;
  features: string[];
  popular?: boolean;
}

export type MemberStatus = 'active' | 'expiring' | 'expired' | 'frozen';

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  photoUrl: string;
  membershipPlanId: string;
  membershipPlanName: string;
  membershipPriceAgreed: number; // Preserves historical agreed price even when plan changes
  accessType: AccessType;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: MemberStatus;
  visitsThisWeek: number; // max 3 for weekly_3_days
  totalVisits: number;
  lastVisitDate?: string;
  notes?: string;
  gender?: 'erkak' | 'ayol';
  age?: number;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'card' | 'payme' | 'click' | 'other';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  membershipPlanId: string;
  membershipPlanName: string;
  amount: number; // in UZS
  paymentDate: string; // YYYY-MM-DD or ISO
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string;
  notes?: string;
}

export type ProductCategory = 'water' | 'vitamins' | 'sports_drinks' | 'accessories' | 'other';

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  price: number; // in UZS
  stockQuantity: number;
  isActive: boolean;
  unit?: string; // e.g., "dona", "banka", "litr"
}

export type DueType = 'today' | 'tomorrow' | 'overdue';

export interface NotificationItem {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  planName: string;
  expiryDate: string;
  dueType: DueType;
  daysOverdue?: number;
  amount: number;
  status: MemberStatus;
}

export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  todayRevenue: number;
  expiringSoonCount: number;
  overdueCount: number;
  revenueWeeklyGrowth: number;
}

export interface AdminProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}
