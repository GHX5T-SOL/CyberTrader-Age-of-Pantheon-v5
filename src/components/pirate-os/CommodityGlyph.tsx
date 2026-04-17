import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { colors } from "@/ui/theme";

const commodityArt: Record<string, ImageSourcePropType> = {
  FDST: require("../../assets/commodities/fdst.png"),
  PGAS: require("../../assets/commodities/pgas.png"),
  NGLS: require("../../assets/commodities/ngls.png"),
  HXMD: require("../../assets/commodities/hxmd.png"),
  VBLO: require("../../assets/commodities/vblo.png"),
  ORES: require("../../assets/commodities/ores.png"),
  VTAB: require("../../assets/commodities/vtab.png"),
  NDST: require("../../assets/commodities/ndst.png"),
  PCRT: require("../../assets/commodities/pcrt.png"),
  GCHP: require("../../assets/commodities/gchp.png")
};

const tickerAccent: Record<string, string> = {
  FDST: colors.violet,
  PGAS: colors.cyan,
  NGLS: colors.violet,
  HXMD: colors.magenta,
  VBLO: colors.magenta,
  ORES: colors.cyan,
  VTAB: colors.violet,
  NDST: colors.magenta,
  PCRT: colors.cyan,
  GCHP: colors.violet
};

export function CommodityGlyph({
  ticker,
  size = 34,
  active = false,
  wide = false
}: {
  ticker: string;
  size?: number;
  active?: boolean;
  wide?: boolean;
}) {
  const accent = tickerAccent[ticker] ?? colors.violet;
  const source = commodityArt[ticker];
  const width = wide ? Math.round(size * 1.55) : size;

  return (
    <View
      style={[
        styles.frame,
        {
          width,
          height: size,
          borderColor: active ? accent : "rgba(168,85,247,0.24)",
          shadowColor: accent
        },
        active && styles.frameActive
      ]}
    >
      {source ? <Image source={source} resizeMode="cover" style={styles.image} /> : null}
      <View pointerEvents="none" style={[styles.innerGlow, { borderColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "rgba(8,12,28,0.82)",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }
  },
  frameActive: {
    shadowOpacity: 0.38,
    shadowRadius: 12
  },
  image: {
    width: "100%",
    height: "100%"
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.18
  }
});
