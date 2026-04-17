import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CommodityGlyph } from "@/components/pirate-os/CommodityGlyph";
import { PiratePhoneFrame } from "@/components/pirate-os/PiratePhoneFrame";
import { COMMODITIES } from "@/game/constants";
import { calculateUnrealizedPnl, capacityUsed, getCommodity, roundMoney } from "@/game/engine";
import { useGameStore } from "@/game/store";
import type { CommodityMarketState, TradeType } from "@/game/types";
import { BracketButton, Chip, CommodityRow, DeckText, Panel, PriceChart } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

type Props = {
  openMenu: () => void;
};

export function SilkroadTerminal({ openMenu }: Props) {
  const { state, selectCommodity, executeTrade, marketTick, navigate } = useGameStore();
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [quantity, setQuantity] = useState(5);
  const selectedMarket = state.market[state.game.selectedCommodityId];
  const selectedCommodity = getCommodity(state.game.selectedCommodityId);
  const selectedPosition = state.positions[state.game.selectedCommodityId];
  const price = selectedMarket.currentPrice;
  const gross = price * quantity;
  const heatPreview = Math.min(100, (state.resources?.heat ?? 0) + selectedCommodity.heatRisk * quantity * 0.08);
  const unrealized = selectedPosition ? calculateUnrealizedPnl(state, selectedPosition) : 0;

  return (
    <PiratePhoneFrame
      title="S1LKROAD 4.0"
      subtitle="LIVE MARKETS // AG3NT_OS"
      onBack={() => navigate("deck")}
      onMenu={openMenu}
      cityBand={false}
      contentStyle={styles.content}
    >
      <TickerRail
        market={state.market}
        selectedCommodityId={selectedCommodity.id}
        onSelect={selectCommodity}
      />

      <Panel title="SELECTED CONTRACT" active style={styles.heroCard}>
        <View style={styles.priceRow}>
          <View style={styles.contractLead}>
            <CommodityGlyph ticker={selectedCommodity.ticker} size={54} active />
            <View style={styles.contractCopy}>
              <DeckText tone="muted" style={styles.smallLabel}>{selectedCommodity.ticker}</DeckText>
              <DeckText tone="white" style={styles.contractName} numberOfLines={1}>{selectedCommodity.name.toUpperCase()}</DeckText>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <DeckText tone="white" style={styles.price}>${roundMoney(price).toLocaleString()}</DeckText>
            <DeckText tone="cyan" style={styles.smallLabel}>0BOL</DeckText>
          </View>
        </View>
        <PriceChart market={selectedMarket} selectedTicker={selectedCommodity.ticker} />
        <DeckText tone="muted" style={styles.lore}>{selectedCommodity.lore}</DeckText>
      </Panel>

      <View style={styles.sectionHeader}>
        <DeckText tone="cyan" style={styles.sectionTitle}>WATCHLIST</DeckText>
        <DeckText tone="muted" style={styles.sectionMeta}>{COMMODITIES.length} ASSETS / TICK {state.game.marketTick}</DeckText>
      </View>
      <View style={styles.watchlist}>
        {COMMODITIES.map((commodity) => (
          <CommodityRow
            key={commodity.id}
            marketState={state.market[commodity.id]}
            selected={commodity.id === selectedCommodity.id}
            compact
            onPress={() => selectCommodity(commodity.id)}
          />
        ))}
      </View>

      <Panel title="ORDER" danger={tradeType === "sell"} style={styles.ticket}>
        <View style={styles.toggleRow}>
          <BracketButton label="BUY" tone={tradeType === "buy" ? "primary" : "normal"} onPress={() => setTradeType("buy")} style={styles.toggleButton} />
          <BracketButton label="SELL" tone={tradeType === "sell" ? "danger" : "normal"} onPress={() => setTradeType("sell")} style={styles.toggleButton} />
        </View>
        <View style={styles.qtyRow}>
          <BracketButton label="-" onPress={() => setQuantity((value) => Math.max(1, value - 1))} />
          <DeckText tone="white" style={styles.qty}>{quantity}</DeckText>
          <BracketButton label="+" onPress={() => setQuantity((value) => Math.min(99, value + 1))} />
        </View>
        <View style={styles.ticketLine}>
          <DeckText tone="muted" style={styles.smallLabel}>TOTAL</DeckText>
          <DeckText tone="white">{roundMoney(gross).toLocaleString()} 0BOL</DeckText>
        </View>
        <View style={styles.ticketLine}>
          <DeckText tone="muted" style={styles.smallLabel}>HEAT AFTER</DeckText>
          <DeckText tone={heatPreview > 60 ? "danger" : "violet"}>{Math.round(heatPreview)}%</DeckText>
        </View>
        <BracketButton
          label="EXECUTE TRADE"
          tone={tradeType === "buy" ? "primary" : "danger"}
          onPress={() => executeTrade(selectedCommodity.id, quantity, tradeType)}
          style={styles.execute}
        />
      </Panel>

      <Panel title="POSITION">
        <View style={styles.ticketLine}>
          <DeckText tone="muted" style={styles.smallLabel}>QTY</DeckText>
          <DeckText tone="white">{selectedPosition?.quantity ?? 0}</DeckText>
        </View>
        <View style={styles.ticketLine}>
          <DeckText tone="muted" style={styles.smallLabel}>AVG ENTRY</DeckText>
          <DeckText tone="white">{(selectedPosition?.averageEntry ?? 0).toFixed(2)}</DeckText>
        </View>
        <View style={styles.ticketLine}>
          <DeckText tone="muted" style={styles.smallLabel}>UNREALIZED</DeckText>
          <DeckText tone={unrealized >= 0 ? "profit" : "danger"}>{unrealized.toFixed(2)} 0BOL</DeckText>
        </View>
        <View style={styles.footer}>
          <Chip label={`CAP ${capacityUsed(state.positions)} / ${state.game.inventoryCapacity}`} tone="muted" />
          <BracketButton label="MARKET TICK" onPress={marketTick} />
        </View>
      </Panel>
    </PiratePhoneFrame>
  );
}

