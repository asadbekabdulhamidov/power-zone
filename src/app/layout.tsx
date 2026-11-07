import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FitnesFlowProvider } from '@/context/fitnes-context';
import { PwaRegister } from '@/components/pwa-register';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Power Zone — Farg‘ona, Quva (Akbarobod) Zamonaviy Fitnes Klub va Boshqaruv Tizimi',
  description: 'Power Zone fitnes klubi va ma’muriyat boshqaruv tizimi. Manzil: Farg‘ona viloyati, Quva tumani, Akbarobod markazi.',
  keywords: ['power zone', 'fitnes quva', 'sport zali akbarobod', 'fargona fitnes', 'fitnes klub boshqaruvi', 'fitnes pwa'],
  manifest: '/manifest.json',
  applicationName: 'Power Zone',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Power Zone',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#090D16',
    'msapplication-navbutton-color': '#090D16',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#090D16] text-slate-100 min-h-screen selection:bg-lime-500 selection:text-black`}>
        <FitnesFlowProvider>
          {children}
          <PwaRegister />
        </FitnesFlowProvider>
      </body>
    </html>
  );
}
