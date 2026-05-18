# Database Structure

Core model groups:

- Users: Telegram identity, role, locale, referral code, risk score.
- Wallets: balance and locked balance.
- Ledger: immutable financial events with metadata.
- Cases and Items: case pricing, item value, rarity, weighted drops.
- Inventory: won items and item lifecycle state.
- Fair Rounds: server seed hash, client seed, nonce, reveal metadata.
- Upgrades: source item, target item, chance, result.
- Battles: battle status, players, case rounds, winner.
- Rewards: daily claims, tasks, progress.
- Payments: crypto deposit/withdrawal lifecycle.
- Admin Audit: every privileged mutation.

Important constraints:

- `User.telegramId` is unique.
- `Wallet.userId` is unique.
- `Case.slug` and `Item.sku` are unique.
- `CaseDrop.weight` controls weighted odds.
- `DailyReward` is unique by `userId + dayKey`.
- `BattlePlayer` is unique by `battleId + userId`.

Financial rule:

Never mutate a wallet without a matching `WalletLedger` row in the same transaction.
