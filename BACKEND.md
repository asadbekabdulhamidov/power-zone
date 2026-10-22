# Power Zone (FitnesFlow) — Backend Arxitektura va Texnik Topshiriq (SRS)

> **Ushbu fayl haqida**: Ushbu hujjat **Power Zone** fitnes klubi boshqaruv tizimi uchun mustaqil backend loyihasini (NestJS + PostgreSQL + Prisma ORM) noldan yaratish bo‘yicha to‘liq texnik topshiriq va tayyor promptlar to‘plamidir.
> Boshqa loyiha papkasida ishlayotgan AI Agent yoki dasturchiga ushbu faylni to‘liq taqdim etish orqali ishlab chiqishni boshlash mumkin.

---

## 1. Loyihaning Maqsadi va Arxitekturasi

Frontend loyihasi (**Next.js 15, React 19, Tailwind CSS v4, TypeScript**) to‘liq ishlab chiqilgan va barcha foydalanuvchi/admin interfeyslari tayyor holatda. Endi unga mustaqil, xavfsiz va yuqori unumli REST API backend kerak.

### Tanlangan Texnologiyalar Staki:
- **Asosiy Framework**: **NestJS (TypeScript)** — modulli arxitektura, qat’iy tiplash, `Dependency Injection`, `Guards`, `Interceptors`.
- **Ma’lumotlar Bazasi**: **PostgreSQL 15+** — moliyaviy tranzaksiyalar, tashrif jurnali va munosabatlar uchun yuqori ishonchlilik.
- **ORM**: **Prisma ORM** — tip-xavfsiz migratsiyalar, qulay schema va tezkor so‘rovlar.
- **Autentifikatsiya**: **JWT (JSON Web Token)** + **Passport.js** + **bcryptjs** (parollarni xeshlash).
- **Validatsiya**: `class-validator` va `class-transformer` (kiruvchi DTO-larni qat’iy tekshirish).
- **API Hujjatlashtirish**: **Swagger / OpenAPI** (`@nestjs/swagger`) — `/api/docs` manzilida interaktiv sinov paneli.
- **CORS**: Next.js frontend domeni (`http://localhost:3000` va production domen) uchun to‘liq sozlangan.

---

## 2. To‘liq Ma’lumotlar Bazasi Strukturasi (`prisma/schema.prisma`)

Quyidagi Prisma schema backend loyihasida to‘g‘ridan-to‘g‘ri `prisma/schema.prisma` sifatida ishlatilishi lozim:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  RECEPTIONIST
}

enum AccessType {
  weekly_3_days
  monthly_unlimited
  single_visit
}

enum PlanStatus {
  active
  archived
}

enum MemberStatus {
  active
  expiring
  expired
  frozen
}

enum PaymentMethod {
  cash
  card
  payme
  click
  other
}

enum PaymentStatus {
  completed
  pending
  failed
  refunded
}

enum ProductCategory {
  water
  vitamins
  sports_drinks
  accessories
  other
}

enum MessageStatus {
  new
  read
  replied
}

enum Gender {
  erkak
  ayol
}

