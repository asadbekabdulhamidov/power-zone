/**
 * Power Zone — Centralized API Client
 * 
 * Ushbu xizmat frontend va backend o'rtasidagi barcha HTTP so'rovlarni boshqaradi.
 * Serverga joylanganda faqat NEXT_PUBLIC_API_URL o'zgaruvchisini almashtirish kifoya.
 */

import {
  Member,
  MembershipPlan,
  Payment,
  Product,
  ContactMessage,
  WebsiteContent,
  AdminProfile,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const TOKEN_STORAGE_KEY = 'powerzone_token';
export const USER_STORAGE_KEY = 'powerzone_user';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    phone: string;
    role: string;
  };
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

// Barcha so'rovlar uchun yagona yordamchi funksiya
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Agar token mavjud bo'lsa, avtomatik Authorization sarlavhasini biriktirish
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Agar 401 Unauthorized bo'lsa va brauzerda bo'lsak, tokenni tozalash
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  // Javobni o'qish (JSON yoki bo'sh matn)
  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    const text = await response.text();
    responseData = text ? { message: text } : null;
  }

  if (!response.ok) {
    const errObj = responseData as ApiErrorResponse | null;
    const errorMessage =
      (errObj && (errObj.message || errObj.error)) ||
      `So‘rov xatolik bilan yakunlandi (HTTP ${response.status})`;
    
    // Agar massiv bo'lsa (class-validator xatolari)
    const formattedMessage = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : errorMessage;

    throw new ApiError(formattedMessage, response.status, responseData);
  }

  return responseData as T;
}

