import React from "react";
import { StyleSheet, View } from "react-native";
import { PiratePhoneFrame } from "@/components/pirate-os/PiratePhoneFrame";
import { RANKS } from "@/game/constants";
import { capacityUsed, getCommodity } from "@/game/engine";
import { useGameStore } from "@/game/store";
import type { GameState, ScreenId } from "@/game/types";
import { BracketButton, Chip, DeckText, Panel } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function ModulePage({ screen, openMenu }: { screen: ScreenId; openMenu?: () => void }) {
  const { state, reset, navigate } = useGameStore();
  const profile = state.profile;
  const currencies = state.currencies;
  const resources = state.resources;
  const positions = Object.values(state.positions);
  const page = getPageContent(screen, state);

  return (
    <PiratePhoneFrame
      title={page.title}
      subtitle="AG3NT_OS/PIRAT3 MODULE"
      onBack={() => navigate("deck")}
      onMenu={openMenu}
      cityBand={false}
      contentStyle={styles.content}
    >
      <Panel title={page.title} active>
        {page.lines.map((line) => (
          <DeckText key={line} tone="muted" style={styles.pageLine}>{line}</DeckText>
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
            {positions.length === 0 ? <Chip label="no open cargo" tone="muted" /> : null}
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
            <BracketButton label="RESET SAVE" tone="danger" onPress={reset} />
          </View>
        ) : null}

        {screen === "legal" ? (
          <DeckText tone="amber" style={styles.paragraph}>
            Current state: {(currencies?.zeroBol ?? 0).toLocaleString()} 0BOL, {Math.round(resources?.energyHours ?? 0)}h Energy. No withdrawable rewards are implemented.
          </DeckText>
        ) : null}
      </Panel>
    </PiratePhoneFrame>
  );
}

function RankLadder({ xp }: { xp: number }) {
  return (
    <View style={styles.rankList}>
      {RANKS.map((rank) => {
        const unlocked = xp >= rank.xp;
        return (
          <View key={rank.level} style={styles.rankRow}>
            <DeckText tone={unlocked ? "profit" : "locked"} style={styles.rankLevel}>{`R${rank.level}`}</DeckText>
            <DeckText tone={unlocked ? "white" : "locked"} style={styles.rankTitle}>{rank.title}</DeckText>
            <DeckText tone={unlocked ? "muted" : "locked"} style={styles.rankXp}>{`${rank.xp.toLocaleString()} XP`}</DeckText>
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
        "Wallet mode is visible. Token flows stay locked in Phase 1."
      ]
    },
    settings: {
      title: "SETTINGS",
      lines: [
        "Replay cinematic, reset local save, and keep dev identity access available.",
        "Future toggles: reduced bloom, haptics, sound, high-contrast mode."
      ]
    },
    inventory: {
      title: "INVENTORY",
      lines: [
        `${activePositions} active position slots.`,
        "Inventory capacity keeps Pirate OS constrained."
      ]
    },
    progression: {
      title: "PROGRESSION",
      lines: [
        "Rank 5 unlocks AgentOS: factions, node missions, route scanner.",
        "Rank 20 unlocks PantheonOS: territory, crews, raids, memory shards.",
        "Phase 1 keeps these visible but sealed."
      ]
    },
    rank: {
      title: "RANK",
      lines: [
        "XP comes from tutorial completion, profitable trades, and survived market events.",
        "The cyberdeck UI itself is the progression reward."
      ]
    },
    leaderboard: {
      title: "LEADERBOARD",
      lines: [
        "Local ghost board only in Phase 1.",
        "Multiplayer dominance waits for backend authority and anti-abuse rules."
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
      title: "LOGS",
      lines: [
        "BOOT OK - CHECKSUM 0x7F3A",
        "S1LKROAD port open.",
        "Echelon eAgents scanning high-Heat desks."
      ]
    },
    help: {
      title: "HELP",
      lines: [
        "Open S1LKROAD 4.0.",
        "Read news credibility and affected tickers.",
        "Buy low, sell high, manage Energy and Heat.",
        "Energy reaches zero: Dormant Mode. Trading stops until restored.",
        "Heat rises on risky trades and decays server-side over time."
      ]
    },
    legal: {
      title: "LEGAL",
      lines: [
        "0BOL is free, off-chain, and non-withdrawable.",
        "$OBOL is optional, feature flagged, and not active in Phase 1.",
        "The app does not promise earnings and does not execute real-world trades."
      ]
    }
  };

  return pages[screen] ?? { title: "MODULE", lines: ["Module unavailable in Pirate OS."] };
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md
  },
  pageLine: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.xs
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: spacing.md
  },
  pageStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md
  },
  rankList: {
    gap: spacing.sm,
    marginTop: spacing.md
  },
  rankRow: {
    minHeight: 38,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    paddingBottom: spacing.sm
  },
  rankLevel: {
    width: 34,
    fontSize: 11
  },
  rankTitle: {
    flex: 1,
    fontSize: 11
  },
  rankXp: {
    fontSize: 10
  }
});
