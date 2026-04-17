import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  advanceTutorial,
  applyMarketTick,
  buyEnergy,
  createEmptyGameState,
  createInitialGameState,
  executeTrade,
  resolveState,
  selectCommodity,
  setScreen
} from "./engine";
import type { GameState, ScreenId, TradeResult, TradeType, WalletMode } from "./types";

const STORAGE_KEY = "cybertrader.phase1.state";

const PREVIEW_SCREENS: ScreenId[] = [
  "deck",
  "s1lkroad",
  "profile",
  "settings",
  "inventory",
  "progression",
  "rank",
  "leaderboard",
  "rewards",
  "notifications",
  "help",
  "legal"
];

function getPreviewScreen(): ScreenId | null {
  if (typeof globalThis.location === "undefined") {
    return null;
  }

  const params = new URLSearchParams(globalThis.location.search);
  if (params.get("view") !== "pirate") {
    return null;
  }

  const requested = params.get("screen") ?? "deck";
  return PREVIEW_SCREENS.includes(requested as ScreenId) ? requested as ScreenId : "deck";
}

function forceReviewHome(state: GameState): GameState {
  if (!state.user) {
    return state;
  }

  const previewScreen = getPreviewScreen();

  return {
    ...state,
    game: {
      ...state.game,
      currentScreen: previewScreen ?? "deck"
    }
  };
}

function wantsPiratePreview() {
  return getPreviewScreen() !== null;
}

type GameStore = {
  state: GameState;
  hydrated: boolean;
  toast: string | null;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  bootIdentity: (handle: string, walletMode: WalletMode) => void;
  navigate: (screen: ScreenId) => void;
  selectCommodity: (commodityId: string) => void;
  executeTrade: (commodityId: string, quantity: number, type: TradeType) => TradeResult;
  marketTick: () => void;
  buyEnergy: (hours: number) => TradeResult;
  advanceTutorial: () => void;
  clearToast: () => void;
};

function save(state: GameState) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
    // Local persistence is a convenience in Phase 1. Runtime state remains authoritative in memory.
  });
}

function commit(set: (partial: Partial<GameStore>) => void, state: GameState, toast?: string | null) {
  save(state);
  set({ state, toast: toast ?? null });
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: createEmptyGameState(),
  hydrated: false,
  toast: null,

  async hydrate() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        const resolved = resolveState(parsed);
        const previewState = wantsPiratePreview() && !resolved.user
          ? createInitialGameState("ghxst.eth", "dev-identity")
          : resolved;
        set({ state: forceReviewHome(previewState), hydrated: true });
        return;
      }
    } catch {
      // Corrupt cache should never block the game boot.
    }

    const initialState = wantsPiratePreview()
      ? forceReviewHome(createInitialGameState("ghxst.eth", "dev-identity"))
      : createEmptyGameState();

    set({ state: initialState, hydrated: true });
  },

  async reset() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ state: createEmptyGameState(), toast: null });
  },

  bootIdentity(handle, walletMode) {
    const safeHandle = handle.trim().length >= 2 ? handle.trim() : "ghxst.eth";
    const bootState = createInitialGameState(safeHandle, walletMode);
    const nextState = {
      ...bootState,
      game: {
        ...bootState.game,
        currentScreen: "boot" as const
      }
    };
    commit(set, nextState, "Eidolon identity mounted.");
  },

  navigate(screen) {
    commit(set, setScreen(get().state, screen));
  },

  selectCommodity(commodityId) {
    commit(set, selectCommodity(get().state, commodityId));
  },

  executeTrade(commodityId, quantity, type) {
    const result = executeTrade(get().state, commodityId, quantity, type);
    commit(set, result.state, result.message);
    return result;
  },

  marketTick() {
    const nextState = applyMarketTick(resolveState(get().state));
    const tutorialState = nextState.game.tutorialStep === "tick-news"
      ? advanceTutorial(nextState)
      : nextState;
    commit(set, tutorialState, tutorialState.game.lastEvent);
  },

  buyEnergy(hours) {
    const result = buyEnergy(get().state, hours);
    commit(set, result.state, result.message);
    return result;
  },

  advanceTutorial() {
    commit(set, advanceTutorial(get().state));
  },

  clearToast() {
    set({ toast: null });
  }
}));
