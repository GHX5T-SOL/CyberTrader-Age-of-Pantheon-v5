import React, { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { COMMODITIES } from "@/game/constants";
import { calculateUnrealizedPnl, capacityUsed, getCommodity, roundMoney } from "@/game/engine";
import { useGameStore } from "@/game/store";
import type { TradeType } from "@/game/types";
import {
  BracketButton,
  Chip,
  CommodityRow,
  DeckText,
  Panel,
  PriceChart,
  TerminalScroll
} from "@/ui/primitives";
import { colors, glow, radii, spacing } from "@/ui/theme";

type Props = {
  openMenu: () => void;
};

export function SilkroadTerminal({ openMenu }: Props) {
  const { state, selectCommodity, executeTrade, marketTick, navigate } = useGameStore();
  const { width } = useWindowDimensions();
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [quantity, setQuantity] = useState(5);
  const selectedMarket = state.market[state.game.selectedCommodityId];
  const selectedCommodity = getCommodity(state.game.selectedCommodityId);
  const selectedPosition = state.positions[state.game.selectedCommodityId];
  const price = selectedMarket.currentPrice;
  const gross = price * quantity;
  const heatPreview = Math.min(100, (state.resources?.heat ?? 0) + selectedCommodity.heatRisk * quantity * 0.08);
  const unrealized = selectedPosition ? calculateUnrealizedPnl(state, selectedPosition) : 0;
  const phoneWidth = Math.min(width, 430);

  return (
    <TerminalScroll>
      <View style={[styles.phone, { maxWidth: phoneWidth }]}>
        <View style={styles.statusStrip}>
          <DeckText tone="white" style={styles.statusText}>9:41</DeckText>
          <DeckText tone="white" style={styles.statusText}>S1LKROAD LIVE</DeckText>
        </View>

        <View style={styles.header}>
          <Pressable onPress={() => navigate("deck")} style={styles.iconButton}>
            <DeckText tone="cyan">BACK</DeckText>
          </Pressable>
          <View style={styles.headerCopy}>
            <DeckText tone="cyan" style={styles.marketTitle}>S1LKROAD 4.0</DeckText>
            <DeckText tone="muted" style={styles.eid}>LIVE MARKETS // AG3NT_OS</DeckText>
          </View>
          <Pressable onPress={openMenu} style={styles.iconButton}>
            <DeckText tone="violet">III</DeckText>
          </Pressable>
        </View>

        <Panel title="SELECTED CONTRACT" active style={styles.heroCard}>
          <View style={styles.priceRow}>
            <View>
              <DeckText tone="muted" style={styles.smallLabel}>{selectedCommodity.ticker}</DeckText>
              <DeckText tone="white" style={styles.contractName}>{selectedCommodity.name.toUpperCase()}</DeckText>
            </View>
            <View style={styles.priceBlock}>
              <DeckText tone="white" style={styles.price}>${price.toLocaleString()}</DeckText>
              <DeckText tone="cyan" style={styles.smallLabel}>0BOL</DeckText>
            </View>
          </View>
          <PriceChart market={selectedMarket} selectedTicker={selectedCommodity.ticker} />
          <DeckText tone="muted" style={styles.lore}>{selectedCommodity.lore}</DeckText>
        </Panel>

        <View style={styles.sectionHeader}>
          <DeckText tone="cyan" style={styles.sectionTitle}>WATCHLIST</DeckText>
          <DeckText tone="muted" style={styles.sectionMeta}>TICK {state.game.marketTick}</DeckText>
        </View>
        <View style={styles.watchlist}>
          {COMMODITIES.slice(0, 6).map((commodity) => (
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
            <DeckText tone="muted">TOTAL</DeckText>
            <DeckText tone="white">{roundMoney(gross).toLocaleString()} 0BOL</DeckText>
          </View>
          <View style={styles.ticketLine}>
            <DeckText tone="muted">HEAT AFTER</DeckText>
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
            <DeckText tone="muted">QTY</DeckText>
            <DeckText tone="white">{selectedPosition?.quantity ?? 0}</DeckText>
          </View>
          <View style={styles.ticketLine}>
            <DeckText tone="muted">AVG ENTRY</DeckText>
            <DeckText tone="white">{(selectedPosition?.averageEntry ?? 0).toFixed(2)}</DeckText>
          </View>
          <View style={styles.ticketLine}>
            <DeckText tone="muted">UNREALIZED</DeckText>
            <DeckText tone={unrealized >= 0 ? "profit" : "danger"}>{unrealized.toFixed(2)} 0BOL</DeckText>
          </View>
          <View style={styles.footer}>
            <Chip label={`CAP ${capacityUsed(state.positions)} / ${state.game.inventoryCapacity}`} tone="muted" />
            <BracketButton label="MARKET TICK" onPress={marketTick} />
          </View>
        </Panel>
      </View>
    </TerminalScroll>
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
    gap: spacing.md
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  marketTitle: {
    fontSize: 16,
    letterSpacing: 1.4,
    ...glow.cyanText
  },
  eid: {
    marginTop: 5,
    fontSize: 10,
    letterSpacing: 1
  },
  iconButton: {
    minWidth: 46,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panel
  },
  heroCard: {
    gap: spacing.md
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  smallLabel: {
    fontSize: 10,
    letterSpacing: 1
  },
  contractName: {
    marginTop: 5,
    fontSize: 18,
    letterSpacing: 1
  },
  priceBlock: {
    alignItems: "flex-end"
  },
  price: {
    fontSize: 22
  },
  lore: {
    fontSize: 12,
    lineHeight: 18
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: 14,
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
    gap: spacing.md
  },
  qty: {
    minWidth: 76,
    textAlign: "center",
    fontSize: 30
  },
  ticketLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  execute: {
    minHeight: 56
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
