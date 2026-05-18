# Backend Architecture

## MVP Runtime

- Express REST API for domain endpoints.
- Socket.IO gateway for live openings and PvP spectators.
- PostgreSQL with Prisma ORM.
- JWT sessions after Telegram WebApp init data validation.
- Ledger-based wallet accounting.

## Domain Modules

- Auth: Telegram initData validation, JWT, user upsert.
- Wallet: balance, locked balance, immutable ledger entries.
- Cases: active cases, weighted drops, open transactions.
- Provably Fair: seed hash before play, client seed, nonce, reveal flow.
- Inventory: owned items, sell, upgrade, withdraw state.
- PvP: battle lobby, seats, live spectator rooms, settlement.
- Rewards: daily bonus, quests, referral payouts.
- Payments: crypto deposits/withdrawals, webhook reconciliation.
- Admin: case management, chance tuning, users, analytics, audit logs.
- Anti-fraud: risk score, rate limits, suspicious pattern flags.

## Scale Path

1. Add Redis for Socket.IO adapter, rate limits, idempotency locks, and battle rooms.
2. Move payment webhooks and battle settlement to workers with BullMQ.
3. Split realtime gateway from REST API.
4. Add read replicas for leaderboards and analytics.
5. Add object storage signed URLs for media uploads.
6. Add fraud-scoring service and manual review queue.

## Security Baseline

- Validate every Telegram session from signed initData.
- Store no private crypto keys in the app API process.
- Use ledger transactions for all balance changes.
- Keep admin actions behind role checks and audit logs.
- Add idempotency keys to payments and case openings.
- Rate-limit auth, opening, upgrade, withdrawal, and admin mutation endpoints.
