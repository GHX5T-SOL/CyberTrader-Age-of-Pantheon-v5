import type { Commodity, MarketNews } from "./types";

export const STARTING_ZERO_BOL = 1_000_000;
export const STARTING_ENERGY_HOURS = 72;
export const STARTING_HEAT = 12;
export const MARKET_TICK_SECONDS = 45;
export const MAX_OFFLINE_TICKS = 24;
export const BASE_TRADE_FEE_RATE = 0.0035;
export const MAX_ENERGY_HOURS = 96;
export const ENERGY_COST_PER_HOUR = 4_000;

export const RANKS = [
  { level: 0, title: "Boot Ghost", xp: 0 },
  { level: 1, title: "Packet Rat", xp: 700 },
  { level: 2, title: "Signal Runner", xp: 1_900 },
  { level: 3, title: "Black Terminal", xp: 4_000 },
  { level: 5, title: "Node Thief", xp: 9_000 },
  { level: 8, title: "Route Phantom", xp: 18_000 },
  { level: 12, title: "Grid Smuggler", xp: 34_000 },
  { level: 16, title: "eCriminal Architect", xp: 54_000 },
  { level: 20, title: "Pantheon Candidate", xp: 82_000 },
  { level: 30, title: "Neon Warlord", xp: 160_000 },
  { level: 40, title: "Pantheon Ascendant", xp: 300_000 }
] as const;

export const COMMODITIES: Commodity[] = [
  {
    id: "fdst",
    ticker: "FDST",
    name: "Fractol Dust",
    lore: "Crystalline prediction residue harvested from broken AI dreams.",
    icon: "<*>",
    basePrice: 2340,
    volatility: 0.18,
    size: 2,
    heatRisk: 2,
    rarity: "volatile",
    tags: ["crystal", "shock", "prediction"]
  },
  {
    id: "pgas",
    ticker: "PGAS",
    name: "Plutonion Gas",
    lore: "Sealed micro-reactor vapor used in illegal grid bursts.",
    icon: "(O)",
    basePrice: 4100,
    volatility: 0.14,
    size: 4,
    heatRisk: 3,
    rarity: "rare",
    tags: ["reactor", "grid", "storage"]
  },
  {
    id: "ngls",
    ticker: "NGLS",
    name: "Neon Glass",
    lore: "Optical memory shards that refract corrupted Pantheon fragments.",
    icon: "/\\",
    basePrice: 1200,
    volatility: 0.09,
    size: 1,
    heatRisk: 1,
    rarity: "uncommon",
    tags: ["memory", "lore", "archive"]
  },
  {
    id: "hxmd",
    ticker: "HXMD",
    name: "Helix Mud",
    lore: "Bio-synthetic coolant sludge for overheated drone minds.",
    icon: "~H",
    basePrice: 680,
    volatility: 0.11,
    size: 3,
    heatRisk: 1,
    rarity: "common",
    tags: ["coolant", "drone", "raid"]
  },
  {
    id: "vblo",
    ticker: "VBLO",
    name: "Void Bloom",
    lore: "Fungal code growth that eats dead packets and sells as compute feed.",
    icon: "{#}",
    basePrice: 310,
    volatility: 0.06,
    size: 5,
    heatRisk: 1,
    rarity: "common",
    tags: ["bulky", "beginner", "compute"]
  },
  {
    id: "ores",
    ticker: "ORES",
    name: "Oracle Resin",
    lore: "Predictive resin wafers used by market prophets.",
    icon: "[]",
    basePrice: 1750,
    volatility: 0.16,
    size: 1,
    heatRisk: 2,
    rarity: "rare",
    tags: ["news", "premium", "oracle"]
  },
  {
    id: "vtab",
    ticker: "VTAB",
    name: "Velvet Tabs",
    lore: "Illicit soft-interface tabs that make hostile memory edits feel like velvet.",
    icon: "VT",
    basePrice: 118,
    volatility: 0.12,
    size: 2,
    heatRisk: 2,
    rarity: "uncommon",
    tags: ["tab", "memory", "street"]
  },
  {
    id: "ndst",
    ticker: "NDST",
    name: "Neon Dust",
    lore: "Powdered signal residue scraped from dead holo-signs and nightclub relays.",
    icon: "..",
    basePrice: 97,
    volatility: 0.17,
    size: 2,
    heatRisk: 2,
    rarity: "volatile",
    tags: ["powder", "signal", "nightlife"]
  },
  {
    id: "pcrt",
    ticker: "PCRT",
    name: "Phantom Crates",
    lore: "Black-market storage cubes whose contents phase in after payment clears.",
    icon: "[]",
    basePrice: 409,
    volatility: 0.1,
    size: 4,
    heatRisk: 2,
    rarity: "uncommon",
    tags: ["crate", "storage", "phantom"]
  },
  {
    id: "gchp",
    ticker: "GCHP",
    name: "Ghost Chips",
    lore: "Dead-drop memory chips stamped with pirate skull keys.",
    icon: "☠",
    basePrice: 2104,
    volatility: 0.2,
    size: 1,
    heatRisk: 4,
    rarity: "volatile",
    tags: ["chip", "ghost", "evasion"]
  }
];

