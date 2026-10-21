# FitnesFlow — Agent Instructions & Operating Manual

## 1. Project Purpose & Scope

**FitnesFlow** is a modern fitness club management platform and public website designed specifically for local gyms in Uzbekistan.
The platform serves two primary user personas:
1. **Gym Visitors & Potential Members (Public)**: Discover gym facilities, browse photo galleries, view membership pricing plans, explore products at the fitness bar, check location/hours, and submit join requests.
2. **Gym Owners & Administrators (Private)**: Manage members, track attendance rules, maintain membership plans, record and review payments with printable receipts, track expiring/overdue memberships, and manage fitness bar products.

---

## 2. Verified Technology Stack

Verified directly from `package.json` and codebase configuration:

- **Framework**: Next.js 15.5.28 (App Router, Turbopack)
- **UI Library & Runtime**: React 19.1.0, React DOM 19.1.0
- **Language**: TypeScript 5+ (Strict mode, explicit domain types in `src/types/index.ts`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, custom theme layers in `src/app/globals.css`)
- **Component Architecture**: Modular shadcn/ui-inspired primitives in `src/components/ui/` (`Button`, `Modal`, `Badge`, `Input`, `Select`, `Table`, `Tabs`, `Card`)
- **Icons**: Lucide React 1.61.0
- **Form Management & Validation**: React Hook Form 7.90.0, Zod 4.6.7, `@hookform/resolvers` 6.0.0
- **Data Visualization**: Recharts 3.10.1 (Responsive charts for revenue analytics)
- **State & Storage**: Client-side React Context (`FitnesFlowProvider`) with browser `localStorage` persistence and typed mock fallback data in `src/lib/mock-data.ts`.
- **Planned Backend** (Not yet implemented): Node.js, Express, PostgreSQL.

---

## 3. Important Business Rules

1. **Flexible Weekly 3-Visit Plan ("Haftasiga 3 kun" — 200,000 UZS)**:
   - Members may attend on any 3 days that fit their schedule (no mandatory fixed weekdays).
   - The system must enforce a maximum limit of 3 recorded visits per membership week. Additional visits beyond 3 must be blocked or flagged.
2. **Monthly Unlimited Plan ("Oylik cheklanmagan" — 300,000 UZS)**:
   - Unlimited visits during the 30-day active membership cycle.
3. **Single Visit Plan ("Bir martalik mashg‘ulot" — 20,000 UZS)**:
   - Exactly 1 recorded gym visit.
4. **Historical Price Preservation**:
   - When administrators edit or update plan prices, existing members' agreed prices (`membershipPriceAgreed`) must remain untouched. Price modifications apply only to new memberships.
5. **Multiple Payments Over Time**:
   - Payments are stored as independent entities linked to members and plans. A single member can accumulate multiple payment records.
6. **Expiring & Overdue Notifications**:
   - The system categorizes membership expiration into: Due Today (0 days left), Due Tomorrow (1 day left), and Overdue (< 0 days).
7. **Active Products Showcase**:
   - The public landing page must exclusively render products marked as active (`isActive: true`).
8. **Currency & Localization**:
   - All monetary values must be formatted in Uzbek Sum (`UZS` or `so'm`, e.g., `200,000 UZS`). All customer-facing and admin UI text is in Uzbek Latin.

---

## 4. Coding Conventions & Architectural Guidelines

- **Next.js App Router**:
  - Keep client-side interactive components annotated with `'use client';`.
  - Use server components for static layouts where state is unnecessary.
- **Strict TypeScript**:
  - Do not use `any`. Always import or extend models from `@/types`.
  - Validate form inputs using Zod schemas matching domain requirements.
- **Design Consistency**:
  - Dark charcoal/slate surfaces (`#090D16`, `#111827`, `#0D131F`).
  - High-contrast energetic lime-green accents (`#84CC16`, `#A3E635`).
  - Subtle borders (`border-zinc-800`), glassmorphic panels, and accessible focus outlines.
- **Component Modularity**:
  - `src/components/ui/` for generic UI primitives.
  - `src/components/landing/` for public website sections.
  - `src/components/admin/` for admin dashboard components.
  - `src/context/` for centralized application state and prototype CRUD handlers.

---

## 5. Mandatory Instructions for AI Agents

1. **Read Documentation Before Starting**:
   - Always read `AGENTS.md`, `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md`, and `docs/NEXT_STEPS.md` at the start of any session.
2. **Never Claim Without Verification**:
   - Do not claim that features work, tests pass, or builds succeed without executing the relevant commands (`npm run build`, `npm run lint`, etc.).
   - If an error or restriction occurs, document it honestly.
3. **Do Not Overwrite Existing Working Code Unnecessarily**:
   - Inspect existing implementations first. Extend or refactor targeted areas rather than blindly rewriting.
4. **Update Documentation After Meaningful Work**:
   - After completing or modifying features, immediately update `docs/PROJECT_STATUS.md` and `docs/NEXT_STEPS.md`.
   - If architectural or technical choices change, record them in `docs/DECISIONS.md`.
