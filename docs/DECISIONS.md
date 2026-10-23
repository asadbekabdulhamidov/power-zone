# FitnesFlow — Architecture & Design Decisions (ADR)

This document captures confirmed architectural decisions, technical choices, business rules, and pending proposals.

---

## 1. Confirmed Technology Choices

### DEC-001: Next.js 15 App Router & Turbopack
- **Status**: Confirmed & Implemented
- **Reason**: Next.js 15 App Router provides modern SSR, optimal routing conventions, built-in layout nesting, and fast Turbopack compilation.

### DEC-002: Tailwind CSS v4 for UI Styling
- **Status**: Confirmed & Implemented
- **Reason**: Tailwind v4 brings simplified configuration via `@import "tailwindcss";`, native theme directives, and zero-runtime CSS footprint, allowing a high-contrast dark athletic aesthetic without bloat.

### DEC-003: React Hook Form + Zod for Forms & Validation
- **Status**: Confirmed & Implemented
- **Reason**: Standardized schema-driven validation with strict TypeScript inference. Ensures reliable input handling for membership creation, member registration, and payments.

### DEC-004: Recharts for Dashboard Analytics
- **Status**: Confirmed & Implemented
- **Reason**: Declarative React charting library that easily renders responsive area/bar charts with custom tooltips formatted in UZS currency.

### DEC-005: Centralized React Context (`FitnesFlowProvider`)
- **Status**: Confirmed & Implemented
- **Reason**: Provides a clean service abstraction between UI pages and data storage. In this prototype phase, it manages state and persists to `localStorage`. When the backend API is ready, the context methods can be swapped with API fetch/RTK Query calls without rewriting page components.

---

## 2. Confirmed Business Rules

### DEC-006: Flexible Weekly 3-Visit Schedule
- **Status**: Confirmed
- **Rule**: For the 200,000 UZS "Haftasiga 3 kun" plan, members are NOT restricted to fixed days (e.g. Mon/Wed/Fri). They can attend any 3 days within their membership week. However, the system strictly enforces a maximum of 3 recorded visits per membership week.

### DEC-007: Historical Price Preservation
- **Status**: Confirmed
- **Rule**: A member's agreed plan price (`membershipPriceAgreed`) is captured at registration time and remains fixed even if the administrator later increases or decreases the plan's public price. Plan price changes only impact new memberships or renewals.

### DEC-008: Active-Only Products on Public Website
- **Status**: Confirmed
- **Rule**: Products catalog allows administrators to mark items as active or inactive (`isActive: boolean`). The public landing page only displays active products.

### DEC-009: Tri-State Expiration Notifications
- **Status**: Confirmed
- **Rule**: Notifications are categorized into three distinct tabs: Due Today (0 days left), Due Tomorrow (1 day left), and Overdue (< 0 days).

### DEC-010: Official Brand Name & Geographic Location
- **Status**: Confirmed & Implemented
- **Decision**: The fitness club is officially branded as **Power Zone** (styled in UI as `POWER ZONE`). The physical location is confirmed as **Farg‘ona viloyati, Quva tumani, Akbarobod markazi**. All customer-facing banners, navigation logos, address cards, official receipt headers, and metadata are aligned to this identity.

### DEC-011: Multi-Month Expiration Anchoring & Payment Rectification
- **Status**: Confirmed & Implemented
- **Rule**: When registering a new member with a multi-month subscription (e.g., 2 months = 60 days), the calculated expiration date is explicitly passed as `customExpiryDate` to prevent sequential double-extension in `addPayment`.
- **Payment CRUD**: To prevent financial discrepancy or accidental input lock, payments can be modified (`updatePayment`) or deleted (`deletePayment`) by administrators with synchronized updates to remaining debt and membership duration.

### DEC-012: Centralized API Client & Dynamic Base URL Switching
- **Status**: Confirmed & Implemented
- **Decision**: All HTTP communication is centralized in `src/lib/api-client.ts` using `process.env.NEXT_PUBLIC_API_URL` (defaulting to `http://localhost:4000/api`). Deploying to cloud hosting (Render/VPS) requires zero code changes, only modifying `NEXT_PUBLIC_API_URL`.

### DEC-013: 50MB Backend Payload Limit & Client-Side Image Resizing
- **Status**: Confirmed & Implemented
- **Decision**: Express default body-parser limits (100KB) cause HTTP 413 errors when webcam photos or file attachments are submitted. Backend is configured with `json({ limit: '50mb' })` and frontend is equipped with `compressImageFile` (800px max, JPEG 0.82) to guarantee rapid uploads without network congestion.

### DEC-014: Unique Member Phone Number Enforcement
- **Status**: Confirmed & Implemented
- **Rule**: A single phone number can only belong to one member. Both backend (`MembersService.create` and `MembersService.update`) and frontend (`handleAddSubmit`, `handleEditSubmit`, Add/Edit Modals) enforce strict uniqueness based on normalized digits (last 9 digits). Duplicate entries are actively blocked in UI with real-time inline alerts (`⚠️ Ushbu raqam a’zo "Falonchi"ga tegishli!`) and disabled submit actions, while backend enforces HTTP 409 Conflict.

---

## 3. Proposals Pending Approval

### PROP-001: Backend Architecture (Express vs Next.js Server Actions)
- **Proposal**: Build an independent Node.js / Express REST API with PostgreSQL and Prisma ORM, versus utilizing Next.js Server Actions with PostgreSQL directly.
- **Current Consensus**: Express + PostgreSQL is requested in the project brief. Pending formal setup.

### PROP-002: SMS Provider Gateway
- **Proposal**: Use Eskiz.uz SMS API or PlayMobile for automated Uzbek SMS delivery when memberships are 2 days or 1 day from expiring.
- **Current Consensus**: UI currently supports copying phone numbers and direct Telegram links. Gateway integration to be finalized with backend credentials.

### PROP-003: Online Payment Gateways (Click & Payme)
- **Proposal**: Integrate official Payme Merchant API and Click Shop API for automated client renewals online.
- **Current Consensus**: Cash, Card (terminal), Click, and Payme are recorded manually by the receptionist/admin in the current phase.
