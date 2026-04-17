import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MarketPreviewRow } from "../components/pirate-os/MarketPreviewRow";
import { PiratePhoneFrame } from "../components/pirate-os/PiratePhoneFrame";
import { SignalCard } from "../components/pirate-os/SignalCard";
import { StatusRing } from "../components/pirate-os/StatusRing";
import { COMMODITIES, STARTING_ENERGY_HOURS } from "../game/constants";
import { roundMoney } from "../game/engine";
import { useGameStore } from "../game/store";
import { pirateOsTheme as t } from "../theme/pirateOsTheme";

type PirateOsHomeScreenProps = {
  onOpenMenu?: () => void;
  onEnterSilkroad?: () => void;
  onBuyEnergy?: () => void;
};

export default function PirateOsHomeScreen({
  onOpenMenu,
  onEnterSilkroad
}: PirateOsHomeScreenProps) {
  const { state, selectCommodity, navigate } = useGameStore();
  const resources = state.resources;

  const marketRows = COMMODITIES.slice(0, 3).map((commodity) => {
    const market = state.market[commodity.id];
    const change = market.previousPrice === 0
      ? 0
      : ((market.currentPrice - market.previousPrice) / market.previousPrice) * 100;

    return {
      commodity,
      market,
      change
    };
  });

  return (
    <PiratePhoneFrame
      title="AG3NT_OS/PIRAT3"
      subtitle="EIDOLON ID: 7X9...A3F"
      onMenu={onOpenMenu}
      cityBand
      contentStyle={styles.content}
    >
      <View style={styles.ringsRow}>
        <StatusRing
          label="Energy"
          valueText={`${Math.round(resources?.energyHours ?? 0)}h`}
          progress={(resources?.energyHours ?? 0) / STARTING_ENERGY_HOURS}
          color={t.cyan}
          size={94}
          compact
        />
        <StatusRing
          label="Heat"
          valueText={`${Math.round(resources?.heat ?? 0)}%`}
          progress={(resources?.heat ?? 0) / 100}
          color={t.magenta}
          size={94}
          compact
        />
      </View>

      <SignalCard
        title="Archivist Tender Leak"
        body="Neon Glass / Oracle Resin demand rising"
        ageLabel="3 min ago"
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>S1LKROAD 4.0</Text>
        <Text style={styles.liveBadge}>LIVE</Text>
      </View>

      <View style={styles.marketList}>
        {marketRows.map(({ commodity, market, change }) => (
          <MarketPreviewRow
            key={commodity.id}
            symbol={commodity.ticker}
            name={commodity.name}
            price={`$${roundMoney(market.currentPrice).toLocaleString()}`}
            changePct={`${change.toFixed(1)}%`}
            positive={change >= 0}
            onPress={() => {
              selectCommodity(commodity.id);
              onEnterSilkroad?.();
            }}
          />
        ))}
      </View>

      <BottomActionBar
        onTrade={onEnterSilkroad}
        onMove={() => navigate("progression")}
        onLogs={() => navigate("notifications")}
      />
    </PiratePhoneFrame>
  );
}

function BottomActionBar({
  onTrade,
  onMove,
  onLogs
}: {
  onTrade?: () => void;
  onMove?: () => void;
  onLogs?: () => void;
}) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={onTrade} activeOpacity={0.84}>
        <Text style={styles.navIcon}>*</Text>
        <Text style={styles.navPrimaryText}>TRADE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onMove} activeOpacity={0.78}>
        <Text style={styles.navIconMuted}>+</Text>
        <Text style={styles.navText}>MOVE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onLogs} activeOpacity={0.78}>
        <Text style={styles.navIconMuted}>[]</Text>
        <Text style={styles.navText}>LOGS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0
  },
  ringsRow: {
    marginTop: 42,
    marginBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionHeader: {
    marginTop: 17,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: t.cyan,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  liveBadge: {
    color: t.textMuted,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  marketList: {
    gap: 6
  },
  bottomBar: {
    marginTop: 16,
    flexDirection: "row",
    gap: 4
  },
  navButton: {
    flex: 1,
    height: 49,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: "rgba(9,13,30,0.70)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  navButtonPrimary: {
    borderColor: "rgba(168,85,247,0.74)",
    backgroundColor: "rgba(109,40,217,0.92)",
    shadowColor: t.violet,
    shadowOpacity: 0.48,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 }
  },
  navIcon: {
    color: t.text,
    fontSize: 14,
    fontWeight: "900"
  },
  navIconMuted: {
    color: t.textMuted,
    fontSize: 14,
    fontWeight: "900"
  },
  navPrimaryText: {
    color: t.text,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9
  },
  navText: {
    color: t.textMuted,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9
  }
});
