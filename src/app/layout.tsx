import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FitnesFlowProvider } from '@/context/fitnes-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FitnesFlow — Toshkentdagi Zamonaviy Fitnes Klub va Boshqaruv Tizimi',
  description: 'FitnesFlow fitness klubi va ma’muriyat boshqaruv tizimi. A’zolar, to‘lovlar, tariflar va mahsulotlar nazorati.',
  keywords: ['fitness uzbekistan', 'fitnes toshkent', 'sport zali', 'fitnes klub boshqaruvi', 'fitnesflow'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#090D16] text-slate-100 min-h-screen selection:bg-lime-500 selection:text-black`}>
        <FitnesFlowProvider>{children}</FitnesFlowProvider>
      </body>
    </html>
  );
}
