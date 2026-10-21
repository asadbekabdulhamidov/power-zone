# FitnesFlow — Next Steps & Roadmap

This document outlines the immediate next recommended task, remaining backlog items in priority order, dependencies, and acceptance criteria.

---

## 1. Next Recommended Task

### Task: Backend Architecture & PostgreSQL Database Schema Design
Design and initialize the Node.js / Express backend service and PostgreSQL schema for FitnesFlow, matching the domain models established in `src/types/index.ts`.

#### Acceptance Criteria:
1. Define PostgreSQL schema DDL (or Prisma schema) for:
   - `users` (admin/staff accounts with hashed passwords)
   - `members` (full profile, phone, status, agreed price, visit counters)
   - `membership_plans` (name, duration, price, access type, features, status)
   - `payments` (member_id, plan_id, amount, method, status, receipt_number, timestamp)
   - `visits` (member_id, visit_date, week_number, recorded_by)
   - `products` (name, category, price, stock, is_active, image_url)
2. Express server initializes with PostgreSQL connection pooling.
3. Health check endpoint (`GET /api/health`) returns HTTP 200.
4. Provide Docker Compose configuration (`docker-compose.yml`) for local PostgreSQL development.

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
