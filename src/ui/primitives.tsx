import * as Haptics from "expo-haptics";
import React, { PropsWithChildren, useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from "react-native-svg";
import { CommodityGlyph } from "@/components/pirate-os/CommodityGlyph";
import { COMMODITIES } from "@/game/constants";
import { getCommodity } from "@/game/engine";
import type { CommodityMarketState, MarketCandle } from "@/game/types";
import { colors, glow, radii, spacing } from "./theme";

const mono = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });

export function DeckText({
  children,
  style,
  tone = "normal",
  numberOfLines
}: PropsWithChildren<{ style?: StyleProp<TextStyle>; tone?: keyof typeof toneStyles; numberOfLines?: number }>) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.text, toneStyles[tone], style]}>
      {children}
    </Text>
  );
}

export function Panel({
  title,
  children,
  style,
  danger,
  active,
  locked
}: PropsWithChildren<{
  title?: string;
  style?: StyleProp<ViewStyle>;
  danger?: boolean;
  active?: boolean;
  locked?: boolean;
}>) {
  return (
    <View
      style={[
        styles.panel,
        active && styles.panelActive,
        danger && styles.panelDanger,
        locked && styles.panelLocked,
        style
      ]}
    >
      {title ? <DeckText tone={danger ? "danger" : active ? "cyan" : "muted"} style={styles.panelTitle}>{title}</DeckText> : null}
      {children}
    </View>
  );
}

export function BracketButton({
  label,
  onPress,
  disabled,
  tone = "normal",
  style
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  tone?: "normal" | "primary" | "danger" | "amber";
  style?: StyleProp<ViewStyle>;
}) {
  async function press() {
    if (disabled) {
      return;
    }
    await Haptics.selectionAsync().catch(() => undefined);
    onPress?.();
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={press}
      style={({ pressed }) => [
        styles.button,
        tone === "primary" && styles.buttonPrimary,
        tone === "danger" && styles.buttonDanger,
        tone === "amber" && styles.buttonAmber,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style
      ]}
    >
      <DeckText
        style={[
          styles.buttonText,
          tone === "primary" && styles.buttonTextPrimary,
          tone === "danger" && styles.buttonTextDanger,
          tone === "amber" && styles.buttonTextAmber,
          disabled && styles.buttonTextDisabled
        ]}
      >
        {label}
      </DeckText>
    </Pressable>
  );
}

export function Chip({ label, tone = "normal" }: { label: string; tone?: keyof typeof toneStyles }) {
  return (
    <View style={styles.chip}>
      <DeckText tone={tone} style={styles.chipText}>{label}</DeckText>
    </View>
  );
}

export function Meter({
  label,
  value,
  max = 100,
  tone = "normal"
}: {
  label: string;
  value: number;
  max?: number;
  tone?: keyof typeof toneStyles;
}) {
  const slots = 8;
  const filled = Math.max(0, Math.min(slots, Math.round((value / max) * slots)));
  return (
    <View style={styles.meter}>
      <DeckText tone="muted" style={styles.meterLabel}>{label}</DeckText>
      <DeckText tone={tone} style={styles.meterBar}>{"|".repeat(filled)}{".".repeat(slots - filled)}</DeckText>
      <DeckText tone="white" style={styles.meterValue}>{Math.round(value)}</DeckText>
    </View>
  );
}

export function MetricOrb({
  label,
  value,
  suffix,
  percent,
  tone = colors.cyan
}: {
  label: string;
  value: string;
  suffix?: string;
  percent: number;
  tone?: string;
}) {
  const size = 118;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.max(0, Math.min(percent, 1)));

  return (
    <View style={styles.orb}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.lineSoft} strokeWidth={stroke} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tone}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="transparent"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.orbText}>
        <DeckText style={[styles.orbValue, { color: tone }]}>{value}</DeckText>
        <DeckText tone="muted" style={styles.orbLabel}>{suffix ? `${label} ${suffix}` : label}</DeckText>
      </View>
    </View>
  );
}

