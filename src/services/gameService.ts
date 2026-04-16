import {
  applyMarketTick,
  buyEnergy,
  executeTrade,
  getMarket,
  getNews,
  resolveState,
  updateEnergy,
  updateHeat
} from "@/game/engine";
import type { GameState, TradeResult, TradeType } from "@/game/types";

export type GameService = {
  getPlayerState: (userId: string) => GameState;
  executeTrade: (
    userId: string,
    commodityId: string,
    quantity: number,
    type: TradeType
  ) => TradeResult;
  getMarket: () => ReturnType<typeof getMarket>;
  getNews: () => ReturnType<typeof getNews>;
  updateEnergy: (userId: string) => GameState;
  updateHeat: (userId: string) => GameState;
  buyEnergy: (userId: string, hours: number) => TradeResult;
  runMarketTick: () => GameState;
};

export function createLocalGameService(
  readState: () => GameState,
  writeState: (state: GameState) => void
): GameService {
  function assertUser(userId: string, state: GameState) {
    if (!state.user || state.user.id !== userId) {
      throw new Error("Unauthorized Eidolon session.");
    }
  }

  return {
    getPlayerState(userId) {
      const nextState = resolveState(readState());
      assertUser(userId, nextState);
      writeState(nextState);
      return nextState;
    },

    executeTrade(userId, commodityId, quantity, type) {
      const state = readState();
      assertUser(userId, state);
      const result = executeTrade(state, commodityId, quantity, type);
      writeState(result.state);
      return result;
    },

    getMarket() {
      return getMarket(readState());
    },

    getNews() {
      return getNews(readState());
    },

    updateEnergy(userId) {
      const state = readState();
      assertUser(userId, state);
      const nextState = updateEnergy(state);
      writeState(nextState);
      return nextState;
    },

    updateHeat(userId) {
      const state = readState();
      assertUser(userId, state);
      const nextState = updateHeat(state);
      writeState(nextState);
      return nextState;
    },

    buyEnergy(userId, hours) {
      const state = readState();
      assertUser(userId, state);
      const result = buyEnergy(state, hours);
      writeState(result.state);
      return result;
    },

    runMarketTick() {
      const nextState = applyMarketTick(resolveState(readState()));
      writeState(nextState);
      return nextState;
    }
  };
}
