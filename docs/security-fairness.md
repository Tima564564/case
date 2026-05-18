# Provably Fair And Anti-Fraud

## Provably Fair Design

For each game round:

1. Server generates secret server seed.
2. Server publishes `sha256(serverSeed)` before the round.
3. Client provides `clientSeed`.
4. Roll is `hmac_sha256(serverSeed, clientSeed:nonce)`.
5. Weighted result is selected from the roll.
6. Server reveals seed after the round or seed rotation.
7. User can verify hash and result.

MVP note: the scaffold includes the seed-hash and roll primitives; production should store unrevealed server seeds securely and reveal them on a clear schedule.

## Anti-Fraud Protection

- Per-user and per-IP rate limits.
- Device/session fingerprint hints from Telegram context.
- Withdrawal cooldowns for new accounts.
- Risk score for multi-account patterns, referral loops, payment mismatches.
- Idempotency keys for payments and game actions.
- Locked balances for PvP and withdrawal flows.
- Manual review queue for high-risk withdrawals.
- Admin audit log for all chance, user, wallet, and payment mutations.

## Compliance Note

Crypto gambling and case-opening products can trigger gambling, consumer-protection, AML/KYC, sanctions, tax, and advertising rules. Production launch should include jurisdiction checks, age gates where required, KYC/AML for withdrawals, and legal review before accepting real money.
