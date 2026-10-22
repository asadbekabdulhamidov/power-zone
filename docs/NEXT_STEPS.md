# FitnesFlow — Next Steps & Roadmap

This document outlines the immediate next recommended task, remaining backlog items in priority order, dependencies, and acceptance criteria.

---

## 1. Next Recommended Task

### Task: Connect PostgreSQL Database to Backend & Execute Seed
Set a live PostgreSQL connection URL in `power-backend/.env` (from Neon.tech or local PostgreSQL), execute `npx prisma db push` and `npm run prisma:seed`, and restart the NestJS server.

#### Acceptance Criteria:
1. `GET http://localhost:4000/api/plans` returns HTTP 200 with the 3 default plans.
2. `POST http://localhost:4000/api/auth/login` returns HTTP 201 with JWT accessToken for `admin@fitnesflow.uz`.
3. Complete E2E verification of member registration, payments, and check-in against the live database.

---

## 2. Remaining Tasks in Priority Order

| Priority | Task | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| **P1** | **Backend REST API Implementation** | Create Express CRUD endpoints for members, plans, payments, products, and attendance check-in. | Database Schema |
| **P2** | **Authentication & JWT Middleware** | Implement real JWT authentication for `/admin/login` and secure admin API routes. | User table & Auth routes |
| **P3** | **Frontend API Integration** | Replace `src/context/fitnes-context.tsx` localStorage calls with HTTP API client (e.g. TanStack Query or Axios). | Express REST API |
| **P4** | **Authoritative Visit Enforcement** | Implement backend logic calculating weekly visit counts to enforce the 3-day maximum limit server-side. | Visits DB table & API |
| **P5** | **SMS Gateway Integration (Eskiz.uz)** | Integrate Eskiz.uz API with cron job to dispatch automated expiration reminders at 10:00 AM. | Eskiz API credentials |
| **P6** | **Receipt PDF Export** | Add server-side or client-side PDF generation for downloading printable receipts. | Payments API |

---

## 3. Dependencies & Blockers

- **PostgreSQL Database**: Requires local PostgreSQL instance or Docker container.
- **SMS Gateway Credentials**: Eskiz.uz token and sender name required for live SMS testing.
- **Click / Payme Merchant Keys**: Required if real online payment checkout is activated.
