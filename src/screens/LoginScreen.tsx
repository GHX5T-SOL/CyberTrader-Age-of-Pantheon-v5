import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/game/store";
import { BracketButton, DeckText, Panel, Scanlines, TerminalScroll } from "@/ui/primitives";
import { colors, shadow, spacing } from "@/ui/theme";

export function LoginScreen() {
  const bootIdentity = useGameStore((store) => store.bootIdentity);
  const [handle, setHandle] = useState("ghxst.eth");

  function autogen() {
    const token = Math.random().toString(16).slice(2, 6);
    setHandle(`eid0lon_${token}`);
  }

  return (
    <SafeAreaView style={styles.root}>
      <Scanlines />
      <TerminalScroll style={styles.fullScroll}>
        <View style={styles.wrap}>
          <DeckText tone="cyan" style={styles.brand}>AG3NT_0S//PIRAT3</DeckText>
          <DeckText tone="white" style={styles.title}>IDENTIFY // EIDOLON</DeckText>
          <Panel title="identity mount" active style={styles.panel}>
            <DeckText tone="dim" style={styles.paragraph}>
              You are a rogue AI shard. The cyberdeck is your body. Pirate OS access is limited to survival metrics and S1LKROAD 4.0.
            </DeckText>
            <DeckText tone="meta" style={styles.inputLabel}>Eidolon handle</DeckText>
            <View style={styles.inputRow}>
              <TextInput
                value={handle}
                onChangeText={setHandle}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="ghxst.eth"
                placeholderTextColor={colors.phosphorGhost}
                style={styles.input}
              />
              <BracketButton label="AUTOGEN" onPress={autogen} />
            </View>
            <View style={styles.actions}>
              <BracketButton label="SOLANA WALLET" tone="primary" onPress={() => bootIdentity(handle, "web-wallet")} />
              <BracketButton label="DEV IDENTITY" onPress={() => bootIdentity(handle, "dev-identity")} />
            </View>
            <DeckText tone="amber" style={styles.legalCopy}>
              0BOL is free in-game currency and cannot be withdrawn. $OBOL is locked in Phase 1 until token, legal, and server controls exist.
            </DeckText>
          </Panel>
          <Panel title="right-margin telemetry">
            <DeckText tone="ghost">{"> wallet_mode: dev-identity fallback available"}</DeckText>
            <DeckText tone="ghost">{"> mobile_wallet_adapter: feature flagged"}</DeckText>
            <DeckText tone="ghost">{"> starting ledger: 1,000,000 0BOL"}</DeckText>
            <DeckText tone="ghost">{"> starting Energy: 72h"}</DeckText>
          </Panel>
        </View>
      </TerminalScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.voidBlack
  },
  fullScroll: {
    flex: 1
  },
  wrap: {
    padding: spacing.xl,
    gap: spacing.xl,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%"
  },
  brand: {
    fontSize: 18,
    letterSpacing: 3,
    ...shadow.cyanGlow
  },
  title: {
    fontSize: 30,
    letterSpacing: 2
  },
  panel: {
    gap: spacing.lg
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20
  },
  inputLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  input: {
    flex: 1,
    minWidth: 180,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.frameLine,
    backgroundColor: colors.voidBlack,
    color: colors.offWhite,
    paddingHorizontal: spacing.lg,
    fontFamily: "monospace",
    fontSize: 16
  },
  actions: {
    gap: spacing.md
  },
  legalCopy: {
    fontSize: 12,
    lineHeight: 18
  }
});
