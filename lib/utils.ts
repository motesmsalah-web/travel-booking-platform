import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatPrice(value: number | null | undefined) { if (value == null) return '-'; return new Intl.NumberFormat('ar', { maximumFractionDigits: 0 }).format(value) + ' ريال'; }
export const tripTypeLabel = (v: string) => v === 'GROUP_TRANSPORT' ? 'نقل جماعي' : 'سيارة خاصة';
