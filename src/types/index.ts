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

export interface WebsiteFeature {
  id: string;
  title: string;
  desc: string;
  iconName: 'Dumbbell' | 'Users' | 'HeartPulse' | 'Wind' | 'Sparkles' | 'ShieldCheck' | 'Flame' | 'Trophy';
}

export interface WebsiteStat {
  id: string;
  value: string;
  label: string;
}

export interface WebsiteHero {
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface WebsiteBanner {
  badge: string;
  title: string;
  desc: string;
  linkText: string;
}

export interface WebsiteContactInfo {
  phone: string;
  email: string;
  address: string;
  landmark: string;
  workingHoursWeekdays: string;
  workingHoursSunday: string;
  telegramChannel: string;
  telegramAdmin: string;
  instagram: string;
}

export interface WebsiteContent {
  hero: WebsiteHero;
  stats: WebsiteStat[];
  features: WebsiteFeature[];
  banner: WebsiteBanner;
  contact: WebsiteContactInfo;
}

export type MessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt: string; // ISO format
  status: MessageStatus;
}
