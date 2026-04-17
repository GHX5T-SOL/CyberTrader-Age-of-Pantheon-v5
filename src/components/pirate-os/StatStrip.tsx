import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

type StatStripProps = {
  zeroBol: string;
  obolStatus: string;
  rank: string;
  onBuyEnergy?: () => void;
};

const webBackdrop = Platform.OS === "web"
  ? ({ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" } as Record<string, string>)
  : {};

export function StatStrip({ zeroBol, obolStatus, rank, onBuyEnergy }: StatStripProps) {
  const rows = [
    { label: "0BOL", value: zeroBol },
    { label: "$OBOL", value: obolStatus },
    { label: "RANK", value: rank }
  ];

  return (
    <View style={styles.card}>
      {rows.map((row, index) => (
        <View key={row.label} style={[styles.row, index !== rows.length - 1 && styles.rowBorder]}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value} numberOfLines={1}>{row.value}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.energyLinkWrap} onPress={onBuyEnergy} activeOpacity={0.78}>
        <Text style={styles.energyLink}>Buy Energy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...webBackdrop,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.panel
  },
  row: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line
  },
  label: {
    color: t.textMuted,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  value: {
    flex: 1,
    color: t.text,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right"
  },
  energyLinkWrap: {
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 10
  },
  energyLink: {
    color: t.cyan,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6
  }
});
