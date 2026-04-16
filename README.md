# CyberTrader: Age of Pantheon

Phase 1 frontend for the Pirate OS loop:

1. cinematic intro
2. wallet/dev identity
3. Ag3nt_0S//pIRAT3 boot
4. Cyberdeck dashboard
5. S1LKROAD 4.0 trading loop
6. local server-shaped game engine for player state, energy, heat, market ticks, positions, and news

## Commands

```bash
npm install
npm run typecheck
npm test
npm run lint
npm run web
```

The app is local-first by design. The game service exposes backend-shaped functions that can move behind Supabase Edge Functions later:

- `getPlayerState`
- `executeTrade`
- `getMarket`
- `getNews`
- `updateEnergy`
- `updateHeat`