export const api = {
  baseUrl: API_BASE_URL,

  // ==========================================
  // 1. AUTHENTICATION (Kirish va Profil)
  // ==========================================
  auth: {
    async login(credentials: { login?: string; emailOrUsername?: string; password: string }) {
      const payload = {
        login: credentials.login || credentials.emailOrUsername,
        password: credentials.password,
      };
      const res = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.accessToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      }
      return res;
    },

    async getProfile() {
      return request<AdminProfile>('/auth/me');
    },

    async updateProfile(data: { fullName: string; email: string; phone: string; username?: string }) {
      return request<AdminProfile>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async updatePassword(data: { currentPassword: string; newPassword: string }) {
      return request<{ message: string }>('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    logout() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    },
  },

  // ==========================================
  // 2. MEMBERS (A'zolar)
  // ==========================================
  members: {
    async getAll(query?: { search?: string; status?: string; planId?: string; page?: number; limit?: number }) {
      const params = new URLSearchParams();
      if (query?.search) params.set('search', query.search);
      if (query?.status) params.set('status', query.status);
      if (query?.planId) params.set('planId', query.planId);
      if (query?.page) params.set('page', String(query.page));
      if (query?.limit) params.set('limit', String(query.limit));
      
      const qs = params.toString();
      return request<PaginatedResult<Member>>(
        `/members${qs ? `?${qs}` : ''}`
      );
    },

    async getById(id: string) {
      return request<Member>(`/members/${id}`);
    },

    async create(data: Partial<Member> & { paidAmount?: number; paymentMethod?: string }) {
      return request<{ member: Member; initialPayment: Payment }>('/members', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<Member>) {
      return request<Member>(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return request<{ message: string }>(`/members/${id}`, {
        method: 'DELETE',
      });
    },

    async recordVisit(id: string, notes?: string) {
      return request<{ success: boolean; message: string; visit: unknown }>(`/members/${id}/visit`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
    },

    async settleDebt(id: string, data: { amount: number; paymentMethod?: string; notes?: string }) {
      return request<{ message: string; member: Member; payment: Payment }>(`/members/${id}/settle-debt`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // ==========================================
  // 3. MEMBERSHIP PLANS (Tariflar)
  // ==========================================
  plans: {
    async getAll(onlyActive?: boolean) {
      const qs = onlyActive ? '?onlyActive=true' : '';
      return request<MembershipPlan[]>(`/plans${qs}`);
    },

    async getById(id: string) {
      return request<MembershipPlan>(`/plans/${id}`);
    },

    async create(data: Omit<MembershipPlan, 'id'>) {
      return request<MembershipPlan>('/plans', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<MembershipPlan>) {
      return request<MembershipPlan>(`/plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return request<{ message: string }>(`/plans/${id}`, {
        method: 'DELETE',
      });
    },

    async toggleStatus(id: string) {
      return request<MembershipPlan>(`/plans/${id}/toggle-status`, {
        method: 'PATCH',
      });
    },
  },

  // ==========================================
  // 4. PAYMENTS (To'lovlar)
  // ==========================================
  payments: {
    async getAll(query?: { search?: string; paymentMethod?: string; page?: number; limit?: number }) {
      const params = new URLSearchParams();
      if (query?.search) params.set('search', query.search);
      if (query?.paymentMethod) params.set('paymentMethod', query.paymentMethod);
      if (query?.page) params.set('page', String(query.page));
      if (query?.limit) params.set('limit', String(query.limit));

      const qs = params.toString();
      return request<PaginatedResult<Payment>>(
        `/payments${qs ? `?${qs}` : ''}`
      );
    },

    async getById(id: string) {
      return request<Payment>(`/payments/${id}`);
    },

    async create(data: Partial<Payment>) {
      return request<Payment>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<Payment>) {
      return request<Payment>(`/payments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return request<{ message: string }>(`/payments/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // ==========================================
  // 5. PRODUCTS (Fitnes Bar Mahsulotlari)
  // ==========================================
  products: {
    async getAll(all: boolean = true) {
      return request<Product[]>(`/products?all=${all}`);
    },

    async getById(id: string) {
      return request<Product>(`/products/${id}`);
    },

    async create(data: Omit<Product, 'id'>) {
      return request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: Partial<Product>) {
      return request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return request<{ message: string }>(`/products/${id}`, {
        method: 'DELETE',
      });
    },

    async toggleActive(id: string) {
      return request<Product>(`/products/${id}/toggle-active`, {
        method: 'PATCH',
      });
    },
  },

  // ==========================================
  // 6. WEBSITE CONTENT & CMS (Sayt kontenti)
  // ==========================================
  website: {
    async getContent() {
      return request<WebsiteContent>('/website');
    },

    async updateContent(data: Partial<WebsiteContent>) {
      return request<WebsiteContent>('/website', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // ==========================================
  // 7. INQUIRY MESSAGES (Saytdan arizalar)
  // ==========================================
  messages: {
    async getAll(status?: string) {
      const qs = status ? `?status=${status}` : '';
      return request<ContactMessage[]>(`/messages${qs}`);
    },

    async create(data: { fullName: string; phone: string; subject?: string; message: string }) {
      return request<ContactMessage>('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateStatus(id: string, status: string) {
      return request<ContactMessage>(`/messages/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    async delete(id: string) {
      return request<{ message: string }>(`/messages/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // ==========================================
  // 8. DASHBOARD (Statistika va Grafika)
  // ==========================================
  dashboard: {
    async getStats() {
      return request<{
        totalMembers: number;
        activeMembers: number;
        frozenMembers: number;
        expiredMembers: number;
        expiringCount: number;
        todayRevenue: number;
        totalDebt: number;
        todayVisits: number;
      }>('/dashboard/stats');
    },

    async getRevenueChart() {
      return request<{
        weekly: Array<{ date: string; amount: number }>;
        monthly: Array<{ month: string; amount: number }>;
      }>('/dashboard/revenue-chart');
    },

    async getNotifications() {
      return request<{
        dueToday: unknown[];
        dueTomorrow: unknown[];
        overdue: unknown[];
      }>('/dashboard/notifications');
    },
  },
};
