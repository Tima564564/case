# Telegram Mini App Integration

## Client Flow

1. Load Telegram script in production shell.
2. Read `window.Telegram.WebApp.initData`.
3. Call `WebApp.ready()` and `WebApp.expand()`.
4. POST initData to `/auth/telegram`.
5. Store JWT in memory or secure app state.
6. Use Telegram haptics for major actions.
7. Use Telegram BackButton for modal/detail screens.
8. Use Telegram MainButton only for high-confidence single actions like confirm upgrade.

## Backend Validation

The API validates Telegram WebApp init data using:

- sorted key-value data check string
- HMAC with `WebAppData`
- bot token derived secret
- timing-safe hash comparison

Only after validation does it create or update the local user and issue JWT.

## Push Notifications

Telegram push is bot-driven:

- User opens Mini App and authorizes bot context.
- Backend stores Telegram ID.
- Bot sends notification messages for daily bonus, battle invite, withdrawal state, referral reward.
- In-app realtime notifications use Socket.IO when the Mini App is open.

## BotFather Setup

- Create bot.
- Configure Mini App URL.
- Set domain.
- Add menu button.
- Add commands for `start`, `bonus`, `support`.
