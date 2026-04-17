import {
  BASE_TRADE_FEE_RATE,
  COMMODITIES,
  ENERGY_COST_PER_HOUR,
  MARKET_TICK_SECONDS,
  MAX_ENERGY_HOURS,
  MAX_OFFLINE_TICKS,
  NEWS_TEMPLATES,
  RANKS,
  STARTING_ENERGY_HOURS,
  STARTING_HEAT,
  STARTING_ZERO_BOL
} from "./constants";
import type {
  Commodity,
  CommodityMarketState,
  GameState,
  MarketCandle,
  MarketNews,
  Position,
  ScreenId,
  TradeResult,
  TradeType,
  Transaction,
  WalletMode
} from "./types";

const DEFAULT_COMMODITY_ID = "fdst";
const MARKET_HISTORY_POINTS = 28;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getCommodity(commodityId: string): Commodity {
  const commodity = COMMODITIES.find((item) => item.id === commodityId);
  if (!commodity) {
    throw new Error(`Unknown commodity: ${commodityId}`);
  }
  return commodity;
}

export function getCommodityByTicker(ticker: string): Commodity | undefined {
  return COMMODITIES.find((item) => item.ticker === ticker);
}

export function capacityUsed(positions: Record<string, Position>): number {
  return Object.values(positions).reduce((sum, position) => {
    const commodity = getCommodity(position.commodityId);
    return sum + position.quantity * commodity.size;
  }, 0);
}

export function getRankForXp(xp: number): { level: number; title: string; nextXp: number | null } {
  type RankEntry = (typeof RANKS)[number];
  let current: RankEntry = RANKS[0];
  let next: RankEntry | null = RANKS[1];

  for (let index = 0; index < RANKS.length; index += 1) {
    const rank = RANKS[index];
    if (xp >= rank.xp) {
      current = rank;
      next = RANKS[index + 1] ?? null;
    }
  }

  return {
    level: current.level,
    title: current.title,
    nextXp: next?.xp ?? null
  };
}

function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function id(prefix: string, now: number, suffix = 0): string {
  return `${prefix}_${Math.floor(now).toString(36)}_${suffix.toString(36)}`;
}

function createCandles(basePrice: number, volatility: number, seedOffset: number): MarketCandle[] {
  const candles: MarketCandle[] = [];
  let open = basePrice;

  for (let index = 0; index < MARKET_HISTORY_POINTS; index += 1) {
    const wobble = (seededUnit(index + seedOffset) - 0.5) * volatility * 0.42;
    const revert = (basePrice - open) / basePrice * 0.08;
    const close = roundMoney(clamp(open * (1 + wobble + revert), basePrice * 0.45, basePrice * 2.75));
    const wickSeed = seededUnit(index * 19 + seedOffset);
    const upperWick = Math.max(open, close) * (0.004 + wickSeed * volatility * 0.34);
    const lowerWick = Math.min(open, close) * (0.004 + (1 - wickSeed) * volatility * 0.3);
    const high = roundMoney(Math.max(open, close) + upperWick);
    const low = roundMoney(Math.max(0.01, Math.min(open, close) - lowerWick));
    const volume = Math.round(900 + seededUnit(index * 23 + seedOffset) * 4200 * (1 + volatility));

    candles.push({
      tick: index - MARKET_HISTORY_POINTS + 1,
      open: roundMoney(open),
      high,
      low,
      close,
      volume
    });
    open = close;
  }

  return candles;
}

function createTickCandle(
  commodity: Commodity,
  previousPrice: number,
  nextPrice: number,
  nextTick: number
): MarketCandle {
  const volatility = commodity.volatility;
  const wickSeed = seededUnit(nextTick * 41 + commodity.basePrice);
  const upperWick = Math.max(previousPrice, nextPrice) * (0.003 + wickSeed * volatility * 0.28);
  const lowerWick = Math.min(previousPrice, nextPrice) * (0.003 + (1 - wickSeed) * volatility * 0.26);

  return {
    tick: nextTick,
    open: roundMoney(previousPrice),
    high: roundMoney(Math.max(previousPrice, nextPrice) + upperWick),
    low: roundMoney(Math.max(0.01, Math.min(previousPrice, nextPrice) - lowerWick)),
    close: roundMoney(nextPrice),
    volume: Math.round(1000 + seededUnit(nextTick * 47 + commodity.size) * 5200 * (1 + volatility))
  };
}