function TickerRail({
  market,
  selectedCommodityId,
  onSelect
}: {
  market: Record<string, CommodityMarketState>;
  selectedCommodityId: string;
  onSelect: (commodityId: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerRail}>
      {COMMODITIES.map((commodity) => {
        const marketState = market[commodity.id];
        const change = marketState.previousPrice === 0
          ? 0
          : ((marketState.currentPrice - marketState.previousPrice) / marketState.previousPrice) * 100;
        const up = change >= 0;
        const selected = selectedCommodityId === commodity.id;

        return (
          <Pressable
            key={commodity.id}
            onPress={() => onSelect(commodity.id)}
            style={[styles.tickerChip, selected && styles.tickerChipSelected]}
          >
            <View style={styles.tickerIdentity}>
              <CommodityGlyph ticker={commodity.ticker} size={26} active={selected || up} />
              <DeckText tone={selected ? "cyan" : "white"} style={styles.tickerSymbol}>{commodity.ticker}</DeckText>
            </View>
            <DeckText tone="muted" style={styles.tickerPrice}>${roundMoney(marketState.currentPrice).toLocaleString()}</DeckText>
            <DeckText tone={up ? "profit" : "danger"} style={styles.tickerChange}>{`${up ? "+" : ""}${change.toFixed(1)}%`}</DeckText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md
  },
  tickerRail: {
    gap: spacing.sm,
    paddingRight: spacing.xs
  },
  tickerChip: {
    minWidth: 86,
    minHeight: 58,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 7,
    backgroundColor: "rgba(7,11,25,0.78)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    justifyContent: "center"
  },
  tickerChipSelected: {
    borderColor: colors.cyan,
    backgroundColor: "rgba(34,211,238,0.10)"
  },
  tickerSymbol: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  tickerIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  tickerPrice: {
    marginTop: 4,
    fontSize: 9
  },
  tickerChange: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "900"
  },
  heroCard: {
    gap: spacing.md
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  contractLead: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  contractCopy: {
    flex: 1,
    minWidth: 0
  },
  smallLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  contractName: {
    marginTop: 5,
    fontSize: 13,
    letterSpacing: 0.6
  },
  priceBlock: {
    alignItems: "flex-end"
  },
  price: {
    fontSize: 17,
    fontWeight: "900"
  },
  lore: {
    fontSize: 11,
    lineHeight: 17
  },
  sectionHeader: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 1.2
  },
  sectionMeta: {
    fontSize: 10,
    letterSpacing: 1
  },
  watchlist: {
    gap: spacing.sm
  },
  ticket: {
    gap: spacing.md
  },
  toggleRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  toggleButton: {
    flex: 1
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  qty: {
    minWidth: 58,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900"
  },
  ticketLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  execute: {
    minHeight: 52
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    flexWrap: "wrap"
  }
});
