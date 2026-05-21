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
    id: "perfume",
    name: "Perfume",
    price: 3,
    hot: true,
    image: "PR",
    type: "Telegram gifts",
    drops: [
      { id: "perfume-lollipop", name: "Lol Pop", value: 5442.8, rarity: "Mythic", chance: 0.12, tag: "Animated" },
      { id: "perfume-orb", name: "Crystal Orb", value: 269.26, rarity: "Legendary", chance: 1.1, tag: "Gift" },
      { id: "perfume-bag", name: "Gift Bag", value: 95.69, rarity: "Epic", chance: 4.5, tag: "Seasonal" },
      { id: "perfume-ring", name: "Love Ring", value: 38.4, rarity: "Rare", chance: 18, tag: "Collectible" },
      { id: "perfume-bear", name: "Plush Bear", value: 8.7, rarity: "Common", chance: 76.28, tag: "Gift" }
    ]
  },
  {
    id: "plush-pepe",
    name: "Plush Pepe",
    price: 7,
    hot: true,
    image: "PP",
    type: "Animated gifts",
    drops: [
      { id: "pepe-gold", name: "Gold Pepe", value: 1290, rarity: "Mythic", chance: 0.25, tag: "Animated" },
      { id: "pepe-crown", name: "Crown Pepe", value: 420, rarity: "Legendary", chance: 1.4, tag: "Limited" },
      { id: "pepe-plush", name: "Green Plush", value: 86, rarity: "Epic", chance: 6.35, tag: "Gift" },
      { id: "pepe-sticker", name: "Rare Sticker", value: 22, rarity: "Rare", chance: 24, tag: "Collectible" },
      { id: "pepe-card", name: "Gift Card", value: 4.8, rarity: "Common", chance: 68, tag: "Gift" }
    ]
  },
  {
    id: "durov-cap",
    name: "Durov Cap",
    price: 15,
    hot: false,
    image: "DC",
    type: "Rare Telegram items",
    drops: [
      { id: "cap-black", name: "Black Cap", value: 2400, rarity: "Mythic", chance: 0.18, tag: "Limited" },
      { id: "cap-silver", name: "Silver Cap", value: 690, rarity: "Legendary", chance: 1.22, tag: "Collectible" },
      { id: "cap-blue", name: "Blue Cap", value: 160, rarity: "Epic", chance: 7.6, tag: "Gift" },
      { id: "cap-pin", name: "Telegram Pin", value: 34, rarity: "Rare", chance: 28, tag: "Gift" },
      { id: "cap-box", name: "Mini Gift Box", value: 9.5, rarity: "Common", chance: 63, tag: "Gift" }
    ]
  },
  {
    id: "holiday-drop",
    name: "Holiday Drop",
    price: 29,
    hot: false,
    image: "HD",
    type: "Seasonal gifts",
    drops: [
      { id: "holiday-tree", name: "Holiday Tree", value: 3200, rarity: "Mythic", chance: 0.15, tag: "Seasonal" },
      { id: "holiday-star", name: "Frozen Star", value: 870, rarity: "Legendary", chance: 1.2, tag: "Animated" },
      { id: "holiday-snow", name: "Snow Globe", value: 210, rarity: "Epic", chance: 8.65, tag: "Gift" },
      { id: "holiday-cake", name: "Cake Gift", value: 54, rarity: "Rare", chance: 30, tag: "Gift" },
      { id: "holiday-box", name: "Red Gift Box", value: 14, rarity: "Common", chance: 60, tag: "Gift" }
    ]
  }
];

export const liveFeed = [
  { user: "giftboss", item: "Lol Pop", value: 5442.8, rarity: "Mythic" as Rarity },
  { user: "tonmax", item: "Frozen Star", value: 870, rarity: "Legendary" as Rarity },
  { user: "starsqueen", item: "Blue Cap", value: 160, rarity: "Epic" as Rarity }
];

export const inventorySeed: Drop[] = [
  { id: "owned-bear", name: "Plush Bear", value: 8.7, rarity: "Common", chance: 0, tag: "Gift" },
  { id: "owned-ring", name: "Love Ring", value: 38.4, rarity: "Rare", chance: 0, tag: "Collectible" },
  { id: "owned-snow", name: "Snow Globe", value: 210, rarity: "Epic", chance: 0, tag: "Gift" }
];

export const battles = [
  { id: "b1", title: "Perfume Duel", pot: 48, players: "1/2", status: "Waiting" },
  { id: "b2", title: "Gift Clash", pot: 116, players: "2/2", status: "Live" },
  { id: "b3", title: "Durov High Roll", pot: 316, players: "3/4", status: "Watching" }
];

export const tasks = [
  { id: "daily", title: "Daily bonus", reward: 0.25 },
  { id: "open3", title: "Open 3 gift cases", reward: 2.5 },
  { id: "refer", title: "Invite a Telegram friend", reward: 5 }
];

export const leaders = [
  { user: "giftboss", volume: 12840, best: "Lol Pop" },
  { user: "tonmax", volume: 9840, best: "Black Cap" },
  { user: "starsqueen", volume: 6420, best: "Frozen Star" }
];

export const marketplaceListings = [
  { id: "m1", seller: "giftboss", item: "Silver Cap", rarity: "Legendary" as Rarity, price: 238, currency: "TON", tag: "Limited" },
  { id: "m2", seller: "starsqueen", item: "Gold Pepe", rarity: "Mythic" as Rarity, price: 410, currency: "TON", tag: "Animated" },
  { id: "m3", seller: "tonmax", item: "Snow Globe", rarity: "Epic" as Rarity, price: 72, currency: "TON", tag: "Seasonal" }
];

export const starsPacks = [
  { id: "stars_100", title: "100 Stars", stars: 100, price: 4.5, bonus: 0 },
  { id: "stars_500", title: "500 Stars", stars: 500, price: 24, bonus: 2 },
  { id: "stars_1500", title: "1500 Stars", stars: 1500, price: 78, bonus: 10 }
];

export const vipTiers = [
  { tier: "Bronze", edgeBack: 1, cashback: 0.5, minVolume: 0 },
  { tier: "Silver", edgeBack: 2, cashback: 1, minVolume: 250 },
  { tier: "Gold", edgeBack: 4, cashback: 2, minVolume: 1000 },
  { tier: "Platinum", edgeBack: 7, cashback: 3.5, minVolume: 5000 },
  { tier: "Diamond", edgeBack: 12, cashback: 5, minVolume: 20000 }
];

export const economyStats = {
  targetRtp: 92,
  houseEdge: 8,
  jackpotPool: 18420,
  online: 738,
  openingRate: 124,
  payoutRatio: 89.4
};
