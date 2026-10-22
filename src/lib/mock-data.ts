import {
  MembershipPlan,
  Member,
  Payment,
  Product,
  WebsiteContent,
  ContactMessage,
} from '@/types';

// Boshlang'ich tariflar (PostgreSQL bazadagi rasmiy tariflar bilan bir xil)
export const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-weekly-3',
    name: 'Haftasiga 3 kun',
    price: 200000,
    description: 'Haftada istalgan 3 kun zalga tashrif buyurish imkoniyati. Qat’iy kunlar belgilanmagan, o‘zingizga mos vaqtni tanlang.',
    durationDays: 30,
    accessType: 'weekly_3_days',
    status: 'active',
    popular: true,
    features: [
      'Haftasiga 3 ta tashrif (oyiga 12 ta)',
      'Barcha kardio va kuch trenajyorlari',
      'Kiyinish xonasi va dush',
      'Malakali murabbiyning dastlabki maslahati',
      'Bepul ichimlik suvi dispenseridan foydalanish',
    ],
  },
  {
    id: 'plan-monthly-unlimited',
    name: 'Oylik cheklanmagan',
    price: 300000,
    description: '30 kun davomida kunning istalgan vaqtida cheksiz tashrif. Faol sportchilar va natijaga intiluvchilar uchun.',
    durationDays: 30,
    accessType: 'monthly_unlimited',
    status: 'active',
    popular: false,
    features: [
      'Cheksiz tashriflar (haftasiga 7 kun)',
      'Barcha trenajyorlar va krossfit zonasi',
      'Sauna va dam olish xonasi',
      'Shaxsiy shkafcha va dush',
      'Tana tarkibi diagnostikasi (InBody) oyiga 1 marta',
    ],
  },
  {
    id: 'plan-single-visit',
    name: 'Bir martalik mashg‘ulot',
    price: 20000,
    description: 'Bitta to‘liq mashg‘ulot uchun zalga kirish ruxsatnomasi. Mehmonlar va zal bilan tanishmoqchi bo‘lganlar uchun.',
    durationDays: 1,
    accessType: 'single_visit',
    status: 'active',
    popular: false,
    features: [
      '1 ta to‘liq kunlik mashg‘ulot',
      'Barcha zonalardan foydalanish',
      'Kiyinish xonasi va dush',
      'Zal qoidalari bilan tanishish',
    ],
  },
];

// Haqiqiy biznes tizim: Barcha a'zolar, to'lovlar, mahsulotlar va murojaatlar 100% PostgreSQL ma'lumotlar bazasidan keladi.
export const INITIAL_MEMBERS: Member[] = [];
export const INITIAL_PAYMENTS: Payment[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [];

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    badge: 'POWER ZONE FITNES KLUBI',
    title: 'KUCH VA NATIJA BIR JOYDA',
    subtitle:
      'Power Zone — zamonaviy Italiya va Germaniya trenajyorlari, individual yondashuv va qulay sharoitlar bilan Farg‘ona viloyati Quva tumani (Akbarobod markazi)dagi yangi avlod sport zali. Haftalik va oylik moslashuvchan tariflar bilan mashg‘ulotlarni bugunoq boshlang.',
    bullets: [
      'Haftasiga istalgan 3 kun erkin tanlov',
      'Dush, sauna va shaxsiy shkafchalar',
      'Professional trenerlar nazorati',
    ],
    backgroundImage: '/images/hero/hero-bg.webp',
  },
  stats: [
    {
      id: 'stat-1',
      value: '1,200+',
      label: 'Kvadrat metr maydon',
    },
    {
      id: 'stat-2',
      value: '60+',
      label: 'Zamonaviy trenajyorlar',
    },
    {
      id: 'stat-3',
      value: '15+',
      label: 'Malakali murabbiylar',
    },
    {
      id: 'stat-4',
      value: '07:00 – 23:00',
      label: 'Haftasiga 7 kun ochiq',
    },
  ],
  features: [
    {
      id: 'feat-1',
      iconName: 'Dumbbell',
      title: 'Eng So‘nggi Trenajyorlar',
      desc: 'Italiya va Germaniya ishlab chiqaruvchilarining zamonaviy biomexanik uskunalar to‘plami (Technogym, Hammer Strength).',
    },
    {
      id: 'feat-2',
      iconName: 'Users',
      title: 'Professional Murabbiylar',
      desc: 'Har bir a’zoga individual yondashuv, tana tahlili va shaxsiy mashg‘ulot dasturi ishlab chiquvchi sertifikatlangan instruktorlar.',
    },
    {
      id: 'feat-3',
      iconName: 'HeartPulse',
      title: 'Kardio va Krossfit Zonalari',
      desc: 'Yurak-qon tomir tizimini mustahkamlovchi yugurish yo‘lakchalari, velotrenajyorlar va funksional mashg‘ulot zonalari.',
    },
    {
      id: 'feat-4',
      iconName: 'Wind',
      title: 'Mikroiqlim va Toza Havo',
      desc: 'Zal ichida harorat va kislorod miqdorini barqaror ushlab turuvchi 4 bosqichli HEPA ventilyatsiya va sovutish tizimi.',
    },
    {
      id: 'feat-5',
      iconName: 'Sparkles',
      title: 'Sauna va Qulay Kiyinish Xonalari',
      desc: 'Mashg‘ulotdan so‘ng mushaklarni dam oldirish uchun fin saunasi, keng shaxsiy shkafchalar va zamonaviy dush kabinalari.',
    },
    {
      id: 'feat-6',
      iconName: 'ShieldCheck',
      title: 'Shaffof Boshqaruv va Qulaylik',
      desc: 'Abonementingiz, tashriflaringiz va to‘lovlaringiz Power Zone raqamli tizimida 100% aniq va shaffof qayd etiladi.',
    },
  ],
  banner: {
    badge: 'Individual Yondashuv',
    title: 'Birinchi Mashg‘ulotda Murabbiy Maslahati Mutlaqo Bepul',
    desc: 'Yangi boshlayotgan bo‘lsangiz, tajribali murabbiyimiz trenajyorlardan to‘g‘ri foydalanishni tushuntiradi, jismoniy holatingizni baholaydi va maqsadlaringizga mos mashqlar rejasini tuzishda ko‘maklashadi.',
    linkText: 'Tariflar bilan tanishing va a’zo bo‘ling',
    imageUrl: '/images/about/coach-training.webp',
  },
  contact: {
    phone: '+998 (90) 123-45-67',
    email: 'info@powerzone.uz',
    address: 'Farg‘ona viloyati, Quva tumani, Akbarobod markazi',
    landmark: 'Akbarobod markazi, asosiy yo‘l bo‘yida',
    workingHoursWeekdays: '07:00 – 23:00',
    workingHoursSunday: '08:00 – 22:00',
    telegramChannel: 'https://t.me/powerzone_quva',
    telegramAdmin: 'https://t.me/powerzone_admin',
    instagram: 'https://instagram.com/powerzone_quva',
  },
};