export const NEWS_TEMPLATES: Omit<MarketNews, "id" | "createdAtTick" | "expiresAtTick">[] = [
  {
    headline: "Border seizure hits Fractol Dust",
    body: "Echelon customs burns a cold-chain route. Holders see panic premiums.",
    affectedTickers: ["FDST"],
    direction: "up",
    credibility: 0.82
  },
  {
    headline: "Null Crown hoards Plutonion reserves",
    body: "Private grid cells are bidding above terminal ask.",
    affectedTickers: ["PGAS"],
    direction: "up",
    credibility: 0.74
  },
  {
    headline: "Archivist whale opens memory tender",
    body: "Memory shards and resin wafers show synchronized demand.",
    affectedTickers: ["NGLS", "ORES"],
    direction: "up",
    credibility: 0.68
  },
  {
    headline: "eAgent sweep burns Neon Ward routes",
    body: "High-risk cargo desks are widening spreads under trace pressure.",
    affectedTickers: ["GCHP", "PCRT", "FDST"],
    direction: "down",
    credibility: 0.91
  },
  {
    headline: "Helix vat drone strike",
    body: "Coolant demand spikes while cheap compute feed gets dumped.",
    affectedTickers: ["HXMD", "VBLO"],
    direction: "mixed",
    credibility: 0.77
  },
  {
    headline: "Fake pump exposed",
    body: "A vaporwave signal ring gets caught spoofing retail bots.",
    affectedTickers: ["VTAB", "NDST"],
    direction: "down",
    credibility: 0.48
  }
];

export const MODULES = [
  { key: "$", label: "S1LKROAD 4.0", screen: "s1lkroad", available: true, status: "AVAILABLE" },
  { key: "P", label: "Profile", screen: "profile", available: true, status: "AVAILABLE" },
  { key: "I", label: "Inventory", screen: "inventory", available: true, status: "AVAILABLE" },
  { key: "N", label: "Notifications", screen: "notifications", available: true, status: "AVAILABLE" },
  { key: "H", label: "Help / Glossary", screen: "help", available: true, status: "AVAILABLE" },
  { key: "S", label: "Settings", screen: "settings", available: true, status: "AVAILABLE" },
  { key: "F", label: "Factions", screen: "progression", available: false, status: "LOCKED AT AGENTOS RANK 5" },
  { key: "O", label: "Ops / Node Missions", screen: "progression", available: false, status: "LOCKED AT AGENTOS RANK 5" },
  { key: "R", label: "Raids", screen: "progression", available: false, status: "LOCKED AT PANTHEONOS RANK 20" },
  { key: "C", label: "Crew Warfare", screen: "progression", available: false, status: "LOCKED AT PANTHEONOS RANK 20" },
  { key: "T", label: "Territory Map", screen: "progression", available: false, status: "LOCKED AT PANTHEONOS RANK 20" },
  { key: "U", label: "Upgrade OS", screen: "progression", available: true, status: "RANK 5 TARGET" }
] as const;