export function createInitialMarket(): Record<string, CommodityMarketState> {
  return COMMODITIES.reduce<Record<string, CommodityMarketState>>((market, commodity, index) => {
    const candles = createCandles(commodity.basePrice, commodity.volatility, index + 1);
    const history = candles.map((candle) => candle.close);
    const currentPrice = history[history.length - 1] ?? commodity.basePrice;
    const previousPrice = history[history.length - 2] ?? commodity.basePrice;

    market[commodity.id] = {
      commodityId: commodity.id,
      currentPrice,
      previousPrice,
      lastTick: 0,
      trendData: {
        momentum: (currentPrice - previousPrice) / previousPrice,
        liquiditySkew: 1,
        sectorBias: 1
      },
      history,
      candles
    };

    return market;
  }, {});
}

export function normalizeCommodityState(state: GameState): GameState {
  const canonicalMarket = createInitialMarket();
  const commodityIds = new Set(COMMODITIES.map((commodity) => commodity.id));
  const market = COMMODITIES.reduce<Record<string, CommodityMarketState>>((nextMarket, commodity) => {
    const existing = state.market[commodity.id] as Partial<CommodityMarketState> | undefined;
    const fallback = canonicalMarket[commodity.id];

    nextMarket[commodity.id] = existing
      ? {
          ...fallback,
          ...existing,
          commodityId: commodity.id,
          history: existing.history?.length ? existing.history : fallback.history,
          candles: existing.candles?.length ? existing.candles : fallback.candles
        }
      : fallback;

    return nextMarket;
  }, {});
  const positions = Object.entries(state.positions).reduce<Record<string, Position>>((nextPositions, [commodityId, position]) => {
    if (commodityIds.has(commodityId)) {
      nextPositions[commodityId] = position;
    }

    return nextPositions;
  }, {});
  const selectedCommodityId = commodityIds.has(state.game.selectedCommodityId)
    ? state.game.selectedCommodityId
    : DEFAULT_COMMODITY_ID;

  return {
    ...state,
    market,
    positions,
    game: {
      ...state.game,
      selectedCommodityId
    }
  };
}

export function createInitialGameState(
  eidolonHandle = "ghxst.eth",
  walletMode: WalletMode = "dev-identity",
  now = Date.now()
): GameState {
  const userId = `eid_${Math.floor(now).toString(36)}`;

  return {
    user: {
      id: userId,
      walletAddress: walletMode === "dev-identity" ? null : `0x${Math.floor(now).toString(16).slice(-8)}`,
      walletMode,
      createdAt: now
    },
    profile: {
      id: userId,
      walletAddress: walletMode === "dev-identity" ? null : `0x${Math.floor(now).toString(16).slice(-8)}`,
      walletMode,
      eidolonHandle,
      createdAt: now,
      currentOs: "pirate",
      rankLevel: 0,
      rankTitle: "Boot Ghost",
      xp: 0,
      factionId: null
    },
    resources: {
      energyHours: STARTING_ENERGY_HOURS,
      heat: STARTING_HEAT,
      integrity: 86,
      stealth: 43,
      influence: 5,
      lastUpdatedAt: now
    },
    currencies: {
      zeroBol: STARTING_ZERO_BOL,
      obolToken: null
    },
    market: createInitialMarket(),
    positions: {},
    transactions: [],
    news: [
      {
        id: "seed_neon_ward",
        headline: "Neon Ward desk whispers supply delay",
        body: "Low-confidence signal says Velvet Tabs are being relabeled as Phantom Crate inventory.",
        affectedTickers: ["VTAB", "FDST"],
        direction: "mixed",
        credibility: 0.52,
        createdAtTick: 0,
        expiresAtTick: 3
      }
    ],
    game: {
      currentScreen: "deck",
      tutorialStep: "metrics",
      lastLoginAt: now,
      marketTick: 0,
      selectedCommodityId: DEFAULT_COMMODITY_ID,
      inventoryCapacity: 100,
      lastEvent: "BOOT OK - CHECKSUM 0x7F3A"
    }
  };
}

export function createEmptyGameState(now = Date.now()): GameState {
  return {
    user: null,
    profile: null,
    resources: null,
    currencies: null,
    market: createInitialMarket(),
    positions: {},
    transactions: [],
    news: [],
    game: {
      currentScreen: "intro",
      tutorialStep: "boot",
      lastLoginAt: null,
      marketTick: 0,
      selectedCommodityId: DEFAULT_COMMODITY_ID,
      inventoryCapacity: 100,
      lastEvent: `COLD BOOT ${now.toString(36)}`
    }
  };
}

