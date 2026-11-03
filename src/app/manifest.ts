import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Power Zone — Admin Boshqaruv Tizimi',
    short_name: 'Power Zone Admin',
    description: 'Power Zone fitnes klubi administratorlari uchun a’zolar, to‘lovlar va davomatni boshqarish dasturi.',
    start_url: '/admin',
    id: '/admin',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#090D16',
    theme_color: '#090D16',
    orientation: 'any',
    lang: 'uz',
    dir: 'ltr',
    scope: '/',
    categories: ['fitness', 'business', 'productivity', 'sports'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Boshqaruv Paneli',
        short_name: 'Admin',
        description: 'Umumiy zal statistikasi va monitoringi',
        url: '/admin',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'A’zolar Ro‘yxati',
        short_name: 'A’zolar',
        description: 'Zal a’zolari, davomat va yangi a’zo qo‘shish',
        url: '/admin/members',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'To‘lovlar va Kassa',
        short_name: 'To‘lovlar',
        description: 'To‘lovlar tarixi, kassa va kvitansiyalar',
        url: '/admin/payments',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
    prefer_related_applications: false,
  };
}
