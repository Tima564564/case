# API Endpoints

## Auth

```http
POST /auth/telegram
{ "initData": "query_id=...&user=...&hash=..." }
```

## Cases

```http
GET /cases
POST /cases/:caseId/open
{ "clientSeed": "telegram-user-seed-001" }
```

## Gift Inventory And Fusion

```http
GET /gifts/inventory
Authorization: Bearer jwt
```

```http
POST /gifts/transfer
Authorization: Bearer jwt
{ "inventoryItemId": "inv_id", "receiverTelegramId": "123456789", "message": "gg" }
```

```http
POST /gifts/fusion
Authorization: Bearer jwt
{ "inventoryItemIds": ["a", "b"], "targetItemId": "item_id", "clientSeed": "fusion-seed" }
```

## Marketplace

```http
GET /marketplace/listings
POST /marketplace/listings
{ "inventoryItemId": "inv_id", "price": 25, "currency": "TON" }
POST /marketplace/listings/:id/buy
```

## TON Connect

```http
POST /payments/ton/wallets
{ "address": "EQ...", "network": "mainnet", "proof": { "timestamp": 123 } }
```

```http
POST /payments/ton/deposits
{ "walletAddress": "EQ...", "amountTon": 5, "txHash": "transaction-hash" }
```

```http
POST /payments/ton/withdrawals
{ "walletAddress": "EQ...", "amountTon": 2 }
```

## Telegram Stars

```http
GET /payments/stars/packs
POST /payments/stars/invoices
{ "packId": "stars_500", "amountStars": 500, "balanceAmount": 24 }
POST /payments/stars/confirm
{ "invoicePayload": "stars:...", "telegramPaymentChargeId": "..." }
```

## Economy Admin

```http
GET /economy/admin/dashboard
POST /economy/admin/cases/:id/rtp
{ "targetRtp": 0.92, "dynamicDropRates": true }
POST /economy/admin/auto-balance
GET /admin/economy/risk
```

## Socket.IO Events

Client listens:

- `case:opened`
- `battle:created`
- `battle:joined`
- `presence:online`

Client emits:

- `battle:watch` with `battleId`
