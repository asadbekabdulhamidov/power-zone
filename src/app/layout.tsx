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
  title: 'Power Zone — Farg‘ona, Quva (Akbarobod) Zamonaviy Fitnes Klub va Boshqaruv Tizimi',
  description: 'Power Zone fitnes klubi va ma’muriyat boshqaruv tizimi. Manzil: Farg‘ona viloyati, Quva tumani, Akbarobod markazi.',
  keywords: ['power zone', 'fitnes quva', 'sport zali akbarobod', 'fargona fitnes', 'fitnes klub boshqaruvi'],
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
