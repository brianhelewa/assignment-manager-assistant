
# Assignment Manager Assistant — Starter Repo

A Next.js (App Router) + Prisma + Postgres starter that scaffolds the core of your
**Kanban → Graph → Gantt** assignment manager with Google sign‑in and API routes.

## Quickstart

1. **Clone & install**
   ```bash
   git clone <YOUR_REPO_URL> assignment-manager
   cd assignment-manager
   npm install
   ```

2. **Start Postgres (Docker)**
   ```bash
   docker compose up -d
   ```

3. **Configure env**
   ```bash
   cp .env.example .env
   # fill in GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (optional for now)
   ```

4. **Init DB**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run Dev**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

## What you get

- Next.js 14 + TypeScript + Tailwind (minimal UI)
- Prisma schema with User/Account (NextAuth), Project/Topic/Task/Edge
- API routes:
  - `GET/POST /api/tasks`  |  `GET/PATCH/DELETE /api/tasks/:id`
  - `GET/POST /api/edges`  |  `DELETE /api/edges/:id`
  - `POST /api/assistant/parse` (stub for intent parsing)
  - `GET/POST /api/auth/*` (NextAuth)
- Pages:
  - `/kanban` — drag‑drop columns
  - `/graph` — React Flow graph of tasks + dependencies
  - `/gantt` — very simple timeline placeholder
  - `/calendar` — placeholder + sign‑in to connect Google

## Env

See `.env.example`. The default Docker Postgres works out of the box.

## Scripts

- `npm run dev` – start next dev
- `npm run build && npm start` – production
- `npm run prisma:studio` – open Prisma Studio
- `npm run db:reset` – reset database (drops and re‑seeds)

## Notes

- This is a **starter**: Calendar sync endpoints are stubbed for you to finish
  after enabling the Google provider and persisting tokens.
- For graph layout at scale, consider server‑side DAG layout or client‑side
  `elkjs` integration.
