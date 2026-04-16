import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/game/store";
import { DeckText, Panel, Scanlines } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function BootScreen() {
  const navigate = useGameStore((store) => store.navigate);
  const [lineCount, setLineCount] = useState(1);
  const lines = [
    "AG3NT_0S//PIRAT3 v0.7.3c",
    "MOUNT /dev/tty-pantheon",
    "CHECK WALLET SESSION",
    "ALLOCATE 1,000,000 0BOL",
    "SPIN UP ENERGY TIMER",
    "S1LKROAD 4.0 PORT OPEN",
    "BOOT OK - STREAM LIVE"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLineCount((count) => Math.min(lines.length, count + 1));
    }, 220);
    const done = setTimeout(() => navigate("deck"), 2100);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [lines.length, navigate]);

  return (
    <SafeAreaView style={styles.root}>
      <Scanlines />
      <View style={styles.screen}>
        <DeckText tone="cyan" style={styles.title}>BOOTING PIRATE OS</DeckText>
        <Panel title="boot log" active style={styles.log}>
          {lines.slice(0, lineCount).map((line) => (
            <DeckText key={line} tone={line.includes("OK") ? "profit" : "dim"} style={styles.line}>
              {`> ${line}`}
            </DeckText>
          ))}
          <DeckText tone="normal" style={styles.cursor}>#</DeckText>
        </Panel>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.voidBlack
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg
  },
  title: {
    fontSize: 26,
    letterSpacing: 2
  },
  log: {
    minHeight: 260,
    gap: spacing.sm
  },
  line: {
    fontSize: 15,
    lineHeight: 21
  },
  cursor: {
    fontSize: 18
  }
});