export function updateEnergy(state: GameState, now = Date.now()): GameState {
  if (!state.resources) {
    return state;
  }

  const elapsedHours = Math.max(0, (now - state.resources.lastUpdatedAt) / 3_600_000);
  if (elapsedHours === 0) {
    return state;
  }

  const heatMultiplier = 1 + state.resources.heat / 220;
  const nextEnergy = clamp(state.resources.energyHours - elapsedHours * heatMultiplier, 0, MAX_ENERGY_HOURS);

  return {
    ...state,
    resources: {
      ...state.resources,
      energyHours: roundMoney(nextEnergy),
      lastUpdatedAt: now
    },
    game: {
      ...state.game,
      lastEvent: nextEnergy <= 0 ? "DORMANT MODE - ENERGY EMPTY" : state.game.lastEvent
    }
  };
}

export function updateHeat(state: GameState, now = Date.now()): GameState {
  if (!state.resources) {
    return state;
  }

  const elapsedHours = Math.max(0, (now - state.resources.lastUpdatedAt) / 3_600_000);
  const decayedHeat = clamp(state.resources.heat - elapsedHours * 4.5, 0, 100);

  return {
    ...state,
    resources: {
      ...state.resources,
      heat: roundMoney(decayedHeat)
    }
  };
}

export function resolveState(state: GameState, now = Date.now()): GameState {
  const canonicalState = normalizeCommodityState(state);

  if (!canonicalState.resources) {
    return canonicalState;
  }

  const elapsedMs = Math.max(0, now - canonicalState.resources.lastUpdatedAt);
  const offlineTicks = clamp(Math.floor(elapsedMs / (MARKET_TICK_SECONDS * 1000)), 0, MAX_OFFLINE_TICKS);
  let resolved = updateEnergy(updateHeat(canonicalState, now), now);

  for (let index = 0; index < offlineTicks; index += 1) {
    resolved = applyMarketTick(resolved, now + index);
  }

  return resolved;
}

function tickerNewsImpact(
  commodity: Commodity,
  news: MarketNews[],
  nextTick: number
): number {
  return news.reduce((impact, item) => {
    if (item.expiresAtTick < nextTick || !item.affectedTickers.includes(commodity.ticker)) {
      return impact;
    }

    const direction = item.direction === "mixed"
      ? (commodity.ticker === "VBLO" || commodity.ticker === "GCHP" ? -1 : 1)
      : item.direction === "up"
        ? 1
        : -1;

    return impact + direction * item.credibility * commodity.volatility * 0.9;
  }, 0);
}

function generateNewsForTick(nextTick: number): MarketNews | null {
  if (nextTick === 0 || nextTick % 3 !== 0) {
    return null;
  }

  const template = NEWS_TEMPLATES[(nextTick / 3) % NEWS_TEMPLATES.length];

  return {
    ...template,
    id: `news_${nextTick}_${template.affectedTickers.join("_").toLowerCase()}`,
    createdAtTick: nextTick,
    expiresAtTick: nextTick + 4
  };
}

export function applyMarketTick(state: GameState, now = Date.now()): GameState {
  const nextTick = state.game.marketTick + 1;
  const heat = state.resources?.heat ?? STARTING_HEAT;
  const generatedNews = generateNewsForTick(nextTick);
  const activeNews = generatedNews ? [generatedNews, ...state.news] : state.news;
  const nextMarket: Record<string, CommodityMarketState> = {};

  for (const commodity of COMMODITIES) {
    const item = state.market[commodity.id];
    const current = item?.currentPrice ?? commodity.basePrice;
    const randomWalk = 1 + (seededUnit(nextTick * 17 + commodity.basePrice) - 0.5) * commodity.volatility;
    const newsImpact = 1 + tickerNewsImpact(commodity, activeNews, nextTick);
    const meanReversion = 1 + ((commodity.basePrice - current) / commodity.basePrice) * 0.07;
    const heatPressure = commodity.heatRisk >= 3 ? 1 - heat / 1000 : 1 + heat / 3000;
    const liquiditySkew = 1 + (seededUnit(nextTick * 31 + commodity.size) - 0.5) * 0.05;
    const trendMomentum = 1 + clamp(item?.trendData.momentum ?? 0, -0.08, 0.08) * 0.45;
    const sectorBias = item?.trendData.sectorBias ?? 1;
    const nextPrice = roundMoney(clamp(
      commodity.basePrice *
        sectorBias *
        newsImpact *
        liquiditySkew *
        trendMomentum *
        randomWalk *
        meanReversion *
        heatPressure,
      commodity.basePrice * 0.22,
      commodity.basePrice * 4.8
    ));
    const previousPrice = current;
    const delta = previousPrice === 0 ? 0 : (nextPrice - previousPrice) / previousPrice;
    const history = [...(item?.history ?? []), nextPrice].slice(-MARKET_HISTORY_POINTS);
    const candles = [
      ...(item?.candles ?? []),
      createTickCandle(commodity, previousPrice, nextPrice, nextTick)
    ].slice(-MARKET_HISTORY_POINTS);

    nextMarket[commodity.id] = {
      commodityId: commodity.id,
      currentPrice: nextPrice,
      previousPrice,
      lastTick: nextTick,
      trendData: {
        momentum: clamp(delta * 0.65 + (item?.trendData.momentum ?? 0) * 0.35, -0.18, 0.18),
        liquiditySkew,
        sectorBias
      },
      history,
      candles
    };
  }

  return {
    ...state,
    market: nextMarket,
    news: activeNews.filter((item) => item.expiresAtTick >= nextTick).slice(0, 12),
    game: {
      ...state.game,
      marketTick: nextTick,
      lastEvent: generatedNews ? `SIGNAL: ${generatedNews.headline.toUpperCase()}` : `MARKET TICK ${nextTick}`
    }
  };
}

