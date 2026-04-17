import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PiratePhoneFrame } from "@/components/pirate-os/PiratePhoneFrame";
import { useGameStore } from "@/game/store";
import { BracketButton, DeckText } from "@/ui/primitives";
import { colors, glow, spacing } from "@/ui/theme";

export function IntroScreen() {
  const navigate = useGameStore((store) => store.navigate);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PiratePhoneFrame title="CYBERTRADER" subtitle="AGE OF PANTHEON" cityBand={false}>
      <View style={styles.center}>
        <DeckText tone="cyan" style={styles.micro}>01001011 01100101 0x7F3A</DeckText>
        <DeckText tone="white" style={styles.title}>AGE OF PANTHEON</DeckText>
        <DeckText tone="cyan" style={styles.flagGlyph}>
          {"     /########\\\n    /## ____ ##\\\n   |## | oo | ##|\n   |## | -- | ##|\n   |## |____| ##|\n    \\###____###/\n      \\######/\n    BLACK FLAG\n      CURSOR"}
        </DeckText>
        <DeckText tone="white" style={styles.loreLine}>
          2077. Pantheon shattered. You are one surviving shard.
        </DeckText>
        <View style={styles.bootLines}>
          <DeckText tone="muted" style={styles.line}>{"> ESTABLISHING SYSLINK .... OK"}</DeckText>
          <DeckText tone="muted" style={styles.line}>{"> ROUTING VIA ONION RELAY . OK"}</DeckText>
          <DeckText tone="muted" style={styles.line}>{"> MOUNTING /dev/tty ....... OK"}</DeckText>
          <DeckText tone="amber" style={styles.line}>{"> ROOTKIT CHANNEL ......... LIVE"}</DeckText>
        </View>
        <BracketButton label="ENTER SIGNAL" tone="primary" onPress={() => navigate("login")} style={styles.primaryAction} />
        {canSkip ? <BracketButton label="SKIP" onPress={() => navigate("login")} style={styles.skipAction} /> : null}
      </View>
    </PiratePhoneFrame>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  micro: {
    fontSize: 10,
    letterSpacing: 1.5,
    opacity: 0.78
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: 3,
    textAlign: "center",
    ...glow.cyanText
  },
  flagGlyph: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
    color: colors.cyan
  },
  loreLine: {
    marginTop: spacing.sm,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22
  },
  bootLines: {
    alignSelf: "stretch",
    gap: spacing.xs,
    marginTop: spacing.md
  },
  line: {
    fontSize: 11,
    lineHeight: 16
  },
  primaryAction: {
    alignSelf: "stretch",
    marginTop: spacing.md
  },
  skipAction: {
    alignSelf: "stretch"
  }
});
