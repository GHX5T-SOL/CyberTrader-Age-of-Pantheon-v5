import React from "react";
import { StyleSheet, View } from "react-native";
import { RANKS } from "@/game/constants";
import { capacityUsed, getCommodity } from "@/game/engine";
import { useGameStore } from "@/game/store";
import type { GameState, ScreenId } from "@/game/types";
import { BracketButton, Chip, DeckText, Panel, TerminalScroll } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function ModulePage({ screen, openMenu }: { screen: ScreenId; openMenu?: () => void }) {
  const { state, reset, navigate } = useGameStore();
  const profile = state.profile;
  const currencies = state.currencies;
  const resources = state.resources;
  const positions = Object.values(state.positions);
  const page = getPageContent(screen, state);

  return (
    <TerminalScroll>
      <View style={styles.pageWrap}>
        <View style={styles.header}>
          <View>
            <DeckText tone="violet" style={styles.kicker}>AG3NT_OS//PIRAT3</DeckText>
            <DeckText tone="white" style={styles.screenTitle}>{page.title}</DeckText>
          </View>
          {openMenu ? <BracketButton label="MENU" onPress={openMenu} /> : null}
        </View>
        <Panel title={page.title} active>
          {page.lines.map((line) => (
            <DeckText key={line} tone="dim" style={styles.pageLine}>{line}</DeckText>
          ))}
          {screen === "profile" ? (
            <View style={styles.pageStats}>
              <Chip label={`handle ${profile?.eidolonHandle ?? "none"}`} tone="cyan" />
              <Chip label={`wallet ${state.user?.walletMode ?? "none"}`} />
              <Chip label={`rank ${profile?.rankLevel ?? 0} ${profile?.rankTitle ?? "Boot Ghost"}`} tone="white" />
            </View>
          ) : null}
          {screen === "inventory" ? (
            <View style={styles.pageStats}>
              <Chip label={`capacity ${capacityUsed(state.positions)} / ${state.game.inventoryCapacity}`} tone="amber" />
              {positions.map((position) => {
                const commodity = getCommodity(position.commodityId);
                return <Chip key={position.commodityId} label={`${commodity.ticker} x${position.quantity}`} tone="cyan" />;
              })}
            </View>
          ) : null}
          {screen === "rank" || screen === "progression" ? <RankLadder xp={profile?.xp ?? 0} /> : null}
          {screen === "settings" ? (
            <View style={styles.actions}>
              <BracketButton label="REPLAY INTRO" onPress={() => navigate("intro")} />
              <BracketButton label="RESET LOCAL SAVE" tone="danger" onPress={reset} />
            </View>
          ) : null}
          {screen === "legal" ? (
            <DeckText tone="amber" style={styles.paragraph}>
              Current state: {(currencies?.zeroBol ?? 0).toLocaleString()} 0BOL, {Math.round(resources?.energyHours ?? 0)}h Energy. No withdrawable rewards are implemented.
            </DeckText>
          ) : null}
        </Panel>
      </View>
    </TerminalScroll>
  );
}

function RankLadder({ xp }: { xp: number }) {
  return (
    <View style={styles.rankList}>
      {RANKS.map((rank) => {
        const unlocked = xp >= rank.xp;
        return (
          <View key={rank.level} style={styles.rankRow}>
            <DeckText tone={unlocked ? "profit" : "locked"}>{`R${rank.level}`}</DeckText>
            <DeckText tone={unlocked ? "white" : "locked"} style={styles.rankTitle}>{rank.title}</DeckText>
            <DeckText tone={unlocked ? "dim" : "locked"}>{`${rank.xp.toLocaleString()} XP`}</DeckText>
          </View>
        );
      })}
    </View>
  );
}

function getPageContent(screen: ScreenId, state: GameState): { title: string; lines: string[] } {
  const activePositions = Object.values(state.positions).length;

  const pages: Partial<Record<ScreenId, { title: string; lines: string[] }>> = {
    profile: {
      title: "PROFILE",
      lines: [
        "Identity: rogue Eidolon fragment",
        "Current OS: Ag3nt_0S//pIRAT3",
        "Wallet mode is visible but token flows stay locked in Phase 1."
      ]
    },
    settings: {
      title: "SETTINGS",
      lines: [
        "Replay cinematic, reset local save, and keep dev identity access obvious for Expo testing.",
        "Future toggles: reduced scanlines, high contrast mode, haptics, sound."
      ]
    },
    inventory: {
      title: "INVENTORY",
      lines: [
        `${activePositions} active position slots.`,
        "Inventory capacity blocks infinite buy loops and makes Pirate OS feel constrained."
      ]
    },
    progression: {
      title: "PROGRESSION / OS UPGRADES",
      lines: [
        "Rank 5 unlocks AgentOS: factions, node missions, first route map, better market scanner.",
        "Rank 20 unlocks PantheonOS: territory, crews, raids, memory shards.",
        "Phase 1 keeps these visible but locked."
      ]
    },
    rank: {
      title: "RANK",
      lines: [
        "XP comes from tutorial completion, profitable trades, and market events survived.",
        "The cyberdeck UI itself is the progression reward."
      ]
    },
    leaderboard: {
      title: "LEADERBOARD",
      lines: [
        "Local ghost board only in Phase 1.",
        "Seasonal multiplayer dominance waits for backend authority and anti-abuse rules."
      ]
    },
    rewards: {
      title: "REWARDS",
      lines: [
        "Rewards are locked. No paid randomized rewards. No loot boxes.",
        "Future rewards require legal review, region controls, and server authority."
      ]
    },
    notifications: {
      title: "NOTIFICATIONS",
      lines: [
        "BOOT OK - CHECKSUM 0x7F3A",
        "S1LKROAD port open.",
        "Echelon eAgents scanning high-Heat desks."
      ]
    },
    help: {
      title: "HELP / HOW TO PLAY",
      lines: [
        "Open S1LKROAD 4.0.",
        "Read news credibility and affected tickers.",
        "Buy low, sell high, manage Energy and Heat.",
        "Energy reaches zero: Dormant Mode. Trading stops until restored.",
        "Heat rises on large or risky trades and decays server-side over time."
      ]
    },
    legal: {
      title: "LEGAL / WALLET DISCLOSURES",
      lines: [
        "0BOL is free, off-chain, and non-withdrawable.",
        "$OBOL is optional, feature flagged, and not active in Phase 1.",
        "The app does not promise earnings and does not execute real-world trades."
      ]
    }
  };

  return pages[screen] ?? { title: "PIRATE MODULE", lines: ["Module unavailable in Pirate OS."] };
}

const styles = StyleSheet.create({
  pageWrap: {
    padding: spacing.md,
    gap: spacing.lg
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "center"
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  screenTitle: {
    fontSize: 34,
    letterSpacing: 3,
    marginTop: spacing.xs,
    marginBottom: spacing.xs
  },
  pageLine: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.sm
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md
  },
  pageStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  rankList: {
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  rankRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.frameLine,
    paddingBottom: spacing.sm
  },
  rankTitle: {
    flex: 1
  }
});
