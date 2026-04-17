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
    maxWidth: 322,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.violet,
    borderRadius: 10,
    backgroundColor: "rgba(6,10,24,0.94)",
    padding: spacing.md
  }
});
