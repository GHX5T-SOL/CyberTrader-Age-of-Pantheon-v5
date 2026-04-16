# Reference Synthesis — Six Steam Refs × Three-OS Progression

Each reference maps to a specific role in the Cybertrader design system. Treated as **DNA donors**, not templates — we take one or two ideas from each and leave the rest.

---

## STONKS-9800 → **primary donor for Ag3nt_0S//pIRAT3**
- **What we take:** 80s/90s Japanese PC pastiche. Pixel/bitmap typography. Readability-over-density text dashboards. Implied CRT phosphor aging. Monotone meditative pace.
- **What we adapt:** STONKS is deliberately chill / anti-stress; our pirate OS is chill *but stressed* — Energy is draining, Heat is rising. Keep the CRT restraint, add jitter/glitch only on state-change events (not ambient).
- **Concrete pull:** columnar commodity listings, text-log news feed above controls, sidebar with cash/health-equivalent stats. Maps directly to S1LKROAD 4.0 layout in BUILD_PLAN §7.

## Liquidated → **primary donor for Heat / Energy / stress UI**
- **What we take:** stress as a *visual mechanic* — the UI destabilizes as pressure rises. FOV, colors, text, sound all warp. This IS the Heat system in BUILD_PLAN §10 expressed as interface.
- **What we adapt:** don't warp everything; warp specific chrome elements (scanline density, glitch frequency, chromatic aberration on meters). Preserve readability of trade inputs even at max Heat — we're a game, not a horror piece.
- **Concrete pull:** diegetic room/apartment framing for Ag3nt_0S//pIRAT3 — the deck is an artifact, not a website. Reuse the "cracked screen / damaged deck" idea as the low-Energy Dormant Mode visual.

## Crypto Trading Simulator → **primary donor for the three-OS progression arc**
- **What we take:** the whole game is "messy room → futuristic command center." That *is* our Ag3nt_0S//pIRAT3 → AgentOS → PantheonOS spine made physical. Validates the progression fantasy.
- **What we adapt:** they model it as a room upgrade; we model it as an OS upgrade. Same narrative engine (visible progress, aspirational destination).
- **Concrete pull:** multi-panel pro-trader chrome at the AgentOS tier (RSI / Bollinger / Volume / trend-line drawing). These go in the GRAPH module from str33t-trad3r-v1. Social Feed / news ticker is persistent chrome across all tiers.

## Crypto Mining Simulator → **primary donor for diegetic OS-within-a-game**
- **What we take:** a simulated OS with its own settings, monitoring dashboard, and hardware-binding feels *authentic* rather than gamey. The OS has weight.
- **What we adapt:** our OS isn't simulating Windows — it's simulating a cyberdeck OS. Keep the authenticity: settings, process list, resource meters, boot sequence all behave like a real OS would.
- **Concrete pull:** hardware-spec density (temperature, wattage, hash rate) becomes Energy / Heat / Integrity / Stealth / Influence panels in BUILD_PLAN §19. Show actual numbers, not progress bars alone.

## Space Warlord Organ Trading Simulator → **primary donor for commodity chip grammar**
- **What we take:** sterile, clinical UI masking absurd/dangerous content. Abstract commodity cards with specs, not illustrated goods. Dark comic tone.
- **What we adapt:** our commodities (Fractol Dust, Plutonion Gas, Void Bloom — BUILD_PLAN §8) get the same treatment: neon-icon + ticker + specs, not photorealistic baggies. The UI's detachment is the joke and the aesthetic.
- **Concrete pull:** commodity card template — icon / ticker / name / volatility band / storage size / Heat risk / tag chips / one-line lore. All ten items from BUILD_PLAN §8 use this exact template.

