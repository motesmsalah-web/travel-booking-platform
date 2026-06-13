import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', display: 'swap' });
export const metadata: Metadata = { title: 'منصة حجز سفريات وسياحة', description: 'منصة عربية لحجز رحلات السفر عبر واتساب' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ar" dir="rtl"><body className={cairo.variable}>{children}</body></html>; }
