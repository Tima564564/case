export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export type Drop = {
  id: string;
  name: string;
  value: number;
  rarity: Rarity;
  chance: number;
  tag: string;
};

export type GiftCase = {
  id: string;
  name: string;
  price: number;
  hot: boolean;
  image: string;
  type: string;
  drops: Drop[];
};

export const cases: GiftCase[] = [
  {
    id: "tg-starter",
    name: "TG Starter Gifts",
    price: 4.9,
    hot: true,
    image: "TG",
    type: "Telegram gifts",
    drops: [
      { id: "star-pack-50", name: "50 Stars Pack", value: 2, rarity: "Common", chance: 46, tag: "Stars" },
      { id: "premium-1m", name: "Premium 1 Month", value: 7, rarity: "Rare", chance: 28, tag: "Premium" },
      { id: "gift-basic", name: "Limited Gift Box", value: 18, rarity: "Epic", chance: 14, tag: "Gift" },
      { id: "ton-mini", name: "TON Voucher", value: 45, rarity: "Legendary", chance: 9, tag: "TON" },
      { id: "gift-myth", name: "Rare Collectible", value: 120, rarity: "Mythic", chance: 3, tag: "Collectible" }
    ]
  },
  {
    id: "stars-vault",
    name: "Stars Vault",
    price: 12,
    hot: true,
    image: "ST",
    type: "Stars and premium",
    drops: [
      { id: "star-pack-100", name: "100 Stars", value: 4, rarity: "Common", chance: 42, tag: "Stars" },
      { id: "star-pack-250", name: "250 Stars", value: 10, rarity: "Rare", chance: 30, tag: "Stars" },
      { id: "premium-3m", name: "Premium 3 Months", value: 21, rarity: "Epic", chance: 17, tag: "Premium" },
      { id: "ton-card", name: "TON Gift Card", value: 75, rarity: "Legendary", chance: 8, tag: "TON" },
      { id: "stars-jackpot", name: "2500 Stars Jackpot", value: 150, rarity: "Mythic", chance: 3, tag: "Stars" }
    ]
  },
  {
    id: "collectible-gifts",
    name: "Collectible Gifts",
    price: 29,
    hot: false,
    image: "CG",
    type: "Rare Telegram gifts",
    drops: [
      { id: "gift-silver", name: "Silver Gift", value: 16, rarity: "Common", chance: 48, tag: "Gift" },
      { id: "gift-neon", name: "Neon Gift", value: 38, rarity: "Rare", chance: 27, tag: "Gift" },
      { id: "gift-crystal", name: "Crystal Gift", value: 95, rarity: "Epic", chance: 15, tag: "Gift" },
      { id: "gift-royal", name: "Royal Telegram Gift", value: 290, rarity: "Legendary", chance: 7, tag: "Collectible" },
      { id: "gift-founder", name: "Founder Collectible", value: 820, rarity: "Mythic", chance: 3, tag: "Collectible" }
    ]
  },
  {
    id: "ton-whale",
    name: "TON Whale Case",
    price: 79,
    hot: false,
    image: "TN",
    type: "High roller",
    drops: [
      { id: "ton-25", name: "25 TON Ticket", value: 55, rarity: "Rare", chance: 50, tag: "TON" },
      { id: "ton-60", name: "60 TON Ticket", value: 132, rarity: "Epic", chance: 28, tag: "TON" },
      { id: "premium-year", name: "Premium Year", value: 89, rarity: "Epic", chance: 12, tag: "Premium" },
      { id: "ton-200", name: "200 TON Ticket", value: 440, rarity: "Legendary", chance: 8, tag: "TON" },
      { id: "gift-whale", name: "Whale Collectible", value: 1500, rarity: "Mythic", chance: 2, tag: "Collectible" }
    ]
  }
];

export const liveFeed = [
  { user: "vlad", item: "Founder Collectible", value: 820, rarity: "Mythic" as Rarity },
  { user: "anna", item: "TON Gift Card", value: 75, rarity: "Legendary" as Rarity },
  { user: "max", item: "Premium 3 Months", value: 21, rarity: "Epic" as Rarity }
];

export const inventorySeed: Drop[] = [
  { id: "premium-1m-owned", name: "Premium 1 Month", value: 7, rarity: "Rare", chance: 0, tag: "Premium" },
  { id: "gift-neon-owned", name: "Neon Gift", value: 38, rarity: "Rare", chance: 0, tag: "Gift" },
  { id: "star-pack-250-owned", name: "250 Stars", value: 10, rarity: "Rare", chance: 0, tag: "Stars" }
];

export const battles = [
  { id: "b1", title: "Stars Duel", pot: 48, players: "1/2", status: "Waiting" },
  { id: "b2", title: "Gift Clash", pot: 116, players: "2/2", status: "Live" },
  { id: "b3", title: "TON High Roll", pot: 316, players: "3/4", status: "Watching" }
];

export const tasks = [
  { id: "daily", title: "Daily bonus", reward: 0.25 },
  { id: "open3", title: "Open 3 gift cases", reward: 2.5 },
  { id: "refer", title: "Invite a Telegram friend", reward: 5 }
];

export const leaders = [
  { user: "giftboss", volume: 12840, best: "Whale Collectible" },
  { user: "tonmax", volume: 9840, best: "Founder Collectible" },
  { user: "starsqueen", volume: 6420, best: "2500 Stars Jackpot" }
];
