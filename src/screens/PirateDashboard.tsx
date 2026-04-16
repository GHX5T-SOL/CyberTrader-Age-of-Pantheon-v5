import React from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { COMMODITIES, STARTING_ENERGY_HOURS } from "@/game/constants";
import { getRankForXp } from "@/game/engine";
import { useGameStore } from "@/game/store";
import {
  BracketButton,
  Chip,
  CommodityRow,
  DeckText,
  MetricOrb,
  Panel,
  Sparkline,
  TerminalScroll
} from "@/ui/primitives";
import { colors, glow, radii, spacing } from "@/ui/theme";

type Props = {
  openMenu: () => void;
};

export function PirateDashboard({ openMenu }: Props) {
  const { state, navigate, buyEnergy } = useGameStore();
  const { width } = useWindowDimensions();
  const resources = state.resources;
  const currencies = state.currencies;
  const profile = state.profile;
  const latestNews = state.news[0];
  const selectedMarket = state.market[state.game.selectedCommodityId];
  const nextRank = getRankForXp(profile?.xp ?? 0).nextXp;
  const marketRows = COMMODITIES.slice(0, 4).map((commodity) => state.market[commodity.id]);
  const phoneWidth = Math.min(width, 430);

  return (
    <TerminalScroll>
      <View style={[styles.phone, { maxWidth: phoneWidth }]}>
        <StatusStrip />

        <View style={styles.header}>
          <View>
            <DeckText tone="violet" style={styles.osName}>AG3NT_OS//PIRAT3</DeckText>
            <DeckText tone="muted" style={styles.eid}>EIDOLON ID: 7X9...A3F</DeckText>
          </View>
          <Pressable onPress={openMenu} style={styles.menuButton}>
            <DeckText tone="cyan" style={styles.menuIcon}>III</DeckText>
          </Pressable>
        </View>

        <CityBanner />

        <View style={styles.meterRow}>
          <MetricOrb
            label="energy"
            value={`${Math.round(resources?.energyHours ?? 0)}h`}
            percent={(resources?.energyHours ?? 0) / STARTING_ENERGY_HOURS}
            tone={colors.cyan}
          />
          <MetricOrb
            label="heat"
            value={`${Math.round(resources?.heat ?? 0)}%`}
            percent={(resources?.heat ?? 0) / 100}
            tone={colors.magenta}
          />
        </View>

        <Panel title="ACTIVE SIGNAL" danger style={styles.signalCard}>
          <View style={styles.signalTop}>
            <View style={styles.signalCopy}>
              <DeckText tone="violet" style={styles.signalLabel}>ACTIVE SIGNAL</DeckText>
              <DeckText tone="muted" style={styles.signalTime}>2 MIN AGO</DeckText>
              <DeckText tone="cyan" style={styles.signalHeadline}>
                {latestNews?.headline.toUpperCase() ?? "NEON PLAZA SUPPLY FLUCTUATION"}
              </DeckText>
              <DeckText tone="muted" style={styles.signalBody} numberOfLines={1}>
                {latestNews?.body ?? "Ghost chips demand rising"}
              </DeckText>
            </View>
            {selectedMarket ? <Sparkline points={selectedMarket.history} width={86} height={46} tone={colors.magenta} /> : null}
          </View>
        </Panel>

        <View style={styles.sectionHeader}>
          <DeckText tone="cyan" style={styles.marketTitle}>S1LKROAD 4.0</DeckText>
          <DeckText tone="muted" style={styles.marketLive}>LIVE MARKETS</DeckText>
        </View>

        <View style={styles.marketList}>
          {marketRows.map((item) => (
            <CommodityRow
              key={item.commodityId}
              marketState={item}
              compact
              onPress={() => {
                useGameStore.getState().selectCommodity(item.commodityId);
                navigate("s1lkroad");
              }}
            />
          ))}
        </View>

        <View style={styles.primaryActions}>
          <BracketButton label="BUY ENERGY" tone="amber" onPress={() => buyEnergy(6)} style={styles.secondaryButton} />
          <BracketButton label="ENTER SILKROAD" tone="primary" onPress={() => navigate("s1lkroad")} style={styles.mainButton} />
        </View>

        <View style={styles.footer}>
          <DeckText tone="ghost">// PIRATE OS v0.1.3</DeckText>
          <Chip label={`${(currencies?.zeroBol ?? 0).toLocaleString()} 0BOL`} tone="white" />
          <Chip label={`RANK ${profile?.rankLevel ?? 0} ${profile?.rankTitle ?? "Boot Ghost"}`} tone="muted" />
        </View>
      </View>
    </TerminalScroll>
  );
}

function StatusStrip() {
  return (
    <View style={styles.statusStrip}>
      <DeckText tone="white" style={styles.statusText}>9:41</DeckText>
      <DeckText tone="white" style={styles.statusText}>LTE  WIFI  BAT</DeckText>
    </View>
  );
}

function CityBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerGlowCyan} />
      <View style={styles.bannerGlowMagenta} />
      <View style={styles.skyline}>
        {Array.from({ length: 18 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.tower,
              {
                height: 18 + (index % 5) * 11,
                opacity: 0.42 + (index % 3) * 0.12,
                backgroundColor: index % 4 === 0 ? colors.magenta : colors.cyan
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.deckShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    width: "100%",
    alignSelf: "center",
    minHeight: "100%",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.voidBlack
  },
  statusStrip: {
    height: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusText: {
    fontSize: 11
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  osName: {
    fontSize: 16,
    letterSpacing: 1.4,
    ...glow.magentaText
  },
  eid: {
    marginTop: 6,
    fontSize: 10,
    letterSpacing: 1
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center"
  },
  menuIcon: {
    fontSize: 22
  },
  banner: {
    height: 150,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.lineSoft
  },
  bannerGlowCyan: {
    position: "absolute",
    left: -20,
    top: 28,
    width: 180,
    height: 110,
    borderRadius: 90,
    backgroundColor: colors.cyan,
    opacity: 0.13
  },
  bannerGlowMagenta: {
    position: "absolute",
    right: -22,
    top: 12,
    width: 210,
    height: 130,
    borderRadius: 105,
    backgroundColor: colors.magenta,
    opacity: 0.2
  },
  skyline: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 84,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  tower: {
    width: 9,
    borderRadius: 2
  },
  deckShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 62,
    backgroundColor: "rgba(5,6,13,0.74)"
  },
  meterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: -2
  },
  signalCard: {
    padding: spacing.lg
  },
  signalTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md
  },
  signalCopy: {
    flex: 1,
    minWidth: 0
  },
  signalLabel: {
    fontSize: 10,
    letterSpacing: 1.2
  },
  signalTime: {
    position: "absolute",
    right: 0,
    top: 0,
    fontSize: 10
  },
  signalHeadline: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1
  },
  signalBody: {
    marginTop: spacing.xs,
    fontSize: 11,
    letterSpacing: 0.6
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs
  },
  marketTitle: {
    fontSize: 15,
    letterSpacing: 1.4
  },
  marketLive: {
    fontSize: 10,
    letterSpacing: 1
  },
  marketList: {
    gap: spacing.sm
  },
  primaryActions: {
    gap: spacing.md,
    marginTop: spacing.xs
  },
  secondaryButton: {
    borderColor: colors.line,
    backgroundColor: colors.panel
  },
  mainButton: {
    minHeight: 58,
    borderRadius: radii.sm
  },
  footer: {
    gap: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  }
});