export function Sparkline({
  points,
  width = 72,
  height = 34,
  tone = colors.magenta
}: {
  points: number[];
  width?: number;
  height?: number;
  tone?: string;
}) {
  const polyline = useMemo(() => {
    if (points.length === 0) {
      return "";
    }
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return points.map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [height, points, width]);

  return (
    <Svg width={width} height={height}>
      <Polyline points={polyline} fill="none" stroke={tone} strokeWidth="2" />
    </Svg>
  );
}

export function PriceChart({
  market,
  selectedTicker
}: {
  market: CommodityMarketState;
  selectedTicker: string;
}) {
  const width = 340;
  const height = 184;
  const chartCandles = (market.candles?.length ? market.candles : historyToCandles(market.history)).slice(-18);
  const min = Math.min(...chartCandles.map((candle) => candle.low));
  const max = Math.max(...chartCandles.map((candle) => candle.high));
  const range = max - min || 1;
  const plotLeft = 14;
  const plotRight = width - 46;
  const plotTop = 22;
  const plotBottom = height - 30;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const slot = plotWidth / Math.max(chartCandles.length, 1);
  const candleWidth = Math.max(4, Math.min(9, slot * 0.5));
  const yFor = (price: number) => plotTop + (1 - (price - min) / range) * plotHeight;
  const currentY = yFor(market.currentPrice);
  const volumeMax = Math.max(...chartCandles.map((candle) => candle.volume), 1);

  return (
    <View style={styles.chartBox}>
      <View style={styles.chartTop}>
        <DeckText tone="muted" style={styles.chartTitle}>{selectedTicker} OHLC</DeckText>
        <DeckText tone="cyan" style={styles.chartTitle}>TICK {market.lastTick}</DeckText>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {[0, 1, 2, 3].map((line) => (
          <Line key={line} x1={plotLeft} y1={plotTop + line * (plotHeight / 3)} x2={plotRight} y2={plotTop + line * (plotHeight / 3)} stroke={colors.lineSoft} strokeWidth="1" />
        ))}
        <Line x1={plotLeft} y1={currentY} x2={plotRight} y2={currentY} stroke="rgba(168,85,247,0.34)" strokeWidth="1" strokeDasharray="4 4" />
        {chartCandles.map((candle, index) => {
          const up = candle.close >= candle.open;
          const tone = up ? colors.cyan : colors.magenta;
          const x = plotLeft + slot * index + slot / 2;
          const bodyTop = yFor(Math.max(candle.open, candle.close));
          const bodyBottom = yFor(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(2, bodyBottom - bodyTop);
          const volumeHeight = Math.max(2, (candle.volume / volumeMax) * 16);

          return (
            <React.Fragment key={`${candle.tick}-${index}`}>
              <Line x1={x} y1={yFor(candle.high)} x2={x} y2={yFor(candle.low)} stroke={tone} strokeWidth="1.2" />
              <Rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                rx="1"
                fill={up ? "rgba(34,211,238,0.28)" : "rgba(236,72,153,0.30)"}
                stroke={tone}
                strokeWidth="1.2"
              />
              <Rect
                x={x - candleWidth / 2}
                y={height - 10 - volumeHeight}
                width={candleWidth}
                height={volumeHeight}
                fill={up ? "rgba(34,211,238,0.18)" : "rgba(236,72,153,0.18)"}
              />
            </React.Fragment>
          );
        })}
        <Circle cx={plotRight + 4} cy={currentY} r="3.4" stroke={colors.magenta} strokeWidth="1.6" fill="transparent" />
        <SvgText x={plotRight + 10} y={plotTop + 8} fill={colors.muted} fontSize="9" fontFamily="monospace">
          {Math.round(max).toLocaleString()}
        </SvgText>
        <SvgText x={plotRight + 10} y={plotBottom} fill={colors.muted} fontSize="9" fontFamily="monospace">
          {Math.round(min).toLocaleString()}
        </SvgText>
      </Svg>
    </View>
  );
}

function historyToCandles(history: number[]): MarketCandle[] {
  return history.map((close, index) => {
    const open = history[index - 1] ?? close;
    const high = Math.max(open, close) * 1.015;
    const low = Math.max(0.01, Math.min(open, close) * 0.985);

    return {
      tick: index,
      open,
      high,
      low,
      close,
      volume: 1000 + index * 80
    };
  });
}

export function CommodityRow({
  marketState,
  selected,
  compact,
  onPress
}: {
  marketState: CommodityMarketState;
  selected?: boolean;
  compact?: boolean;
  onPress?: () => void;
}) {
  const commodity = getCommodity(marketState.commodityId);
  const change = marketState.previousPrice === 0
    ? 0
    : ((marketState.currentPrice - marketState.previousPrice) / marketState.previousPrice) * 100;
  const up = change >= 0;

  return (
    <Pressable onPress={onPress} style={[styles.commodity, selected && styles.commoditySelected]}>
      <CommodityGlyph ticker={commodity.ticker} size={34} active={selected || up} />
      <View style={styles.commodityName}>
        <DeckText tone="white" style={styles.commodityLabel} numberOfLines={1}>{commodity.name.toUpperCase()}</DeckText>
        {!compact ? <DeckText tone="muted" style={styles.commodityMeta}>{commodity.ticker} / {commodity.rarity}</DeckText> : <Sparkline points={marketState.history.slice(-12)} width={92} height={20} tone={up ? colors.cyan : colors.magenta} />}
      </View>
      <View style={styles.priceBlock}>
        <DeckText tone="white" style={styles.price}>${marketState.currentPrice.toLocaleString()}</DeckText>
        <DeckText tone={up ? "profit" : "danger"} style={styles.change}>{`${up ? "+" : ""}${change.toFixed(1)}%`}</DeckText>
      </View>
    </Pressable>
  );
}

export function Scanlines() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.vignette} />
    </View>
  );
}

