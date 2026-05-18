# Telegram Gift Cases Economy

## Product Mechanics

- Telegram Gift cases contain virtual gifts, animated gifts, seasonal gifts, limited editions, collectibles, Stars packs, Premium rewards, and TON vouchers.
- Every case has configurable `targetRtp`, `houseEdge`, `profitabilityTarget`, `dynamicDropRates`, revenue, payout, profit, and opening counters.
- Gift inventory supports item ownership, serial numbers, locks, transfer flow, marketplace listings, and fusion attempts.
- Rare rewards should show animated win states, public drop chances, fair-round hashes, and live jackpot feed events.

## Economy Controls

Admin configures drop weights, base weights, dynamic weights, RTP target, house edge, profitability target, active seasonal event, and limited-time expiry. Auto-balance compares actual RTP against target RTP and recommends tightening high-value drops, boosting mid-value drops, or holding.

## Payments

TON Connect stores wallet proofs, deposits, withdrawals, and transaction history. Telegram Stars use Bot Payments with currency `XTR`; invoice payloads map to `StarsPayment` rows and confirmed payments credit the internal wallet ledger.

## Realtime Scale

Socket.IO emits live openings, big wins, battle events, jackpot events, and online counter. Scale path: Redis Socket.IO adapter, BullMQ payment/economy workers, read replicas for feeds and leaderboards, and separate admin API.

## Multilingual UX

The Mini App includes EN/RU/UA client-side language switching. Production should move copy into locale JSON files and store preferred user locale in `User.locale`.

## Compliance Note

Real-money gambling, crypto withdrawals, and prize mechanics require legal review, age gating, jurisdiction filtering, AML/KYC policy, and responsible-gaming controls before production launch.
