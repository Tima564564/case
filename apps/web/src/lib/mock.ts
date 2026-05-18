export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export const cases = [
  {
    id: "neon-alpha",
    name: "Neon Alpha",
    price: 12.5,
    hot: true,
    image: "NA",
    drops: [
      { name: "Flux Blade", value: 8, rarity: "Common" as Rarity },
      { name: "Cyber AK", value: 34, rarity: "Rare" as Rarity },
      { name: "Pulse Dragon", value: 145, rarity: "Epic" as Rarity },
      { name: "Void Crown", value: 910, rarity: "Mythic" as Rarity }
    ]
  },
  {
    id: "gold-rush",
    name: "Gold Rush",
    price: 28,
    hot: true,
    image: "GR",
    drops: [
      { name: "Gold Scout", value: 18, rarity: "Common" as Rarity },
      { name: "Vault Gloves", value: 72, rarity: "Rare" as Rarity },
      { name: "Royal Karambit", value: 420, rarity: "Legendary" as Rarity }
    ]
  },
  {
    id: "mythic-vault",
    name: "Mythic Vault",
    price: 95,
    hot: false,
    image: "MV",
    drops: [
      { name: "Nova M4", value: 61, rarity: "Rare" as Rarity },
      { name: "Holo AWP", value: 260, rarity: "Epic" as Rarity },
      { name: "Genesis Knife", value: 1800, rarity: "Mythic" as Rarity }
    ]
  }
];

export const liveFeed = [
  { user: "vlad", item: "Void Crown", value: 910, rarity: "Mythic" },
  { user: "anna", item: "Royal Karambit", value: 420, rarity: "Legendary" },
  { user: "max", item: "Cyber AK", value: 34, rarity: "Rare" }
];
