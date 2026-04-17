import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

type SignalCardProps = {
  title: string;
  body: string;
  ageLabel?: string;
};

const webBackdrop = Platform.OS === "web"
  ? ({ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" } as Record<string, string>)
  : {};

export function SignalCard({ title, body, ageLabel = "2 min ago" }: SignalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.kicker}>Live Signal</Text>
        <Text style={styles.age}>{ageLabel}</Text>
      </View>
      <View style={styles.bodyRow}>
        <View style={styles.copy}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.body} numberOfLines={1}>{body}</Text>
        </View>
        <Svg width={68} height={32} style={styles.sparkline}>
          <Path
            d="M2 25 L16 25 L23 24 L30 25 L37 12 L42 26 L49 22 L55 24 L62 23 L66 24"
            fill="none"
            stroke={t.magenta}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...webBackdrop,
    backgroundColor: "rgba(6,10,24,0.74)",
    borderWidth: 1,
    borderColor: "rgba(236,72,153,0.64)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: "hidden"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  kicker: {
    color: t.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  age: {
    color: t.textMuted,
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1
  },
  bodyRow: {
    marginTop: 9,
    minHeight: 45
  },
  copy: {
    minWidth: 0,
    paddingRight: 58
  },
  sparkline: {
    position: "absolute",
    right: 0,
    bottom: -1
  },
  title: {
    color: t.text,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  body: {
    marginTop: 6,
    color: t.textDim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    lineHeight: 13,
    textTransform: "uppercase"
  }
});
