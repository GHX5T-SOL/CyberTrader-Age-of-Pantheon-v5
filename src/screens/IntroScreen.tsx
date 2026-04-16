import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/game/store";
import { BracketButton, DeckText, Scanlines } from "@/ui/primitives";
import { colors, shadow, spacing } from "@/ui/theme";

export function IntroScreen() {
  const navigate = useGameStore((store) => store.navigate);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Scanlines />
      <View style={styles.noise}>
        <DeckText tone="ghost">01001011 01100101 01110000 0x7F3A 11100100 00110101</DeckText>
      </View>
      <View style={styles.center}>
        <DeckText tone="cyan" style={styles.brand}>CYBERTRADER</DeckText>
        <DeckText tone="white" style={styles.title}>AGE OF PANTHEON</DeckText>
        <DeckText tone="normal" style={styles.flagGlyph}>
          {"      /########\\\n     /## ____ ##\\\n    |## | oo | ##|\n    |## | -- | ##|\n    |## |____| ##|\n     \\###____###/\n       \\######/\n      BLACK FLAG\n        CURSOR"}
        </DeckText>
        <DeckText tone="white" style={styles.loreLine}>
          2077. Pantheon shattered. You are one surviving shard.
        </DeckText>
        <View style={styles.bootLines}>
          <DeckText tone="dim">{"> ESTABLISHING SYSLINK ....... OK"}</DeckText>
          <DeckText tone="dim">{"> ROUTING VIA ONION RELAY .... OK"}</DeckText>
          <DeckText tone="dim">{"> MOUNTING /dev/tty-pantheon . OK"}</DeckText>
          <DeckText tone="amber">{"> ROOTKIT CHANNEL STABILIZING  LIVE"}</DeckText>
        </View>
        <BracketButton label="ENTER SIGNAL" tone="primary" onPress={() => navigate("login")} />
      </View>
      {canSkip ? (
        <View style={styles.skip}>
          <BracketButton label="SKIP >>" onPress={() => navigate("login")} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.voidBlack
  },
  noise: {
    padding: spacing.lg,
    opacity: 0.7
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg
  },
  brand: {
    fontSize: 18,
    letterSpacing: 3,
    ...shadow.cyanGlow
  },
  title: {
    fontSize: 34,
    letterSpacing: 3,
    textAlign: "center"
  },
  flagGlyph: {
    fontSize: 15,
    lineHeight: 17,
    textAlign: "center",
    ...shadow.greenGlow
  },
  loreLine: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24
  },
  bootLines: {
    gap: spacing.xs,
    alignSelf: "stretch",
    maxWidth: 520
  },
  skip: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg
  }
});
