import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount into Uzbek Sum (UZS)
 * e.g. 200000 -> "200,000 UZS" or "200 000 so'm"
 */
export function formatUZS(amount: number | string | '' | null | undefined, suffix: 'UZS' | "so'm" = 'UZS'): string {
  if (amount === '' || amount === null || amount === undefined) return `0 ${suffix}`;
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (isNaN(num)) return `0 ${suffix}`;
  const formatted = new Intl.NumberFormat('uz-UZ').format(Math.round(num));
  return `${formatted} ${suffix}`;
}

/**
 * Safely parse numeric input from form events, allowing empty string when cleared with backspace
 * and stripping unwanted leading zeroes (e.g. "01222" -> 1222, "0" -> 0, "" -> "").
 */
export function parseNumericInput(val: string | number | null | undefined): number | '' {
  if (val === '' || val === null || val === undefined) {
    return '';
  }
  const str = String(val).trim();
  if (str === '') {
    return '';
  }
  // Strip leading zeroes followed by another digit, e.g. "01222" -> "1222"
  const clean = str.replace(/^0+(?=\d)/, '');
  const num = Number(clean);
  return isNaN(num) ? '' : num;
}

/**
 * Format ISO date string into readable Uzbek date
 * e.g. "2026-10-21" -> "21-Oktabr, 2026"
 */
export function formatDateUz(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculate difference in days from today to a target date
 * Negative means overdue / expired
 */
export function getDaysDifference(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Generate a clean receipt number
 * e.g. REC-2026-1021-4921
 */
export function generateReceiptNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FF-${y}${m}${d}-${rand}`;
}

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Normalize and format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('998') && cleaned.length === 12) {
    return `+998 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10, 12)}`;
  }
  return phone;
}
