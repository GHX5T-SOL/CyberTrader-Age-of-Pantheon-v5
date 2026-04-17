import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { PiratePhoneFrame } from "@/components/pirate-os/PiratePhoneFrame";
import { useGameStore } from "@/game/store";
import { BracketButton, DeckText, Panel } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function LoginScreen() {
  const bootIdentity = useGameStore((store) => store.bootIdentity);
  const [handle, setHandle] = useState("ghxst.eth");

  function autogen() {
    const token = Math.random().toString(16).slice(2, 6).toUpperCase();
    setHandle(`eid0lon_${token}`);
  }

  return (
    <PiratePhoneFrame title="IDENTIFY" subtitle="MOUNT EIDOLON ID" cityBand>
      <Panel title="identity mount" active style={styles.panel}>
        <DeckText tone="white" style={styles.title}>EIDOLON ACCESS</DeckText>
        <DeckText tone="muted" style={styles.paragraph}>
          Rogue shard detected. Pirate OS grants survival metrics, local ledger, and S1LKROAD access only.
        </DeckText>

        <DeckText tone="cyan" style={styles.inputLabel}>Eidolon handle</DeckText>
        <View style={styles.inputRow}>
          <TextInput
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="ghxst.eth"
            placeholderTextColor={colors.faint}
            style={styles.input}
          />
          <BracketButton label="GEN" onPress={autogen} style={styles.genButton} />
        </View>

        <View style={styles.actions}>
          <BracketButton label="SOLANA WALLET" tone="primary" onPress={() => bootIdentity(handle, "web-wallet")} />
          <BracketButton label="DEV IDENTITY" onPress={() => bootIdentity(handle, "dev-identity")} />
        </View>

        <DeckText tone="muted" style={styles.telemetry}>{"> starting ledger: 1,000,000 0BOL"}</DeckText>
        <DeckText tone="muted" style={styles.telemetry}>{"> starting Energy: 72h"}</DeckText>
        <DeckText tone="amber" style={styles.legalCopy}>
          $OBOL remains locked in Phase 1. No withdrawable rewards are active.
        </DeckText>
      </Panel>
    </PiratePhoneFrame>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 78,
    gap: spacing.md
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 18
  },
  inputLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  input: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    backgroundColor: "rgba(7,11,25,0.78)",
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.4
  },
  genButton: {
    minWidth: 62,
    paddingHorizontal: spacing.sm
  },
  actions: {
    gap: spacing.sm
  },
  telemetry: {
    fontSize: 10,
    lineHeight: 15
  },
  legalCopy: {
    fontSize: 10,
    lineHeight: 16
  }
});
