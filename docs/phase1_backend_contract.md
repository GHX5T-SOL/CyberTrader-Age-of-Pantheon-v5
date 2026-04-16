# Phase 1 Backend Contract

This contract mirrors the local frontend game engine and is scoped to Pirate OS only.

## Relationships

- `users` owns one `profiles`, `resources`, `currencies`, and `game_state` row.
- `commodities` is static game data.
- `market_state` owns the current tick price for each commodity.
- `positions` is the player's inventory ledger per commodity.
- `transactions` is append-only trade history.
- `market_news` is global signal data used by the market tick function.

## Server Authority

The client may request trades and screen transitions, but it must not submit trusted balances, heat, energy, prices, or PnL. Edge Functions own these calculations:

- `market-tick`: applies volatility, active news impact, mean reversion, liquidity skew, and heat pressure.
- `execute-trade`: validates balance, inventory capacity, Energy, Heat risk, fees, price, and position updates in one transaction.
- `resolve-player-state`: updates Energy and Heat using `resources.last_updated_at`, applies capped offline ticks, and returns the boot payload.

## API Shape

```ts
getPlayerState(userId)
executeTrade(userId, commodityId, quantity, type)
getMarket()
getNews()
updateEnergy(userId)
updateHeat(userId)
```

## Edge Function Sketch

```ts
export async function executeTrade(req: Request) {
  const { userId, commodityId, quantity, type } = await req.json();

  // 1. Verify Supabase auth session maps to userId.
  // 2. Resolve Energy and Heat from last_updated_at.
  // 3. Read market_state price inside a transaction.
  // 4. Validate balance for buys or position quantity for sells.
  // 5. Apply fee, slippage, Heat gain, average entry, realized PnL, XP.
  // 6. Insert transactions row.
  // 7. Return full player state so UI updates instantly.
}
```

## Scaling Later

- Keep Pirate OS tables stable; add AgentOS tables separately for factions, node missions, and routes.
- Do not expose writes to `market_state`, `market_news`, `transactions`, `positions`, `resources`, or `currencies` through client-side CRUD.
- Add Realtime subscriptions only for `market_state` and `market_news` once Edge Functions are authoritative.
