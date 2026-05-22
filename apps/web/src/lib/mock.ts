export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export type Drop = {
  id: string;
  name: string;
  value: number;
  rarity: Rarity;
  chance: number;
  tag: string;
  imageUrl: string;
};

export type GiftCase = {
  id: string;
  name: string;
  price: number;
  hot: boolean;
  image: string;
  imageUrl: string;
  type: string;
  drops: Drop[];
};

const emoji = (code: string) => `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`;

const giftImages = {
  perfume: emoji("1f9f4"),
  coffin: emoji("26b0-fe0f"),
  pepe: emoji("1f438"),
  redbox: emoji("1f381"),
  lollipop: emoji("1f36d"),
  orb: emoji("1f52e"),
  cap: emoji("1f9e2"),
  snowglobe: emoji("2603-fe0f"),
  star: emoji("2b50"),
  tree: emoji("1f384"),
  ring: emoji("1f48d"),
  cake: emoji("1f370"),
  diamond: emoji("1f48e"),
  crown: emoji("1f451")
};

export const cases: GiftCase[] = [
  {
    id: "perfume",
    name: "Perfume",
    price: 3,
    hot: true,
    image: "PR",
    imageUrl: giftImages.perfume,
    type: "Telegram gifts",
    drops: [
      { id: "perfume-lollipop", name: "Lol Pop", value: 5442.8, rarity: "Mythic", chance: 0.12, tag: "Animated", imageUrl: giftImages.lollipop },
      { id: "perfume-orb", name: "Crystal Orb", value: 269.26, rarity: "Legendary", chance: 1.1, tag: "Gift", imageUrl: giftImages.orb },
      { id: "perfume-bag", name: "Gift Bag", value: 95.69, rarity: "Epic", chance: 4.5, tag: "Seasonal", imageUrl: giftImages.redbox },
      { id: "perfume-ring", name: "Love Ring", value: 38.4, rarity: "Rare", chance: 18, tag: "Collectible", imageUrl: giftImages.ring },
      { id: "perfume-bear", name: "Plush Frog", value: 8.7, rarity: "Common", chance: 76.28, tag: "Gift", imageUrl: giftImages.pepe }
    ]
  },
  {
    id: "plush-pepe",
    name: "Plush Frog",
    price: 7,
    hot: true,
    image: "PF",
    imageUrl: giftImages.pepe,
    type: "Animated gifts",
    drops: [
      { id: "pepe-gold", name: "Gold Frog", value: 1290, rarity: "Mythic", chance: 0.25, tag: "Animated", imageUrl: giftImages.pepe },
      { id: "pepe-crown", name: "Crown Gift", value: 420, rarity: "Legendary", chance: 1.4, tag: "Limited", imageUrl: giftImages.crown },
      { id: "pepe-plush", name: "Green Plush", value: 86, rarity: "Epic", chance: 6.35, tag: "Gift", imageUrl: giftImages.pepe },
      { id: "pepe-sticker", name: "Rare Diamond", value: 22, rarity: "Rare", chance: 24, tag: "Collectible", imageUrl: giftImages.diamond },
      { id: "pepe-card", name: "Gift Card", value: 4.8, rarity: "Common", chance: 68, tag: "Gift", imageUrl: giftImages.redbox }
    ]
  },
  {
    id: "durov-cap",
    name: "Durov Cap",
    price: 15,
    hot: false,
    image: "DC",
    imageUrl: giftImages.cap,
    type: "Rare Telegram items",
    drops: [
      { id: "cap-black", name: "Black Cap", value: 2400, rarity: "Mythic", chance: 0.18, tag: "Limited", imageUrl: giftImages.cap },
      { id: "cap-silver", name: "Silver Cap", value: 690, rarity: "Legendary", chance: 1.22, tag: "Collectible", imageUrl: giftImages.cap },
      { id: "cap-blue", name: "Blue Cap", value: 160, rarity: "Epic", chance: 7.6, tag: "Gift", imageUrl: giftImages.cap },
      { id: "cap-pin", name: "Telegram Star", value: 34, rarity: "Rare", chance: 28, tag: "Gift", imageUrl: giftImages.star },
      { id: "cap-box", name: "Mini Gift Box", value: 9.5, rarity: "Common", chance: 63, tag: "Gift", imageUrl: giftImages.redbox }
    ]
  },
  {
    id: "holiday-drop",
    name: "Holiday Drop",
    price: 29,
    hot: false,
    image: "HD",
    imageUrl: giftImages.redbox,
    type: "Seasonal gifts",
    drops: [
      { id: "holiday-tree", name: "Holiday Tree", value: 3200, rarity: "Mythic", chance: 0.15, tag: "Seasonal", imageUrl: giftImages.tree },
      { id: "holiday-star", name: "Frozen Star", value: 870, rarity: "Legendary", chance: 1.2, tag: "Animated", imageUrl: giftImages.star },
      { id: "holiday-snow", name: "Snow Gift", value: 210, rarity: "Epic", chance: 8.65, tag: "Gift", imageUrl: giftImages.snowglobe },
      { id: "holiday-cake", name: "Cake Gift", value: 54, rarity: "Rare", chance: 30, tag: "Gift", imageUrl: giftImages.cake },
      { id: "holiday-box", name: "Red Gift Box", value: 14, rarity: "Common", chance: 60, tag: "Gift", imageUrl: giftImages.redbox }
    ]
  }
];

export const liveFeed = [
  { user: "giftboss", item: "Lol Pop", value: 5442.8, rarity: "Mythic" as Rarity },
  { user: "tonmax", item: "Frozen Star", value: 870, rarity: "Legendary" as Rarity },
  { user: "starsqueen", item: "Blue Cap", value: 160, rarity: "Epic" as Rarity }
];

export const inventorySeed: Drop[] = [
  { id: "owned-bear", name: "Plush Frog", value: 8.7, rarity: "Common", chance: 0, tag: "Gift", imageUrl: giftImages.pepe },
  { id: "owned-ring", name: "Love Ring", value: 38.4, rarity: "Rare", chance: 0, tag: "Collectible", imageUrl: giftImages.ring },
  { id: "owned-snow", name: "Snow Gift", value: 210, rarity: "Epic", chance: 0, tag: "Gift", imageUrl: giftImages.snowglobe }
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
  { id: "m2", seller: "starsqueen", item: "Gold Frog", rarity: "Mythic" as Rarity, price: 410, currency: "TON", tag: "Animated" },
  { id: "m3", seller: "tonmax", item: "Snow Gift", rarity: "Epic" as Rarity, price: 72, currency: "TON", tag: "Seasonal" }
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
