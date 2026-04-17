import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PiratePhoneFrame } from "@/components/pirate-os/PiratePhoneFrame";
import { useGameStore } from "@/game/store";
import { DeckText, Panel } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function BootScreen() {
  const navigate = useGameStore((store) => store.navigate);
  const [lineCount, setLineCount] = useState(1);
  const lines = [
    "AG3NT_OS/PIRAT3 v0.1.3",
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
    <PiratePhoneFrame title="BOOTING" subtitle="AG3NT_OS/PIRAT3" cityBand={false}>
      <View style={styles.wrap}>
        <DeckText tone="cyan" style={styles.title}>BOOT SEQUENCE</DeckText>
        <Panel title="boot log" active style={styles.log}>
          {lines.slice(0, lineCount).map((line) => (
            <DeckText key={line} tone={line.includes("OK") ? "profit" : "muted"} style={styles.line}>
              {`> ${line}`}
            </DeckText>
          ))}
          <DeckText tone="cyan" style={styles.cursor}>_</DeckText>
        </Panel>
      </View>
    </PiratePhoneFrame>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 490,
    justifyContent: "center",
    gap: spacing.md
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: colors.cyan
  },
  log: {
    minHeight: 250,
    gap: spacing.sm
  },
  line: {
    fontSize: 11,
    lineHeight: 17
  },
  cursor: {
    fontSize: 18
  }
});
