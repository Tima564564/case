# API Endpoints

## Auth

```http
POST /auth/telegram
Content-Type: application/json

{ "initData": "query_id=...&user=...&hash=..." }
```

Response:

```json
{
  "token": "jwt",
  "user": { "id": "user_id", "telegramId": "123" }
}
```

## Cases

```http
GET /cases
Authorization: Bearer jwt
```

```http
POST /cases/:caseId/open
Authorization: Bearer jwt
Content-Type: application/json

{ "clientSeed": "telegram-user-seed-001" }
```

## Inventory

```http
GET /inventory
Authorization: Bearer jwt
```

```http
POST /inventory/:id/sell
Authorization: Bearer jwt
```

```http
POST /inventory/:id/upgrade
Authorization: Bearer jwt
Content-Type: application/json

{ "targetItemId": "item_id", "clientSeed": "upgrade-seed" }
```

## PvP

```http
GET /pvp/battles
Authorization: Bearer jwt
```

```http
POST /pvp/battles
Authorization: Bearer jwt
Content-Type: application/json

{ "mode": "ONE_VS_ONE", "caseIds": ["case_id"] }
```

```http
POST /pvp/battles/:battleId/join
Authorization: Bearer jwt
Content-Type: application/json

{ "seat": 2 }
```

## Rewards

```http
GET /rewards/tasks
Authorization: Bearer jwt
```

```http
POST /rewards/daily/claim
Authorization: Bearer jwt
```

## Referrals

```http
GET /referrals
Authorization: Bearer jwt
```

## Leaderboard

```http
GET /leaderboard
```

## Crypto Payments

```http
POST /payments/deposits
Authorization: Bearer jwt
Content-Type: application/json

{ "chain": "TON", "asset": "USDT", "amount": 25 }
```

```http
POST /payments/withdrawals
Authorization: Bearer jwt
Content-Type: application/json

{ "chain": "TON", "asset": "USDT", "address": "wallet-address", "amount": 25 }
```

## Admin

```http
GET /admin/analytics/revenue
Authorization: Bearer admin_jwt
```

```http
POST /admin/cases
Authorization: Bearer admin_jwt
Content-Type: application/json

{ "slug": "mythic-vault", "title": "Mythic Vault", "price": 95 }
```

## Socket.IO Events

Client listens:

- `case:opened`
- `battle:created`
- `battle:joined`
- `battle:round`
- `battle:finished`

Client emits:

- `battle:watch` with `battleId`
