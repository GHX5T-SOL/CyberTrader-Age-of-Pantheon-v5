export type WalletMode = "dev-identity" | "web-wallet" | "mobile-wallet-adapter" | "server-session";

export type OsTier = "pirate" | "agent" | "pantheon";

export type TradeType = "buy" | "sell";

export type NewsDirection = "up" | "down" | "mixed";

export type ScreenId =
  | "intro"
  | "login"
  | "boot"
  | "deck"
  | "s1lkroad"
  | "profile"
  | "settings"
  | "inventory"
  | "progression"
  | "rank"
  | "leaderboard"
  | "rewards"
  | "notifications"
  | "help"
  | "legal";

export type PlayerProfile = {
  id: string;
  walletAddress: string | null;
  walletMode: WalletMode | null;
  eidolonHandle: string;
  createdAt: number;
  currentOs: OsTier;
  rankLevel: number;
  rankTitle: string;
  xp: number;
  factionId: string | null;
};

export type Resources = {
  energyHours: number;
  heat: number;
  integrity: number;
  stealth: number;
  influence: number;
  lastUpdatedAt: number;
};

export type CurrencyLedger = {
  zeroBol: number;
  obolToken: number | null;
};

export type Commodity = {
  id: string;
  ticker: string;
  name: string;
  lore: string;
  icon: string;
  basePrice: number;
  volatility: number;
  size: number;
  heatRisk: number;
  rarity: "common" | "uncommon" | "rare" | "volatile";
  tags: string[];
};

export type CommodityMarketState = {
  commodityId: string;
  currentPrice: number;
  previousPrice: number;
  lastTick: number;
  trendData: {
    momentum: number;
    liquiditySkew: number;
    sectorBias: number;
  };
  history: number[];
  candles: MarketCandle[];
};

export type MarketCandle = {
  tick: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Position = {
  commodityId: string;
  quantity: number;
  averageEntry: number;
  realizedPnl: number;
};

export type Transaction = {
  id: string;
  userId: string;
  type: TradeType;
  commodityId: string;
  quantity: number;
  price: number;
  fee: number;
  heatAdded: number;
  createdAt: number;
};

export type MarketNews = {
  id: string;
  headline: string;
  body: string;
  affectedTickers: string[];
  direction: NewsDirection;
  credibility: number;
  createdAtTick: number;
  expiresAtTick: number;
};

export type TutorialStep =
  | "boot"
  | "metrics"
  | "enter-market"
  | "first-buy"
  | "tick-news"
  | "first-sell"
  | "complete";

export type GameState = {
  user: {
    id: string;
    walletAddress: string | null;
    walletMode: WalletMode;
    createdAt: number;
  } | null;
  profile: PlayerProfile | null;
  resources: Resources | null;
  currencies: CurrencyLedger | null;
  market: Record<string, CommodityMarketState>;
  positions: Record<string, Position>;
  transactions: Transaction[];
  news: MarketNews[];
  game: {
    currentScreen: ScreenId;
    tutorialStep: TutorialStep;
    lastLoginAt: number | null;
    marketTick: number;
    selectedCommodityId: string;
    inventoryCapacity: number;
    lastEvent: string | null;
  };
};

export type TradeResult = {
  ok: boolean;
  message: string;
  state: GameState;
  transaction?: Transaction;
};