export function executeTrade(
  state: GameState,
  commodityId: string,
  quantity: number,
  type: TradeType,
  now = Date.now()
): TradeResult {
  const resolved = resolveState(state, now);
  const user = resolved.user;
  const profile = resolved.profile;
  const currencies = resolved.currencies;
  const resources = resolved.resources;

  if (!user || !profile || !currencies || !resources) {
    return { ok: false, message: "Identity missing. Boot the deck first.", state: resolved };
  }

  if (resources.energyHours <= 0) {
    return { ok: false, message: "Dormant Mode. Buy Energy before trading.", state: resolved };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { ok: false, message: "Quantity must be above zero.", state: resolved };
  }

  const commodity = getCommodity(commodityId);
  const marketState = resolved.market[commodityId];
  const price = marketState.currentPrice;
  const gross = roundMoney(price * quantity);
  const fee = roundMoney(gross * BASE_TRADE_FEE_RATE * (1 + resources.heat / 250));
  const heatAdded = roundMoney(clamp(quantity * commodity.size * commodity.heatRisk * 0.08 + gross / 100_000, 0.1, 18));
  const existing = resolved.positions[commodityId] ?? {
    commodityId,
    quantity: 0,
    averageEntry: 0,
    realizedPnl: 0
  };

  if (type === "buy") {
    const totalCost = gross + fee;
    const nextCapacity = capacityUsed(resolved.positions) + quantity * commodity.size;

    if (totalCost > currencies.zeroBol) {
      return { ok: false, message: "Insufficient 0BOL for buy order.", state: resolved };
    }

    if (nextCapacity > resolved.game.inventoryCapacity) {
      return { ok: false, message: "Deck inventory capacity exceeded.", state: resolved };
    }

    const nextQty = existing.quantity + quantity;
    const averageEntry = nextQty === 0
      ? 0
      : roundMoney((existing.averageEntry * existing.quantity + gross) / nextQty);
    const transaction = makeTransaction(user.id, type, commodityId, quantity, price, fee, heatAdded, now);
    const nextXp = profile.xp + Math.round(quantity * commodity.volatility * 40 + 12);

    return {
      ok: true,
      message: `Bought ${quantity} ${commodity.ticker} at ${price.toFixed(2)} 0BOL.`,
      transaction,
      state: applyRank({
        ...resolved,
        currencies: {
          ...currencies,
          zeroBol: roundMoney(currencies.zeroBol - totalCost)
        },
        resources: {
          ...resources,
          heat: roundMoney(clamp(resources.heat + heatAdded, 0, 100))
        },
        positions: {
          ...resolved.positions,
          [commodityId]: {
            ...existing,
            quantity: nextQty,
            averageEntry
          }
        },
        transactions: [transaction, ...resolved.transactions].slice(0, 50),
        game: {
          ...resolved.game,
          tutorialStep: resolved.game.tutorialStep === "first-buy" ? "tick-news" : resolved.game.tutorialStep,
          lastEvent: `ORDER FILLED BUY ${commodity.ticker}`
        },
        profile: {
          ...profile,
          xp: nextXp
        }
      })
    };
  }

  if (existing.quantity < quantity) {
    return { ok: false, message: "Insufficient inventory for sell order.", state: resolved };
  }

  const realizedDelta = roundMoney((price - existing.averageEntry) * quantity - fee);
  const nextQty = existing.quantity - quantity;
  const transaction = makeTransaction(user.id, type, commodityId, quantity, price, fee, heatAdded, now);
  const nextPositions = {
    ...resolved.positions,
    [commodityId]: {
      ...existing,
      quantity: nextQty,
      realizedPnl: roundMoney(existing.realizedPnl + realizedDelta)
    }
  };

  if (nextQty === 0) {
    delete nextPositions[commodityId];
  }

  const xpFromTrade = realizedDelta > 0 ? Math.round(realizedDelta / 12 + commodity.volatility * 60) : 5;

  return {
    ok: true,
    message: `Sold ${quantity} ${commodity.ticker}; PnL ${realizedDelta.toFixed(2)} 0BOL.`,
    transaction,
    state: applyRank({
      ...resolved,
      currencies: {
        ...currencies,
        zeroBol: roundMoney(currencies.zeroBol + gross - fee)
      },
      resources: {
        ...resources,
        heat: roundMoney(clamp(resources.heat + heatAdded, 0, 100))
      },
      positions: nextPositions,
      transactions: [transaction, ...resolved.transactions].slice(0, 50),
      game: {
        ...resolved.game,
        tutorialStep: resolved.game.tutorialStep === "first-sell" ? "complete" : resolved.game.tutorialStep,
        lastEvent: `ORDER FILLED SELL ${commodity.ticker}`
      },
      profile: {
        ...profile,
        xp: profile.xp + xpFromTrade
      }
    })
  };
}

