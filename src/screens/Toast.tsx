import React from "react";
import { StyleSheet, View } from "react-native";
import { DeckText } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export function Toast({ message }: { message: string }) {
  return (
    <View style={styles.toast}>
      <DeckText tone="amber">{`> ${message}`}</DeckText>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 72,
    borderWidth: 1,
    borderColor: colors.signalAmber,
    backgroundColor: colors.voidBlack,
    padding: spacing.md
  }
});