## Stock Market Tycoon Challenge → **primary donor for PantheonOS polish tier**
- **What we take:** corporate-grade leaderboards, rankings, team/faction panels. Real-time market feed professionalism. Clean information hierarchy without being sterile.
- **What we adapt:** we layer GitS-coded holographic depth and pantheon sigils *on top* of this clean chassis. The bones are pro finance; the skin is divine cyber-AI.
- **Concrete pull:** leaderboard / seasonal dominance screens for PantheonOS §11 Tier 3. Faction "firm" panels map to BUILD_PLAN §14 factions.

---

## Synthesized aesthetic direction (locked for Pass 1)

**One-line:** *A 90s Japanese CRT pirate deck that evolves into a Ghost-in-the-Shell command console and ends as a divine digital cathedral — with STONKS' readability, Liquidated's stress, and Space Warlord's clinical detachment.*

**Per-tier visual grammar:**

| Layer | Ag3nt_0S//pIRAT3 | AgentOS | PantheonOS |
|---|---|---|---|
| Base | Green phosphor on near-black | Off-black with cyan primary, secondary neons sparse | Void-black with layered holographic translucency |
| Type | Pixel bitmap + mono terminal | Mono terminal + clean sans for data | Mono + custom pantheon display face for headings |
| Chrome | ASCII box-drawing frames | Thin neon strokes, corner brackets | Glass panels + binary halos + sigil corners |
| Motion | Typewriter, scanline flicker, rare glitch | Smooth eases, subtle bloom, telemetry pulses | Parallax hologram drift, particle rain, divine spillover |
| Iconography | ASCII glyphs | Monochrome neon line icons | Neon line + 3D-extruded variant |
| Audio cue (spec) | Keyclick, modem handshake | Soft chirps, holographic whoosh | Cathedral synth, binary choir |

**Locked palette (hex):**

```
Void Black           #05070A    base background (all tiers)
Deep Green-Black     #071A10    pirate-tier secondary base
Phosphor Green       #7CFFA0    pirate primary text
Acid Green           #00FF87    profit, energy
Electric Cyan        #00E8FF    primary action, interactables
Signal Amber         #FFB347    warning, market opportunity
Hot Red              #FF2E63    heat, danger, eAgent
Archivist Violet     #B388FF    lore, pantheon shards (used sparingly)
Off-White Signal     #E6EEF5    primary display text
Muted Blue-Gray      #7A8C9E    secondary text, metadata
```

**Typography stack (spec):**
- Pirate mono: `"VT323", "Perfect DOS VGA", "Share Tech Mono", monospace` (pixel-bitmap feel)
- Pro mono: `"JetBrains Mono", "IBM Plex Mono", monospace` (clean data)
- Display (AgentOS+): `"Rajdhani", "Exo 2", sans-serif` (angular tech)
- Pantheon display: custom face spec in Pass 3

**Motion grammar (spec, for Reanimated implementation):**
- Typewriter cadence: 28–42ms/char, occasional 200ms stalls on `<glitch>` tokens
- Scanline: 2px repeating gradient, `translateY(0→2px)` at 60s loop, opacity 0.04
- Glitch burst: 180–240ms, chromatic split ±2px, triggered on state change (new trade, news hit, Heat tier change)
- Boot sequence: 1.8–3.2s total, stepped reveal per line
- Ambient telemetry pulse: 1.1s sine on meters, amplitude 3% of range

---

## What's explicitly rejected from prior versions + refs

- No generic purple gradients (BUILD_PLAN §17 rule)
- No empty neon rectangles as "panels" — every frame is earned by ASCII/brackets/sigil corners
- No photographic finance-app screenshots or stock-chart clichés
- No copied GitS / Watch Dogs / DedSec IP marks — the *feel* is GitS, the *marks* are ours
- No flat admin dashboard — the cyberdeck is a diegetic object, not a website

---

## Next step recommendation

Move into **Pass 1A: Ag3nt_0S//pIRAT3 screen specs** — all pirate-tier screens from BUILD_PLAN §16 items 1–13, using the grammar locked above.
