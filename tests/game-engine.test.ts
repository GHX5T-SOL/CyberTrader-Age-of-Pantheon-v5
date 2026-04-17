import assert from "node:assert/strict";
import {
  applyMarketTick,
  buyEnergy,
  createInitialGameState,
  executeTrade,
  getRankForXp,
  updateEnergy,
  updateHeat
} from "../src/game/engine";
import { COMMODITIES } from "../src/game/constants";

const now = 1_800_000_000_000;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function testInitialPlayer() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  assert.equal(state.profile?.currentOs, "pirate");
  assert.equal(state.profile?.rankTitle, "Boot Ghost");
  assert.equal(state.currencies?.zeroBol, 1_000_000);
  assert.equal(state.resources?.energyHours, 72);
}

function testBuildPlanCommodityUniverse() {
  const tickers = COMMODITIES.map((commodity) => commodity.ticker);

  assert.deepEqual(tickers, [
    "FDST",
    "PGAS",
    "NGLS",
    "HXMD",
    "VBLO",
    "ORES",
    "VTAB",
    "NDST",
    "PCRT",
    "GCHP"
  ]);
}

function testCandlestickMarketData() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);

  for (const commodity of COMMODITIES) {
    const market = state.market[commodity.id];
    const latest = market.candles[market.candles.length - 1];

    assert.ok(market.candles.length > 0);
    assert.equal(latest.close, market.currentPrice);
    assert.ok(latest.high >= Math.max(latest.open, latest.close));
    assert.ok(latest.low <= Math.min(latest.open, latest.close));
    assert.ok(latest.volume > 0);
  }

  const ticked = applyMarketTick(state, now);
  const latestFdst = ticked.market.fdst.candles[ticked.market.fdst.candles.length - 1];

  assert.equal(latestFdst.tick, 1);
  assert.equal(latestFdst.close, ticked.market.fdst.currentPrice);
  assert.ok(latestFdst.high >= Math.max(latestFdst.open, latestFdst.close));
  assert.ok(latestFdst.low <= Math.min(latestFdst.open, latestFdst.close));
}

function testEnergyDrainAndDormantBlock() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  const drained = updateEnergy({
    ...state,
    resources: {
      ...state.resources!,
      lastUpdatedAt: now - 3_600_000
    }
  }, now);

  assert.ok((drained.resources?.energyHours ?? 72) < 72);

  const dormant = {
    ...state,
    resources: {
      ...state.resources!,
      energyHours: 0
    }
  };
  const result = executeTrade(dormant, "fdst", 1, "buy", now);
  assert.equal(result.ok, false);
}

function testHeatDecay() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  const cooled = updateHeat({
    ...state,
    resources: {
      ...state.resources!,
      heat: 40,
      lastUpdatedAt: now - 2 * 3_600_000
    }
  }, now);

  assert.ok((cooled.resources?.heat ?? 40) < 40);
}

function testMarketTickDeterminismAndNews() {
  const stateA = createInitialGameState("tester.ai", "dev-identity", now);
  const stateB = createInitialGameState("tester.ai", "dev-identity", now);
  const tickA = applyMarketTick(applyMarketTick(applyMarketTick(stateA, now), now + 1), now + 2);
  const tickB = applyMarketTick(applyMarketTick(applyMarketTick(stateB, now), now + 1), now + 2);

  assert.deepEqual(tickA.market.fdst.history, tickB.market.fdst.history);
  assert.ok(tickA.news.length > stateA.news.length);
  assert.notEqual(tickA.market.fdst.currentPrice, stateA.market.fdst.currentPrice);
}

function testBuySellPnlAndRank() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  const buy = executeTrade(state, "fdst", 5, "buy", now);
  assert.equal(buy.ok, true);
  assert.equal(buy.state.positions.fdst.quantity, 5);
  assert.ok((buy.state.resources?.heat ?? 0) > (state.resources?.heat ?? 0));

  const profitable = clone(buy.state);
  profitable.market.fdst = {
    ...profitable.market.fdst,
    previousPrice: profitable.market.fdst.currentPrice,
    currentPrice: profitable.market.fdst.currentPrice * 1.25
  };

  const sell = executeTrade(profitable, "fdst", 2, "sell", now + 10);
  assert.equal(sell.ok, true);
  assert.ok((sell.state.currencies?.zeroBol ?? 0) > (buy.state.currencies?.zeroBol ?? 0));
  assert.equal(sell.state.positions.fdst.quantity, 3);

  const rank = getRankForXp(9_000);
  assert.equal(rank.level, 5);
  assert.equal(rank.title, "Node Thief");
}

function testInventoryCapacity() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  const result = executeTrade(state, "vblo", 30, "buy", now);
  assert.equal(result.ok, false);
  assert.match(result.message, /capacity/i);
}

function testEnergyPurchase() {
  const state = createInitialGameState("tester.ai", "dev-identity", now);
  const damaged = {
    ...state,
    resources: {
      ...state.resources!,
      energyHours: 12
    }
  };
  const result = buyEnergy(damaged, 4, now);
  assert.equal(result.ok, true);
  assert.equal(result.state.resources?.energyHours, 16);
  assert.equal(result.state.currencies?.zeroBol, 1_000_000 - 4 * 4_000);
}

testInitialPlayer();
testBuildPlanCommodityUniverse();
testCandlestickMarketData();
testEnergyDrainAndDormantBlock();
testHeatDecay();
testMarketTickDeterminismAndNews();
testBuySellPnlAndRank();
testInventoryCapacity();
testEnergyPurchase();

console.log("game engine tests passed");
