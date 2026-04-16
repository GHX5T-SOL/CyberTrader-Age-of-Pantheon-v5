import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useGameStore } from "@/game/store";
import type { ScreenId } from "@/game/types";
import { BracketButton, DeckText } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

const ENTRIES: { key: string; label: string; screen: ScreenId; status: string }[] = [
  { key: "P", label: "Profile", screen: "profile", status: "OK" },
  { key: "S", label: "Settings", screen: "settings", status: "OK" },
  { key: "I", label: "Inventory", screen: "inventory", status: "OK" },
  { key: "U", label: "Progression / OS Upgrades", screen: "progression", status: "RANK 5" },
  { key: "R", label: "Rank", screen: "rank", status: "LIVE" },
  { key: "L", label: "Leaderboard", screen: "leaderboard", status: "LOCAL" },
  { key: "G", label: "Rewards", screen: "rewards", status: "LOCKED" },
  { key: "N", label: "Notifications", screen: "notifications", status: "3" },
  { key: "H", label: "Help / How To Play", screen: "help", status: "NEW" },
  { key: "E", label: "Legal / Wallet Disclosures", screen: "legal", status: "READ" }
];

export function SystemMenu({ close }: { close: () => void }) {
  const navigate = useGameStore((store) => store.navigate);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.dim} onPress={close} />
      <View style={styles.panel}>
        <DeckText tone="cyan" style={styles.title}>:: SYSTEM MENU ::</DeckText>
        {ENTRIES.map((entry) => (
          <Pressable
            key={entry.key}
            style={styles.row}
            onPress={() => {
              navigate(entry.screen);
              close();
            }}
          >
            <DeckText tone="white">{`[${entry.key}] ${entry.label}`}</DeckText>
            <DeckText tone="amber">{entry.status}</DeckText>
          </Pressable>
        ))}
        <View style={styles.footer}>
          <DeckText tone="ghost">Ag3nt_0S//pIRAT3 v0.7.3c</DeckText>
          <BracketButton label="ESC CLOSE" onPress={close} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  dim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)"
  },
  panel: {
    width: "88%",
    maxWidth: 420,
    backgroundColor: colors.voidBlack,
    borderLeftWidth: 1,
    borderLeftColor: colors.magenta,
    padding: spacing.lg,
    gap: spacing.sm
  },
  title: {
    fontSize: 22,
    letterSpacing: 1.5,
    marginBottom: spacing.md
  },
  row: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  footer: {
    marginTop: "auto",
    gap: spacing.md
  }
});
