import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, FeGaussianBlur, FeMerge, FeMergeNode, Filter } from "react-native-svg";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

type StatusRingProps = {
  label: string;
  valueText: string;
  progress: number;
  color: string;
  size?: number;
  subLabel?: string;
  compact?: boolean;
};

export const StatusRing = memo(function StatusRing({
  label,
  valueText,
  progress,
  color,
  size = 116,
  subLabel,
  compact = false
}: StatusRingProps) {
  const strokeWidth = compact ? 5 : 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dashOffset = circumference * (1 - clamped);

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <Filter id={`glow-${label}`}>
            <FeGaussianBlur stdDeviation={compact ? "3.8" : "3.2"} result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          filter={`url(#glow-${label})`}
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.value, compact && styles.valueCompact]}>{valueText}</Text>
        <Text style={[styles.label, { color }]}>{label}</Text>
        {!!subLabel && <Text style={styles.sub}>{subLabel}</Text>}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  wrapCompact: {
    transform: [{ scale: 0.96 }]
  },
  content: {
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    color: t.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.4
  },
  valueCompact: {
    fontSize: 22
  },
  label: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  sub: {
    marginTop: 2,
    color: t.textMuted,
    fontSize: 10,
    letterSpacing: 0.6
  }
});
