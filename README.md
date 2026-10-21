# FitnesFlow — Fitness Club Management Platform (O‘zbekiston)

**FitnesFlow** — O‘zbekistondagi zamonaviy fitnes zallari va sport klublari uchun maxsus ishlab chiqilgan, barcha asosiy boshqaruv jarayonlarini raqamlashtiruvchi professional frontend platforma.

Loyiha ikki asosiy qismdan iborat:
1. **Ommaviy veb-sayt (Landing page)** — Klubga tashrif buyuruvchilar, potentsial mijozlar, tariflar, galereya va sport tovarlari namoyishi uchun.
2. **Yopiq boshqaruv tizimi (Admin Dashboard)** — Klub egalari, ma’murlar va menejerlar uchun a’zolar, to‘lovlar, tushumlar, bildirishnomalar va mahsulotlar hisoboti.

---

## 🚀 Texnologik Stek

- **Freymvork**: Next.js 15 (App Router, Turbopack)
- **Dasturlash tili**: TypeScript (qat’iy tiplar, to‘liq domen modellari)
- **Stillashtirish**: Tailwind CSS v4 (zamonaviy quyuq estetika, charcoals & energetic lime accent)
- **Komponentlar**: shadcn/ui uslubidagi qayta ishlatiluvchi modulli komponentlar (Modal, Table, Button, Badge, Input, Select, Tabs)
- **Ikonkalar**: Lucide React
- **Forma va Validatsiya**: React Hook Form va Zod
- **Grafiklar va Diagrammalar**: Recharts (haftalik va oylik tushumlar dinamikasi)
- **Holat boshqaruvi (State Management)**: Markazlashtirilgan reaktiv `FitnesFlowProvider` (brauzerda `localStorage` orqali saqlash va sinxronizatsiya)

---

## 📁 Yo‘nalishlar (Routes) va Sahifalar

| Yo‘nalish | Tavsif |
| :--- | :--- |
| `/` | **Mijozlar uchun ommaviy veb-sayt**: Hero, Biz haqimizda, Fotogalereya, Tariflar, Fitnes bar, Manzil va xarita, Footer. |
| `/admin/login` | **Admin kirish sahifasi**: Show/hide parol ko‘rsatish, Zod validatsiyasi, eslab qolish va bir klikda to‘ldiriladigan demo tugmasi. |
| `/admin` | **Boshqaruv paneli (Dashboard)**: Jami a’zolar, faol a’zolar, bugungi tushum, muddati tugayotganlar, Recharts tushumlar grafigi, oxirgi to‘lovlar va kutilayotgan to‘lovlar. |
| `/admin/members` | **A’zolar boshqaruvi**: Qidiruv, statuslar filtri, yangi a’zo qo‘shish, tahrirlash, profil ko‘rish, tashrif qayd etish (haftasiga 3 kunlik limit nazorati bilan). |
| `/admin/memberships` | **Tarif rejalari**: Tariflar ro‘yxati, yangi tarif yaratish, tahrirlash, arxivlash, daxlsiz narxlar qoidasi (tarixiy a’zolarning kelishilgan narxi saqlanadi). |
| `/admin/payments` | **To‘lovlar tarixi**: Tushumlar ro‘yxati, qidiruv, to‘lov usullari filtri, yangi to‘lov kiritish va chop etiladigan rasmiy FitnesFlow kvitansiyasi. |
| `/admin/notifications` | **Muddat eslatmalari**: "Bugun tugaydiganlar", "Ertaga tugaydiganlar", "Muddati o‘tganlar" tablari, raqamdan nusxa olish, Telegram orqali xabar yozish, klub qoidalari ma’lumotnomasi. |
| `/admin/products` | **Mahsulotlar katalogi**: Ichimliklar, vitaminlar, kokteyllar, oqsillar va aksessuarlar ombori CRUD (narx, qoldiq, faol/faol emaslik holati). |

---

## 💳 A’zolik Qoidalari va Standart Tariflar

Tizimda 3 ta boshlang‘ich tarif rejalashtirilgan bo‘lib, ular domen modeli orqali boshqariladi:

1. **"Haftasiga 3 kun" — 200,000 UZS**:
   - A’zo haftaning istalgan 3 kunini o‘z jadvaliga mos ravishda erkin tanlashi mumkin.
   - Majburiy qat’iy kunlar belgilanmagan.
   - Tizim har bir a’zolik haftasi uchun maksimal 3 ta tashrifni qayd etish imkonini beradi (limit to‘lganda xatolik xabari chiqadi).
2. **"Oylik cheklanmagan" — 300,000 UZS**:
   - 30 kun davomida klubga cheksiz va istalgan vaqtda kirish ruxsatnomasi.
3. **"Bir martalik mashg‘ulot" — 20,000 UZS**:
   - Zal bilan tanishish yoki 1 ta to‘liq kunlik mashg‘ulot uchun.

> **Tarixiy Narxlar Daxlsizligi Qoidasi**: Agar administrator tarif narxini o‘zgartirsa yoki yangilasa, avval ro‘yxatdan o‘tgan a’zolarning dastlabki kelishilgan to‘lov summasi (`membershipPriceAgreed`) saqlanib qoladi.

---

## 💻 Mahalliy Ishga Tushirish

Loyihani o‘z kompyuteringizda ishga tushirish uchun quyidagi buyruqlarni bajaring:

```bash
# Paketlarni o'rnatish
npm install --legacy-peer-deps

# Dasturchi rejimida ishga tushirish
npm run dev

# Yoki to'liq production build qilish va ishga tushirish
npm run build
npm start
```

Brauzerda [http://localhost:3000](http://localhost:3000) manzilini oching.

### Admin Tizimiga Kirish:
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@fitnesflow.uz`
- **Parol**: `fitnes2026!` (yoki login sahifasidagi *"Demo login/parolni avtomatik to‘ldirish"* tugmasini bosing).

---

## 🎨 Dizayn Falsafasi

- **Ranglar**: Chuqur antratsit va qora fon (`#090D16`, `#111827`, `#0D131F`), kontrastli oq va neytral kulrang matnlar, yorqin baquvvat laym-yashil urg‘u (`#84CC16` / `#A3E635`).
- **Mikrointeraktivlik**: Shaffof glassmorphism panellari, nozik chegaralar (`border-zinc-800`), yumshoq hover effektlari va global bildirishnoma (Toast) tizimi.
- **Moslashuvchanlik**: Mobil telefonlar (hamburger drawer), planshetlar va katta monitorlar uchun 100% to‘liq moslashtirilgan.
