# Telegram Mini App Case Platform

Premium Web3/case-opening Telegram Mini App scaffold: Next.js + TailwindCSS + Framer Motion frontend, Express + Socket.IO backend, PostgreSQL + Prisma schema, Telegram auth, provably fair primitives, PvP battles, inventory, admin panel boundaries, and crypto-payment integration points.

## 1. Project Structure

```txt
apps/
  web/                  Next.js Telegram Mini App client
    src/app/            App Router pages and global styles
    src/components/     Premium UI components
    src/lib/            Telegram, API, mock data helpers
  api/                  Node.js Express API + Socket.IO
    src/auth/           Telegram initData validation and JWT
    src/routes/         REST endpoints
    src/services/       Provably fair, case opening, battle logic
packages/
  db/                   Prisma schema and seed entrypoint
docs/                   Product, API, DB, Telegram, roadmap docs
docker-compose.yml      PostgreSQL and API service
```

## 2. UI/UX Concept

The product is mobile-first for Telegram WebApp: dark glass surfaces, neon cyan/violet/gold rarity accents, haptic-feeling motion, roulette case openings, sticky balance bar, tab navigation, and compact dense screens for repeat play.

See [docs/ui-ux-concept.md](docs/ui-ux-concept.md).

## 3. Backend Architecture

The backend is split into auth, economy, cases, inventory, PvP, referrals, tasks, admin, payments, and realtime gateways. Express is used for MVP speed; the route boundaries map cleanly to NestJS modules later.

See [docs/backend-architecture.md](docs/backend-architecture.md).

## 4. Database Structure

Prisma models cover users, wallet ledger, cases, items, drops, inventory, upgrades, PvP battles, daily rewards, tasks, referrals, crypto payments, admin audit logs, and provably fair seeds.

See [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma) and [docs/database-schema.md](docs/database-schema.md).

## 5. API Examples

REST endpoints are documented for auth, cases, inventory, upgrades, PvP, leaderboard, referrals, rewards, payments, admin, and Socket.IO events.

See [docs/api-examples.md](docs/api-examples.md).

## 6. Telegram Mini App Integration

Frontend reads Telegram WebApp `initData`, sends it to `/auth/telegram`, stores JWT, expands the app, configures theme, haptics, back button, and in-app notifications.

See [docs/telegram-mini-app.md](docs/telegram-mini-app.md).

## 7. Roadmap

MVP launches case opening, inventory, balance ledger, Telegram auth, live feed, daily rewards, and admin case management. Later phases add PvP battles, crypto withdrawals, anti-fraud scoring, multi-language content operations, and analytics.

See [docs/roadmap.md](docs/roadmap.md).

## 8. MVP And Scalable Architecture

MVP uses a single API service and Postgres. Scale path: split realtime gateway, payment workers, fraud engine, admin API, queue-based battle settlement, Redis cache/rate limits, and read replicas for leaderboards.

## Local Development

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Open `http://localhost:3000` for the Mini App shell and `http://localhost:4000/health` for the API.

## Render Deployment

This repo includes `render.yaml` for Render Blueprints. Create a new Blueprint from the Git repository, fill the secret values Render asks for, then set:

- `WEB_ORIGIN` on `case-platform-api` to the deployed web URL.
- `NEXT_PUBLIC_API_URL` on `case-platform-web` to the deployed API URL.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME` from BotFather.
