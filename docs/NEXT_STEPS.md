# FitnesFlow — Next Steps & Roadmap

This document outlines the current production status, immediate next recommended task, remaining backlog items in priority order, dependencies, and acceptance criteria.

---

## 1. Current Status: Production Database Integration Complete
- Live PostgreSQL on Neon.tech connected and operational.
- NestJS backend deployed on Render (`https://power-backend-tqgo.onrender.com/api`).
- Frontend Next.js 15 client (`fitnes-pro`) 100% integrated with live database endpoints. All mock data arrays and demo reset buttons have been purged.

---

## 2. Next Recommended Task

### Task: SMS Gateway Integration (Eskiz.uz)
Integrate Eskiz.uz SMS API into `power-backend` to automatically dispatch Uzbek SMS notifications for:
1. New member welcome and receipt confirmation.
2. Membership expiring alerts (1 day before expiration).
3. Overdue payment reminders.

#### Acceptance Criteria:
1. Valid Eskiz.uz token authorization with automated token refresh.
2. Daily scheduled cron at 10:00 AM detecting expiring/overdue members and sending SMS.
3. Admin SMS test button in `/admin/notifications`.

---

## 3. Remaining Tasks in Priority Order

| Priority | Task | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| **P1** | **SMS Gateway Integration (Eskiz.uz)** | Integrate Eskiz.uz API with cron job to dispatch automated expiration reminders at 10:00 AM. | Eskiz API credentials |
| **P2** | **Receipt PDF Export** | Add server-side or client-side PDF generation for downloading printable receipts. | Payments API |
| **P3** | **Online Payment Gateway (Click / Payme)** | Merchant API integration for direct QR payment or checkout on landing page. | Merchant credentials |

---

## 3. Dependencies & Blockers

- **PostgreSQL Database**: Requires local PostgreSQL instance or Docker container.
- **SMS Gateway Credentials**: Eskiz.uz token and sender name required for live SMS testing.
- **Click / Payme Merchant Keys**: Required if real online payment checkout is activated.
