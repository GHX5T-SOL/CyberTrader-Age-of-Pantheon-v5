import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

type HeaderChipProps = {
  label: string;
  value: string;
};

export function HeaderChip({ label, value }: HeaderChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.panel,
    minWidth: 110,
    flex: 1
  },
  label: {
    color: t.textMuted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2
  },
  value: {
    marginTop: 4,
    color: t.text,
    fontSize: 13,
    fontWeight: "700"
  }
});