// 1. Tizim Administratorlari
model User {
  id        String   @id @default(uuid())
  fullName  String
  email     String   @unique
  username  String   @unique
  phone     String
  password  String   // bcrypt hash
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. Klub A'zolari (Mijozlar)
model Member {
  id                     String             @id @default(uuid())
  fullName               String
  phone                  String
  photoUrl               String
  telegramUsername       String?
  instagramUsername      String?
  membershipPlanId       String
  membershipPlanName     String
  membershipPriceAgreed  Float              // A'zo bo'lgandagi kelishilgan narx (tarixiy narx saqlanadi)
  debtAmount             Float              @default(0) // Qoldiq qarz
  paidMonths             Int                @default(1) // Necha oylik to'langan
  accessType             AccessType         @default(monthly_unlimited)
  startDate              DateTime           // A'zolik boshlanish sanasi
  expiryDate             DateTime           // A'zolik tugash sanasi
  status                 MemberStatus       @default(active)
  visitsThisWeek         Int                @default(0) // weekly_3_days uchun max 3
  totalVisits            Int                @default(0)
  lastVisitDate          DateTime?
  gender                 Gender             @default(erkak)
  age                    Int                @default(25)
  notes                  String?
  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt

  plan                   MembershipPlan     @relation(fields: [membershipPlanId], references: [id])
  payments               Payment[]
  visits                 AttendanceVisit[]

  @@index([phone])
  @@index([status])
}

// 3. Tarif Rejalari (Abonementlar)
model MembershipPlan {
  id           String     @id @default(uuid())
  name         String
  price        Float      // UZS
  description  String
  durationDays Int        @default(30)
  accessType   AccessType @default(monthly_unlimited)
  status       PlanStatus @default(active)
  features     String[]   // Imkoniyatlar ro'yxati (bullet points)
  popular      Boolean    @default(false)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  members      Member[]
  payments     Payment[]
}

// 4. Kassa To'lovlari va Kvitansiyalar
model Payment {
  id                 String         @id @default(uuid())
  receiptNumber      String         @unique // e.g. "PAY-20261022-0042"
  memberId           String
  memberName         String
  memberPhone        String
  membershipPlanId   String
  membershipPlanName String
  amount             Float          // Amalda to'langan summa (UZS)
  monthsCount        Int            @default(1)
  expectedAmount     Float          // Reja bo'yicha to'liq summa
  remainingDebt      Float          @default(0) // Ushbu to'lovdan keyin qolgan qarz
  paymentDate        DateTime       @default(now())
  paymentMethod      PaymentMethod  @default(cash)
  status             PaymentStatus  @default(completed)
  notes              String?
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  member             Member         @relation(fields: [memberId], references: [id], onDelete: Cascade)
  plan               MembershipPlan @relation(fields: [membershipPlanId], references: [id])

  @@index([receiptNumber])
  @@index([memberId])
  @@index([paymentDate])
}

// 5. Tashriflar Jurnali (Davomat nazorati)
model AttendanceVisit {
  id        String   @id @default(uuid())
  memberId  String
  visitDate DateTime @default(now())
  notes     String?

  member    Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@index([memberId])
  @@index([visitDate])
}

// 6. Fitnes Bar Mahsulotlari
model Product {
  id            String          @id @default(uuid())
  name          String
  imageUrl      String
  category      ProductCategory @default(water)
  categoryLabel String
  description   String
  price         Float           // UZS
  stockQuantity Int             @default(0)
  isActive      Boolean         @default(true) // Faqat true bo'lganlar saytda chiqadi
  unit          String          @default("dona")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

// 7. Sayt Xabarlari va Arizalar (Inquiries)
model ContactMessage {
  id        String        @id @default(uuid())
  fullName  String
  phone     String
  subject   String?
  message   String
  status    MessageStatus @default(new)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([status])
}

// 8. Sayt Kontenti (CMS)
model WebsiteContent {
  id                   String   @id @default("default")
  heroBadge            String   @default("POWER ZONE FITNES KLUBI")
  heroTitle            String   @default("KUCH VA NATIJA BIR JOYDA")
  heroSubtitle         String   @default("Zamonaviy trenajyorlar, professional murabbiylar va qulay sharoitlar.")
  heroBullets          String[]
  stat1Value           String   @default("1,200+ m²")
  stat1Label           String   @default("Keng va yorug‘ zal maydoni")
  stat2Value           String   @default("60+ dona")
  stat2Label           String   @default("Eng so‘nggi biomexanik trenajyorlar")
  stat3Value           String   @default("15+ nafar")
  stat3Label           String   @default("Professional sertifikatlangan murabbiylar")
  stat4Value           String   @default("07:00 – 23:00")
  stat4Label           String   @default("Haftaning 7 kuni dam olishsiz ish vaqti")
  bannerBadge          String   @default("YANGI A'ZOLAR UCHUN")
  bannerTitle          String   @default("Birinchi Mashg‘ulotga Yoziling!")
  bannerDesc           String   @default("Bugunoq zalimizga tashrif buyuring va professional muhitda shug‘ullaning.")
  bannerLinkText       String   @default("A'zo Bo'lish")
  phone                String   @default("+998 90 123 45 67")
  email                String   @default("info@powerzone.uz")
  address              String   @default("Farg‘ona viloyati, Quva tumani, Akbarobod markazi")
  landmark             String   @default("Markaziy maydon ro‘parasida")
  workingHoursWeekdays String   @default("07:00 – 23:00")
  workingHoursSunday   String   @default("08:00 – 22:00")
  telegramChannel      String   @default("https://t.me/powerzone_quva")
  telegramAdmin        String   @default("https://t.me/powerzone_admin")
  instagram            String   @default("https://instagram.com/powerzone_quva")
  updatedAt            DateTime @updatedAt
}
```

---

## 3. Qat’iy Biznes Qoidalar (Business Logic Requirements)

Backend xizmatlari quyidagi qoidalarni 100% dasturiy jihatdan ta’minlashi shart:

### 1. Haftasiga 3 kunlik tarif qoidasi (`weekly_3_days` — 200,000 UZS)
- A‘zo haftaning istalgan 3 kunini o‘zi tanlab kelishi mumkin (belgilangan dushanba-chorshanba-juma cheklovi yo‘q).
- Ammo har bir kalendar haftasida (dushanbadan yakshanbagacha) **ko‘pi bilan 3 ta tashrif** qayd etilishi mumkin.
- 4-tashrifga urinish bo‘lganda server `400 Bad Request` qaytaradi: `"Haftalik limit (3/3) to'lgan! Keyingi haftagacha tashrif cheklangan."`
- Har dushanba soat 00:00 da barcha a‘zolarning `visitsThisWeek` hisoblagichi `0` ga yangilanadi (NestJS `@Cron('0 0 * * 1')` orqali).

### 2. Bir martalik mashg‘ulot (`single_visit` — 20,000 UZS)
- A‘zo zalga 1 marta kirgan zahoti uning statusi avtomatik `expired` ga o‘tadi va keyingi tashrif bloklanadi.

### 3. Muzlatilgan holat (`frozen`)
- Agar a‘zoning holati `frozen` bo‘lsa, zalga kirish qat‘iy bloklanadi: `"Abonement muzlatilgan! Avval statusni faol holatga o‘tkazing."`

### 4. A’zolik muddati va oylarni hisoblash (Double-extension bugdan himoya)
- 1 oy = 30 kun, 2 oy = 60 kun, 3 oy = 90 kun, 6 oy = 180 kun, 12 oy = 360 kun.
- Yangi a‘zo ochilganda dastlabki to‘lov muddati to‘g‘ridan-to‘g‘ri hisoblangan sanaga o‘rnatiladi (`customExpiryDate`), sequential takroriy hisoblash qilinmaydi.
- Mavjud a‘zo muddati tugamasdan turib to‘lov qilsa, yangi muddat **mavjud tugash sanasi ustiga** qo‘shiladi.
- Agar a‘zoning muddati o‘tib ketgan bo‘lsa, yangi muddat to‘lov qilingan sanadan boshlab qo‘shiladi.

### 5. Chegirma va Kelishilgan Narx (`membershipPriceAgreed`)
- Klub ma’muriyati ma’lum bir mijozga standart narxdan arzonroq kelishilgan narx belgilashi mumkin (masalan, 300,000 so‘mlik tarifni 250,000 so‘m qilib berish).
- Ushbu narx a‘zo profilida `membershipPriceAgreed` sifatida saqlanadi. Agar mijoz kelishilgan 250,000 so‘mni to‘lasa, unga **0 so‘m qarz** yoziladi (soxta 50,000 so‘m qarz chiqmasligi lozim).
- Keyingi oylarda abonementni uzaytirganda tizim a‘zoning aynan shu kelishilgan narxini asos qilib oladi.
- Ma’muriyat umumiy tarif narxini o‘zgartirsa ham, avvalgi mijozlarning kelishilgan narxi daxlsiz qoladi.

### 6. To‘lov bekor qilinganda / o‘chirilganda holatni orqaga qaytarish (Rollback)
- Agar noto‘g‘ri yoki dublyaj kiritilgan to‘lov o‘chirilsa:
  - Agar mijozda boshqa to‘lovlar qolgan bo‘lsa: a‘zolik muddati o‘chirilgan to‘lov muddati (masalan, -30 kun) miqdorida orqaga suriladi va qoldiq qarz oxirgi to‘lov holatiga qaytariladi.
  - Agar bu mijozning yagona to‘lovi bo‘lsa: mijoz hisobida to‘liq kelishilgan summa qarz sifatida qayd etiladi va status `expired` qilinadi.

### 7. Kvitansiya Raqamlash Formati
- Har bir to‘lov uchun unikal kvitansiya raqami: `№ PAY-YYYYMMDD-XXXX` (masalan: `PAY-20261022-0012`).

---

## 4. To‘liq REST API Endpointlar Ro‘yxati

Barcha endpointlar `/api` prefiksi ostida ishlaydi.

### A. Autentifikatsiya va Admin Profili (`/api/auth`)
- `POST /api/auth/login` — Kirish (Email yoki username, parol). `accessToken` va `user` qaytaradi.
- `GET /api/auth/me` — Amaldagi admin profili ma’lumotlari (Bearer Token talab etiladi).
- `PUT /api/auth/profile` — Admin ism, email va telefonini yangilash.
- `PUT /api/auth/password` — Parolni o‘zgartirish (Joriy parol, yangi parol kamida 6 belgi).

### B. A’zolar Boshqaruvi (`/api/members`)
- `GET /api/members` — Barcha a‘zolar ro‘yxati.
  - Query parametrlar: `search` (ism, telefon yoki telegram), `status` (`all`, `active`, `expiring`, `expired`, `frozen`, `debtors`), `planId`, `page`, `limit`.
- `GET /api/members/:id` — Bitta a‘zoning to‘liq profili, to‘lovlar tarixi va tashrif jurnali bilan.
- `POST /api/members` — Yangi a‘zo ro‘yxatdan o‘tkazish.
  - DTO: `fullName`, `phone`, `gender`, `age`, `telegramUsername`, `instagramUsername`, `photoUrl`, `membershipPlanId`, `membershipPriceAgreed`, `paidMonths`, `paidAmount`, `paymentMethod`, `startDate`, `notes`.
  - Dastlabki to‘lov avtomatik kassa jadvaliga kvitansiya sifatida yoziladi.
- `PUT /api/members/:id` — A‘zo ma’lumotlarini tahrirlash (ism, telefon, tarif, kelishilgan narx, muddat, sanalar, qarz, status, izoh).
- `DELETE /api/members/:id` — A‘zoni tizimdan o‘chirish (tasdiqlash bilan).
- `POST /api/members/:id/visit` — Tashrif qayd etish (+1 visit).
  - Qoidalarni tekshiradi (haftasiga 3 kun, muzlatilganlik, muddat tugaganlik).
- `POST /api/members/:id/settle-debt` — A‘zoning qarzini to‘lash.
  - Body: `{ amount: number, paymentMethod: string }`.

### C. To‘lovlar Boshqaruvi (`/api/payments`)
- `GET /api/payments` — Barcha to‘lovlar tarixi.
  - Query parametrlar: `search` (mijoz ismi, telefon, kvitansiya raqami), `paymentMethod`, `page`, `limit`.
- `GET /api/payments/:id` — Kvitansiya tafsilotlari (chop etish uchun).
- `POST /api/payments` — Yangi to‘lov qabul qilish (Abonementni uzaytirish / Quick Payment).
  - DTO: `memberId`, `membershipPlanId`, `monthsCount`, `amount`, `paymentMethod`, `paymentDate`, `includeOldDebt`, `discountAmount`, `notes`.
- `PUT /api/payments/:id` — Xato kiritilgan to‘lovni tahrirlash (summa, usul, sana, oylar soni, tarif, qoldiq qarz). A‘zoning muddati va qarzdorligi bilan avtomatik sinxronlashadi.
- `DELETE /api/payments/:id` — Kvitansiyani bekor qilish / o‘chirish (a‘zoning muddati va balansini orqaga qaytarish bilan).

### D. Tarif Rejalari (`/api/plans`)
- `GET /api/plans` — Barcha tariflar (Sayt va Admin uchun).
- `GET /api/plans/:id` — Bitta tarif tafsiloti.
- `POST /api/plans` — Yangi tarif yaratish (`name`, `price`, `description`, `durationDays`, `accessType`, `features`, `popular`).
- `PUT /api/plans/:id` — Tarifni tahrirlash.
- `DELETE /api/plans/:id` — Tarifni o‘chirish.
- `PATCH /api/plans/:id/toggle-status` — Tarifni arxivlash / faollashtirish.

### E. Fitnes Bar Mahsulotlari (`/api/products`)
- `GET /api/products` — Mahsulotlar katalogi. Public so‘rovlarda faqat `isActive: true` qaytadi, admin so‘rovida barchasi.
- `POST /api/products` — Yangi mahsulot qo‘shish.
- `PUT /api/products/:id` — Tahrirlash (narx, qoldiq soni, kategoriya, rasm).
- `DELETE /api/products/:id` — Mahsulotni o‘chirish.
- `PATCH /api/products/:id/toggle-active` — Saytda ko‘rsatish / yashirish.

### F. Xabarlar va Arizalar (`/api/messages`)
- `POST /api/messages` — Sayt tashrifchisi tomonidan ariza qoldirish (Public).
  - Body: `{ fullName, phone, subject, message }`.
- `GET /api/messages` — Barcha tushgan arizalar (Admin).
- `PATCH /api/messages/:id/status` — Xolatni o‘zgartirish (`read`, `replied`).
- `DELETE /api/messages/:id` — Arizani o‘chirish.

### G. Sayt Kontenti (CMS) (`/api/website`)
- `GET /api/website` — Barcha sayt matnlari, telefonlar, manzillar va statistika (Public).
- `PUT /api/website` — Sayt kontentini yangilash (Admin).

### H. Statistika va Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` — Umumiy a‘zolar, faol a‘zolar, bugungi tushum, muddati tugayotganlar soni.
- `GET /api/dashboard/revenue-chart` — Recharts uchun haftalik va oylik daromad grafigi ma’lumotlari.
- `GET /api/dashboard/notifications` — 3 ta kategoriya bo‘yicha bildirishnomalar:
  - `today` (Bugun tugaydiganlar)
  - `tomorrow` (Ertaga tugaydiganlar)
  - `overdue` (Muddati o‘tganlar)

---

## 5. Dastur Fayllar Strukturasi (NestJS Tavsiya Etilgan Tuzilishi)

```
powerzone-backend/
├── prisma/
│   ├── schema.prisma       # Yuqorida keltirilgan to'liq schema
│   └── seed.ts             # Boshlang'ich admin, tariflar va mahsulotlar
├── src/
│   ├── auth/               # Login, JWT, Guards, Strategies
│   ├── members/            # A'zolar moduli (CRUD, tashriflar, qarz)
│   ├── payments/           # To'lovlar moduli (Kvitansiyalar, hisob-kitob)
│   ├── plans/              # Tariflar moduli
│   ├── products/           # Fitnes bar mahsulotlari moduli
│   ├── visits/             # Tashriflar va davomat monitoringi
│   ├── messages/           # Sayt arizalari (Contact inquiries)
│   ├── website/            # Sayt CMS kontenti
│   ├── dashboard/          # Analitika, statistika va bildirishnomalar
│   ├── common/             # Interceptors, Filters, Pipes, Decorators
│   ├── cron/               # Haftalik tashriflarni reset qilish cron taski
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. Yangi AI Agent Uchun Tayyor Master Prompt

Quyidagi matnni nusxalab, boshqa papkada yangi backend loyihasini yaratayotgan AI Agentga yuborishingiz mumkin:

````markdown
You are a Senior Backend Engineer building the official production REST API for "Power Zone" (FitnesFlow) Gym Management System.

Technology Stack:
- NestJS (TypeScript, Strict mode)
- PostgreSQL (Database)
- Prisma ORM
- JWT Authentication (Passport.js, bcrypt)
- Class-validator & Class-transformer
- Swagger OpenAPI documentation at /api/docs
- Node-cron for weekly attendance reset

Instructions:
1. Initialize a modular NestJS project.
2. Setup Prisma ORM with the complete schema provided in BACKEND.md (Users, Members, MembershipPlans, Payments, AttendanceVisits, Products, ContactMessages, WebsiteContent).
3. Implement seed script (prisma/seed.ts) creating:
   - Admin user: email "admin@fitnesflow.uz", username "admin", password "fitnes2026!" (hashed with bcrypt).
   - 3 Core Plans: "Haftasiga 3 kun" (200,000 UZS, weekly_3_days), "Oylik cheklanmagan" (300,000 UZS, monthly_unlimited), "Bir martalik mashg‘ulot" (20,000 UZS, single_visit).
   - Default website CMS content and initial fitness bar products.
4. Implement all business rules strictly:
   - Weekly 3-Day plan allows max 3 visits per membership week. 4th visit must return 400 Bad Request.
   - Frozen members cannot check-in.
   - Single visit members expire immediately after 1 visit.
   - Membership duration is 30 days per month (2 months = 60 days, no accidental doubling).
   - Custom agreed price (discounts) must be respected without generating false debt.
   - Deleting a payment must rollback member expiry date and debt.
5. Create comprehensive Swagger documentation for all endpoints under /api/docs.
6. Enable CORS for frontend origin (http://localhost:3000).
7. Ensure clean compilation with 0 TypeScript errors and provide run commands.
````

---

## 7. O‘rnatish va Ishga Tushirish Bosqichlari

### 1. Muhit O‘zgaruvchilari (`.env`):
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/powerzone_db?schema=public"
JWT_SECRET="powerzone_super_secret_jwt_key_2026_fitness"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### 2. Ma’lumotlar bazasini ishga tushirish:
```bash
# PostgreSQL bazani yaratish va migratsiyalarni yurgizish
npx prisma migrate dev --name init

# Boshlang'ich ma'lumotlarni (Admin, tariflar, mahsulotlar) yuklash
npx prisma db seed
```

### 3. Serverni ishga tushirish:
```bash
# Rivojlanish rejimida ishga tushirish
npm run start:dev
```
Server `http://localhost:4000` da ishga tushadi, Swagger interaktiv API hujjati esa `http://localhost:4000/api/docs` da ochiladi.