function makeTransaction(
  userId: string,
  type: TradeType,
  commodityId: string,
  quantity: number,
  price: number,
  fee: number,
  heatAdded: number,
  now: number
): Transaction {
  return {
    id: id("tx", now, quantity),
    userId,
    type,
    commodityId,
    quantity,
    price,
    fee,
    heatAdded,
    createdAt: now
  };
}

export function buyEnergy(state: GameState, hours: number, now = Date.now()): TradeResult {
  const resolved = resolveState(state, now);
  const currencies = resolved.currencies;
  const resources = resolved.resources;

  if (!currencies || !resources) {
    return { ok: false, message: "Identity missing. Boot the deck first.", state: resolved };
  }

  const safeHours = Math.max(1, Math.floor(hours));
  const cost = safeHours * ENERGY_COST_PER_HOUR;
  const nextEnergy = clamp(resources.energyHours + safeHours, 0, MAX_ENERGY_HOURS);

  if (cost > currencies.zeroBol) {
    return { ok: false, message: "Insufficient 0BOL for Energy pack.", state: resolved };
  }

  return {
    ok: true,
    message: `Bought ${safeHours}h Energy for ${cost.toLocaleString()} 0BOL.`,
    state: {
      ...resolved,
      currencies: {
        ...currencies,
        zeroBol: roundMoney(currencies.zeroBol - cost)
      },
      resources: {
        ...resources,
        energyHours: roundMoney(nextEnergy)
      },
      game: {
        ...resolved.game,
        lastEvent: `ENERGY +${safeHours}H`
      }
    }
  };
}

export function setScreen(state: GameState, screen: ScreenId): GameState {
  return {
    ...state,
    game: {
      ...state.game,
      currentScreen: screen,
      tutorialStep: state.game.tutorialStep === "enter-market" && screen === "s1lkroad"
        ? "first-buy"
        : state.game.tutorialStep
    }
  };
}

export function selectCommodity(state: GameState, commodityId: string): GameState {
  return {
    ...state,
    game: {
      ...state.game,
      selectedCommodityId: commodityId
    }
  };
}

export function advanceTutorial(state: GameState): GameState {
  const nextByStep = {
    boot: "metrics",
    metrics: "enter-market",
    "enter-market": "first-buy",
    "first-buy": "tick-news",
    "tick-news": "first-sell",
    "first-sell": "complete",
    complete: "complete"
  } as const;

  return {
    ...state,
    game: {
      ...state.game,
      tutorialStep: nextByStep[state.game.tutorialStep]
    }
  };
}

function applyRank(state: GameState): GameState {
  if (!state.profile) {
    return state;
  }

  const rank = getRankForXp(state.profile.xp);

  return {
    ...state,
    profile: {
      ...state.profile,
      rankLevel: rank.level,
      rankTitle: rank.title
    }
  };
}

export function getPlayerState(state: GameState): GameState {
  return resolveState(state);
}

export function getMarket(state: GameState): CommodityMarketState[] {
  return Object.values(state.market);
}

export function getNews(state: GameState): MarketNews[] {
  return state.news;
}

export function calculateUnrealizedPnl(state: GameState, position: Position): number {
  const current = state.market[position.commodityId]?.currentPrice ?? position.averageEntry;
  return roundMoney((current - position.averageEntry) * position.quantity);
}
