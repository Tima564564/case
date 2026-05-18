# UI/UX Concept

## Product Feel

The app should feel like a premium crypto casino built specifically for Telegram: dense, fast, polished, and safe enough that users understand balances, odds, and outcomes without visual noise.

## Visual System

- Theme: deep black base, translucent glass panels, cyan/violet/gold rarity accents.
- Surfaces: 8px radius, high blur, thin white borders, subtle inner highlights.
- Motion: roulette easing, card lift on press, live-feed slide-ins, PvP state transitions.
- Typography: compact mobile dashboard hierarchy, large numeric balances, tight section headings.
- Rarity colors:
  - Common: steel gray
  - Rare: cyan
  - Epic: violet
  - Legendary: gold
  - Mythic: magenta

## Core Screens

- Home: balance, hero promo, popular cases, live feed, tasks shortcut.
- Case details: price, expected drops, chance table, provably fair hash, open CTA.
- Opening: roulette strip, center marker, haptic trigger, win modal.
- Inventory: item grid, sell, upgrade, withdraw if eligible.
- Upgrade: source item, target item, chance, risk preview, fair round hash.
- PvP battles: lobby, create battle, join, watch live, winner settlement.
- Leaderboard: wagered, profit, biggest drop, battle wins.
- Admin: cases, drops, chances, users, payments, revenue analytics, audit logs.

## Mobile-First Telegram Notes

- Keep primary actions thumb-zone friendly.
- Avoid heavy page depth; use bottom nav and modals.
- Use Telegram haptics for open, win, upgrade fail/success.
- Respect Telegram viewport and safe-area padding.
- Use in-app toasts for push-like notifications when the Mini App is open.