export function TerminalScroll({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <ScrollView style={style} contentContainerStyle={styles.terminalContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const toneStyles = StyleSheet.create({
  normal: { color: colors.text },
  dim: { color: colors.muted },
  muted: { color: colors.muted },
  ghost: { color: colors.faint },
  cyan: { color: colors.cyan },
  amber: { color: colors.warning },
  danger: { color: colors.loss },
  profit: { color: colors.profit },
  violet: { color: colors.violet },
  white: { color: colors.text },
  meta: { color: colors.muted },
  locked: { color: colors.locked }
});

const styles = StyleSheet.create({
  text: {
    fontFamily: mono,
    color: colors.text,
    includeFontPadding: false
  },
  panel: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    borderRadius: radii.sm,
    padding: spacing.md,
    gap: spacing.md
  },
  panelActive: {
    borderColor: colors.cyan,
    ...glow.cyanBox
  },
  panelDanger: {
    borderColor: colors.magenta,
    ...glow.magentaBox
  },
  panelLocked: {
    borderColor: colors.locked
  },
  panelTitle: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  button: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: "rgba(9,13,30,0.70)"
  },
  buttonPrimary: {
    borderColor: colors.violet,
    backgroundColor: "rgba(109,40,217,0.92)",
    ...glow.magentaBox
  },
  buttonDanger: {
    borderColor: colors.magenta,
    backgroundColor: "rgba(236,72,153,0.16)"
  },
  buttonAmber: {
    borderColor: colors.warning,
    backgroundColor: "rgba(255,200,87,0.12)"
  },
  buttonDisabled: {
    borderColor: colors.locked,
    backgroundColor: colors.deepNavy
  },
  buttonPressed: {
    opacity: 0.78
  },
  buttonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: colors.text
  },
  buttonTextPrimary: {
    color: colors.text,
    ...glow.magentaText
  },
  buttonTextDanger: {
    color: colors.magenta
  },
  buttonTextAmber: {
    color: colors.warning
  },
  buttonTextDisabled: {
    color: colors.locked
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.panelSoft
  },
  chipText: {
    fontSize: 10,
    letterSpacing: 1
  },
  meter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  meterLabel: {
    fontSize: 10,
    minWidth: 34
  },
  meterBar: {
    fontSize: 12
  },
  meterValue: {
    fontSize: 10,
    minWidth: 26,
    textAlign: "right"
  },
  orb: {
    width: 118,
    height: 118,
    alignItems: "center",
    justifyContent: "center"
  },
  orbText: {
    position: "absolute",
    alignItems: "center",
    gap: 3
  },
  orbValue: {
    fontSize: 29,
    letterSpacing: 1
  },
  orbLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  chartBox: {
    width: "100%",
    minHeight: 210,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: "rgba(3,6,15,0.76)",
    padding: spacing.md
  },
  chartTop: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  chartTitle: {
    fontSize: 10,
    letterSpacing: 1
  },
  commodity: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: "rgba(7,11,25,0.78)",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  commoditySelected: {
    borderColor: colors.cyan
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panelSoft
  },
  iconText: {
    fontSize: 13
  },
  commodityName: {
    flex: 1,
    minWidth: 0,
    gap: 3
  },
  commodityLabel: {
    fontSize: 12,
    letterSpacing: 0.8
  },
  commodityMeta: {
    fontSize: 10,
    textTransform: "uppercase"
  },
  priceBlock: {
    alignItems: "flex-end",
    minWidth: 72
  },
  price: {
    fontSize: 14
  },
  change: {
    fontSize: 11
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)"
  },
  terminalContent: {
    paddingBottom: spacing.xxl
  }
});

export const commodityUniverse = COMMODITIES;
