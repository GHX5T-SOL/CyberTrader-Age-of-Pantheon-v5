import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CommodityGlyph } from "./CommodityGlyph";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

type MarketPreviewRowProps = {
  symbol: string;
  name: string;
  price: string;
  changePct: string;
  positive?: boolean;
  onPress?: () => void;
};

const sparkUp = "M2 15 L12 13 L23 14 L34 10 L45 12 L56 11";
const sparkDown = "M2 9 L12 10 L23 16 L34 13 L45 14 L56 16";

export function MarketPreviewRow({
  symbol,
  name,
  price,
  changePct,
  positive = true,
  onPress
}: MarketPreviewRowProps) {
  const lineColor = positive ? t.cyan : t.magenta;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <CommodityGlyph ticker={symbol} size={31} active={positive} />
        <View style={styles.copy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>

      <View style={styles.center} pointerEvents="none">
        <Svg width={56} height={20}>
          <Path
            d={positive ? sparkUp : sparkDown}
            fill="none"
            stroke={lineColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{price}</Text>
        <Text style={[styles.change, { color: lineColor }]}>
          {positive ? "+" : ""}
          {changePct}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    paddingHorizontal: 9,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    borderRadius: 7,
    backgroundColor: "rgba(7,11,25,0.78)"
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.1
  },
  copy: {
    gap: 2,
    marginLeft: 8
  },
  name: {
    color: t.text,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  symbol: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  center: {
    flex: 0.54,
    alignItems: "center"
  },
  right: {
    flex: 0.82,
    alignItems: "flex-end"
  },
  price: {
    color: t.text,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3
  },
  change: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "900"
  }
});
