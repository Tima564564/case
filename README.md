# Telegram Mini App Case Platform

Premium Telegram Mini App for Telegram Gift Cases: Next.js + TailwindCSS + Framer Motion frontend, Express + Socket.IO backend, PostgreSQL + Prisma, Telegram auth, gift inventory, marketplace, RTP controls, TON and Telegram Stars payment contracts, VIP rewards, and realtime feeds.

## Project Structure

```txt
apps/web                 Next.js Telegram Mini App client
apps/api                 Express API + Socket.IO
packages/db              Prisma schema and seed entrypoint
docs                     Architecture, API, Telegram, roadmap docs
render.yaml              Render Blueprint
```

## Current Feature Set

- Telegram Gift Cases with virtual gifts, animated/seasonal/limited drops, Stars, Premium and TON voucher rewards.
- Mobile-first EN/RU/UA UI with language switcher, wallet, marketplace, VIP, jackpot, live feed and big-win states.
- Gift inventory, transfer, marketplace listing/buying and fusion API contracts.
- Economy controls: target RTP, house edge, profitability, dynamic drop weights, snapshots, risk events and admin dashboards.
- Payments: TON Connect wallet/deposit/withdrawal contracts, Telegram Stars invoices with `XTR`, internal wallet ledger.
- Realtime: live openings, PvP rooms and online counter primitives.

See [docs/gift-economy-architecture.md](docs/gift-economy-architecture.md).

## Render Deployment

Create a Blueprint from this repository. Set:

- `WEB_ORIGIN` on `case-platform-api` to the deployed web URL.
- `NEXT_PUBLIC_API_URL` on `case-platform-web` to the deployed API URL.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME` from BotFather.

After changes, redeploy with `Clear build cache & deploy` if dependencies changed.

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

## Compliance

Real-money gambling, crypto withdrawals, Telegram digital goods and prize mechanics require legal review, age gating, jurisdiction filtering, AML/KYC policy and responsible-gaming controls before production launch.
