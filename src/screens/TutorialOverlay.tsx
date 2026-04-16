import React from "react";
import { StyleSheet, View } from "react-native";
import { useGameStore } from "@/game/store";
import { BracketButton, DeckText } from "@/ui/primitives";
import { colors, radii, spacing } from "@/ui/theme";

export function TutorialOverlay() {
  const { state, advanceTutorial, navigate, marketTick } = useGameStore();
  const step = state.game.tutorialStep;

  if (step === "complete") {
    return null;
  }

  const copyByStep = {
    boot: "Boot the pirate OS.",
    metrics: "Energy keeps you awake. Heat attracts eAgents.",
    "enter-market": "Open S1LKROAD 4.0 for the first trade.",
    "first-buy": "Buy a small position.",
    "tick-news": "Advance one market signal.",
    "first-sell": "Sell to realize PnL.",
    complete: ""
  } as const;

  return (
    <View style={styles.overlay}>
      <DeckText tone="white" style={styles.text}>{copyByStep[step]}</DeckText>
      {step === "enter-market" ? <BracketButton label="OPEN" tone="primary" onPress={() => navigate("s1lkroad")} style={styles.action} /> : null}
      {step === "tick-news" ? <BracketButton label="TICK" tone="primary" onPress={marketTick} style={styles.action} /> : null}
      {step !== "enter-market" && step !== "tick-news" ? <BracketButton label="OK" onPress={advanceTutorial} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    minHeight: 54,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(12,16,32,0.94)",
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  text: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17
  },
  action: {
    minHeight: 38,
    paddingHorizontal: spacing.md
  }
});
