# Cybertrader: Age of Pantheon — Design System

Single source of truth for all generated screens. Superdesign drafts must adhere to this file exactly — no invented colors, fonts, gradients, or component styles.

---

## 1. Product Context

**Cybertrader: Age of Pantheon** is a cyberpunk trading-hacking-ascension game. The player is an Eidolon — a shard of a shattered rogue AI called Pantheon — operating in the city-grid **Neon Void** in year 2077. The player's tool is a **cyberdeck** that runs one of three operating systems, which evolve as the player ranks up. Each OS is itself a playable UI layer — a complete, diegetic operating system the player lives inside.

**Three OS tiers — this design system covers TIER 1 only (Pass 1A):**

| Tier | OS Name | Unlocked At | Vibe |
|---|---|---|---|
| 1 | **Ag3nt_0S//pIRAT3** | Start | Raw, underground, pirate-hacker. Corrupted ASCII CRT. "Just cracked the mainframe." |
| 2 | AgentOS | Rank 5 | Pro black-ops cyberdeck. Cleaner, neon-accented. *(designed in Pass 2)* |
| 3 | PantheonOS | Rank 20 | Divine digital cathedral. Holographic, god-tier. *(designed in Pass 3)* |

**Primary JTBD for pirate OS:** let a new player (Eidolon handle, starting 1,000,000 0BOL, 72 hours of Energy) immediately find and successfully complete their first **S1LKROAD 4.0** trade while always seeing their Energy / Heat / Rank / 0BOL chrome.

**Secondary JTBD:** communicate OS inferiority — the player must *feel* how limited Tier 1 is, so upgrading to AgentOS is emotionally satisfying. Many PantheonOS-tier modules (RAIDS, CREW, territory map) must appear **visibly locked** in this tier, not hidden.

---

## 2. Core Design Rules — Non-Negotiable

1. **Diegetic, not web.** Every screen is a cyberdeck running Ag3nt_0S//pIRAT3. The UI is an in-world artifact. It is NOT a website, dashboard, or SaaS product.
2. **ASCII box-drawing frames, not rounded rectangles.** Panels are framed with Unicode box-drawing characters (╔ ╗ ╚ ╝ ═ ║ ├ ┤ ┬ ┴ ┼ │ ─). Corners are SHARP. No `border-radius` above 2px. No `rgba(255,255,255,0.03)` glass cards — that is rejected.
3. **Phosphor-first palette.** Base is near-black. Primary ink is phosphor green. Accent colors (cyan, amber, red, violet) are used SPARINGLY for semantic state — never decoratively.
4. **No generic purple gradients.** No empty neon rectangles. No flat admin dashboards. No tiny finance-app text. No decorative cards. No placeholder icons. (These are hard rejects from BUILD_PLAN §17.)
5. **Monospace everywhere.** Every text element uses a monospace stack. There is ONE display face exception reserved for the three largest headings (see §4).
6. **Persistent chrome on every screen.** Energy meter + hours, 0BOL balance, $OBOL_LOCKED state, Heat level, eCriminal Rank, OS tier indicator. These are always visible. Always.
7. **Single-letter keyboard shortcuts.** Every navigable module has a single uppercase letter shortcut rendered as `[D]`, `[$]`, `[O]` inline with the label. Preserved from str33t-trad3r-v1.
8. **Real game copy, no lorem ipsum.** Use the actual ticker list, lore lines, rank titles, telemetry strings defined in this document. BUILD_PLAN.md is canon.

---

## 3. Color Palette (LOCKED — use ONLY these)

```css
/* Bases */
--void-black:         #05070A;  /* page background */
--deep-green-black:   #071A10;  /* panel fill, slightly greener than void */
--frame-line:         #123620;  /* ASCII frame line, dim */
--panel-glass:        #0A1410;  /* slight lift for nested panels */

/* Phosphor — the primary ink */
--phosphor:           #7CFFA0;  /* primary text, ASCII art, frames when active */
--phosphor-dim:       #3FA066;  /* secondary/aged phosphor, secondary text */
--phosphor-ghost:     #1C4A2C;  /* inactive/locked labels */

/* Semantic accents — use ONLY for state, never decoration */
--acid-green:         #00FF87;  /* profit, energy-positive, success */
--electric-cyan:      #00E8FF;  /* primary interactable, links, buttons, cursors */
--signal-amber:       #FFB347;  /* warning, market opportunity, low energy */
--hot-red:            #FF2E63;  /* Heat, danger, eAgent, loss */
--archivist-violet:   #B388FF;  /* lore, Pantheon shards — SPARINGLY, max 1-2 spots per screen */

/* Display text */
--off-white:          #E6EEF5;  /* high-priority display numbers (OBOL balance, price) */
--meta-gray:          #7A8C9E;  /* metadata, timestamps, helper text */
--locked-gray:        #2E3842;  /* LOCKED module labels */

/* Overlays */
--scanline-rgba:      rgba(124, 255, 160, 0.04);   /* scanline overlay */
--crt-vignette-rgba:  rgba(0, 0, 0, 0.45);          /* edge vignette */
--glitch-cyan-rgba:   rgba(0, 232, 255, 0.6);       /* chromatic split on glitch */
--glitch-red-rgba:    rgba(255, 46, 99, 0.6);       /* chromatic split on glitch */
```

**DO NOT invent colors outside this list.** If a new semantic state is needed, REUSE an existing color — do not create a new hex. Gradients are forbidden except the scanline overlay.

---

## 4. Typography (LOCKED)

**Stack priority — pirate tier uses the pixel-bitmap feel:**

```css
--font-pixel:    'VT323', 'Perfect DOS VGA 437', 'Share Tech Mono', monospace;
--font-mono:     'JetBrains Mono', 'IBM Plex Mono', 'Share Tech Mono', monospace;
--font-display:  'Orbitron', 'Rajdhani', 'Share Tech Mono', monospace;  /* ONLY for the logo mark and the single largest heading per screen */
```

**Scale:**

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `--fs-display` | 64px | 1.0 | 700 | Screen title / boot headline (one per screen) |
| `--fs-hero` | 40px | 1.1 | 700 | Main value display (0BOL balance, price) |
| `--fs-h1` | 28px | 1.15 | 600 | Panel headers |
| `--fs-h2` | 20px | 1.2 | 600 | Sub-section headers |
| `--fs-body` | 16px | 1.4 | 400 | Body copy |
| `--fs-sm` | 14px | 1.4 | 400 | Secondary / metadata |
| `--fs-xs` | 12px | 1.3 | 400 | Chip / timestamp / label |
| `--fs-tick` | 11px | 1.2 | 400 | Tiny telemetry ticker text |

- Headlines in VT323 at fs-display get uppercase + 0.04em letter-spacing.
- All-caps labels use meta-gray at fs-xs with 0.12em letter-spacing.
- NEVER use italics. NEVER use serifs. NEVER use Playfair Display, Inter, or similar web-typical faces.

---

## 5. Spacing, Grid, Radius

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   24px;
--space-6:   32px;
--space-8:   48px;
--space-10:  64px;

--radius:    0px;      /* sharp corners everywhere */
--radius-xs: 2px;      /* the ONLY acceptable rounding, for tiny chips */

--frame-w:   1px;      /* ASCII frame stroke width — thin */
```

**Grid:** 12-column desktop at 1920×1080, gutter 24px, outer margin 48px. Panels snap to the grid. Nested panels may ignore the grid for density.

---

## 6. Layout Chassis — The Cyberdeck Shell

Every pirate-tier screen sits inside this chassis. It is persistent.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Ag3nt_0S//pIRAT3   v0.7.3c    /dev/tty-pantheon    [≡]              [GLITCH] ║   <- TOP BAR (32px)
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                           [  SCREEN CONTENT  ]                               ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ EID: ghxst.eth//0xa9  |  0BOL: 1,024,500  |  $OBOL_LOCKED  |  E: ████░░ 68h ║   <- PERSISTENT CHROME (48px)
║ HEAT: ▓░░░░ 14%       |  RANK: 0 — BOOT GHOST            |  OS: PIRAT3 v0.7 ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Top bar (persistent):**
- Left: OS name + version + device path (`/dev/tty-pantheon`).
- Center: optional breadcrumb for current module (e.g. `/deck` or `/s1lkroad`).
- Right: `[≡]` burger-menu shortcut (hotkey `M`), `[GLITCH]` stability indicator.

**Persistent chrome (bottom, two rows):**
- Row 1: Wallet chip / 0BOL / $OBOL state / Energy meter (ASCII filled block bar + hours remaining).
- Row 2: Heat meter / Rank chip / OS tier.

Energy meter visual: `████░░` — filled blocks in phosphor, empty in frame-line. Switch to signal-amber at ≤20h, hot-red at ≤5h.
Heat meter: `▓░░░░` — filled in hot-red, empty in frame-line.

---

## 7. Core Components

### 7.1 Panel (the ASCII box)
Every content region is a **Panel** — a rectangle drawn with Unicode box characters. NOT a CSS border.

```
╔─── PANEL TITLE ────────────────────────╗
│                                        │
│   content                              │
│                                        │
╚────────────────────────────────────────╝
```

Implementation: `::before` / `::after` pseudo-elements OR an SVG frame OR hand-drawn `<pre>` borders. All three acceptable. The top-left corner may contain the panel title inline with the frame, e.g. `╔─── S1LKROAD 4.0 ───╗`.

Frame color:
- Default: `--phosphor-dim`
- Focused/active: `--phosphor`
- Danger state: `--hot-red`
- Locked: `--locked-gray`

### 7.2 Button
Text button inside a bracket frame: `[ BUY ENERGY ]` or `[ M ] MENU`.
- Default: phosphor text, phosphor-dim brackets
- Hover: electric-cyan brackets, electric-cyan text
- Active: inverted — cyan background with void-black text
- Disabled/locked: locked-gray text and brackets, with a `// LOCKED` suffix
- NEVER use pill buttons or rounded buttons. Brackets ONLY.

### 7.3 Chip (wallet, rank, OS tier, tag)
Small inline tag: `‹EID: ghxst.eth›` using angle brackets OR `[RANK 0 · BOOT GHOST]` using square brackets. Phosphor-dim bracket, phosphor text.

### 7.4 Meter (Energy, Heat, integrity)
ASCII block meter: `████████░░` — 10 slots. Text label to left, numeric value to right.
Heat has a hot-red fill; Energy has a phosphor (or amber/red when low) fill.

### 7.5 Commodity Card (used in watchlist + inventory)
A compact horizontal card. Space Warlord-style clinical detachment.

```
┌─ [FDST] FRACTOL DUST ──────────────────────┐
│  ▲ 2,340 0BOL   +4.2%  ████▓░ VOL HIGH     │
│  SZ:2  HEAT:●●○  TAGS: crystal, shock      │
│  Crystalline prediction residue harvested   │
│  from broken AI dreams.                     │
└─────────────────────────────────────────────┘
```

Required fields: ticker, name, current price in 0BOL, % change (acid-green up / hot-red down), volatility band (6-slot meter), SZ (storage size), HEAT dots (● filled red, ○ empty), tag chips, one-line lore italicized in phosphor-dim.

### 7.6 Chart
Custom SVG line chart on void-black background. Phosphor stroke, phosphor-dim grid lines at 5-unit intervals. Event markers as small circles with amber halo + a text label tether. Price axis on right, time axis on bottom. No chart library styling — this is hand-drawn SVG.

### 7.7 News feed item
Single-line news entries, stamped with a timestamp and affected-tickers chip:
```
[T-0:03:42]  ●  BORDER SEIZURE HITS FRACTOL DUST    [FDST]  credibility: ████▓░
```
`●` is a colored dot indicating direction (acid-green up, hot-red down, amber mixed).

### 7.8 Module tile (main dashboard)
A clickable panel representing a module. Must show: single-letter shortcut, module icon (ASCII glyph), full name, status (AVAILABLE / LOCKED), unlock requirement if locked.

Pirate-tier module inventory (ONLY these are AVAILABLE in Tier 1):
- `[$]` S1LKROAD 4.0 — AVAILABLE
- `[P]` Profile — AVAILABLE
- `[I]` Inventory — AVAILABLE (minimal)
- `[N]` Notifications — AVAILABLE
- `[H]` Help / Glossary — AVAILABLE
- `[S]` Settings — AVAILABLE

Pirate-tier **LOCKED modules** (MUST be visibly displayed, grayed out, with unlock text):
- `[F]` Factions — `// LOCKED · UNLOCK AT AgentOS (RANK 5)`
- `[O]` Ops / Node Missions — `// LOCKED · UNLOCK AT AgentOS (RANK 5)`
- `[R]` Raids — `// LOCKED · UNLOCK AT PantheonOS (RANK 20)`
- `[C]` Crew Warfare — `// LOCKED · UNLOCK AT PantheonOS (RANK 20)`
- `[T]` Territory Map — `// LOCKED · UNLOCK AT PantheonOS (RANK 20)`

Locked tiles use `--locked-gray` and `--phosphor-ghost`. Clickable = emit a Heat-risk warning + deny.

---

## 8. Motion & Animation

- **Scanline overlay:** full-screen fixed pseudo-layer, 2px horizontal stripes at `--scanline-rgba`, 60s vertical loop. Opacity 0.04. This is ambient.
- **CRT vignette:** radial gradient from transparent center to `--crt-vignette-rgba` at edges. Fixed, non-animated.
- **Typewriter:** 28–42ms per character for boot sequences and modal reveals. Cursor is a blinking `█` at the end.
- **Glitch burst:** 180–240ms. Chromatic split ±2px horizontal (cyan left, red right). Triggered by state changes ONLY (new trade, news event, Heat tier change, module click). Not ambient.
- **Meter pulse:** 1.1s sine wave, amplitude 3% of fill. Ambient on Energy + Heat meters.
- **Cursor blink:** 500ms on, 500ms off, block `█`.
- **Boot stagger:** each telemetry line appears 120–180ms after the previous.

All keyframes use `steps()` easing where possible to avoid smoothing away the pixel feel. Fluid motion is reserved for AgentOS (Tier 2).

---

## 9. Screen Inventory (Pass 1A Scope)

Five screens to design. First is the hero draft; the rest follow in `execute-flow-pages`.

### 9.1 Pirate OS Cyberdeck — Main Dashboard (HERO SCREEN, do first)
The heart of the starter OS. Post-login landing.

Regions:
- Persistent top bar + bottom chrome (see §6)
- Center-left: **Module grid** — 3×4 grid of module tiles (6 available, 5 locked, plus 1 spare slot for Upgrade-OS call-to-action)
- Center-right: **Active alerts** — boot-readiness banner, unfinished tutorial step, latest news item affecting held positions
- Right column: **Eidolon panel** — ASCII portrait glyph (small version of BLACK FLAG CURSOR), handle, rank progress bar to next rank, short system log ticker (3–5 lines of recent events)
- Bottom-left primary CTAs: `[ E ] BUY ENERGY`   `[ $ ] ENTER S1LKROAD 4.0`
- Subtle: boot-completion stamp `BOOT OK · 00:14.823 · CHECKSUM 0x7F3A`

### 9.2 Intro Cinematic — Final Frame
Full-screen, vertical narrative stack, centered:
- Top: binary/hex noise band (1 line)
- Upper-middle: ASCII art BLACK FLAG CURSOR glyph (≈12 rows tall, centered)
- Middle: lore line `2077. Pantheon shattered. You are one surviving shard.`
- Lower-middle: telemetry lines, revealed progressively:
  - `> ESTABLISHING SYSLINK ....... OK`
  - `> ROUTING VIA ONION RELAY .... OK`
  - `> MOUNTING /dev/tty-pantheon . OK`
  - `> ROOTKIT CHANNEL STABILIZING  ●`
- Bottom: `[ ENTER SIGNAL ]` button, cyan, pulsing subtly
- Bottom-right small: `[skip >>]` available after 4s

### 9.3 Wallet / Login
Post-cinematic, gate to the deck.
- Title: `IDENTIFY // EIDOLON`
- Two primary options, stacked:
  - `[ SOLANA WALLET ]` — primary CTA (cyan)
  - `[ DEV IDENTITY ]` — dim, with subtitle "Expo Go / testing fallback"
- Below: `Eidolon handle:` input, monospace, with `[ AUTOGEN ]` button
- Bottom: legal micro-copy about two-ledger system, 0BOL non-withdrawable
- Ambient: a few scrolling lines of telemetry on the right margin to keep the screen alive

### 9.4 S1LKROAD 4.0 — Trading Terminal
Multi-panel:
- Top (within the standard shell): breadcrumb `/ s1lkroad`, Heat-risk-now chip
- Left column (280px): Watchlist of all 10 commodities from BUILD_PLAN §8 — each row a compact commodity card (ticker, price, % change, VOL bar, HEAT dots). First is selected/highlighted.
- Center (main): selected commodity's detail. Hero row = name + ticker + current price + change. Below = full SVG chart ≈60% of panel height with event markers. Below chart = horizontal lore + tag chip row.
- Right column (320px): Order ticket — BUY / SELL toggle, quantity stepper (`-` / `+`), price input (0BOL), Heat preview, total cost, `[ EXECUTE TRADE ]` button. Below ticket: held position summary (qty, avg entry, realized PnL, unrealized PnL).
- Bottom strip (120px): split 50/50 — left = positions history (last 6), right = news feed (last 6). Both are terminal-style line lists.

### 9.5 Burger Menu Overlay
Slide-in from right, 380px wide, full-height, dims main content to 35% behind it with glitch static overlay.
- Header: `:: SYSTEM MENU ::`
- List (stacked, single-letter shortcut + label):
  - `[P]` Profile
  - `[S]` Settings
  - `[I]` Inventory
  - `[U]` Progression / OS Upgrades
  - `[R]` Rank
  - `[L]` Leaderboard
  - `[G]` Rewards
  - `[N]` Notifications
  - `[H]` Help / How To Play
  - `[E]` Legal / Wallet Disclosures
- Footer: version stamp + `[ESC] CLOSE`
- Each row has a right-aligned counter / status (e.g. Notifications → `●3`)

---

## 10. Canon Copy (use verbatim)

**Identity:**
- Player: Eidolon (AI shard). Handle format: `ghxst.eth` or `0xa9` — leetspeak welcome.
- Currency: `0BOL` (free, in-game) and `$OBOL` (Solana SPL, optional). Tier 1 shows `$OBOL_LOCKED`.
- Device: `/dev/tty-pantheon`
- Antagonists: **Echelon eAgents**

**Rank titles (use actual titles, not placeholders):**
0 Boot Ghost · 1 Packet Rat · 2 Signal Runner · 3 Black Terminal · 5 Node Thief · 8 Route Phantom · 12 Grid Smuggler · 16 eCriminal Architect · 20 Pantheon Candidate · 30 Neon Warlord · 40 Pantheon Ascendant

**Commodity list for S1LKROAD 4.0 (ALL TEN, verbatim):**
- `FDST` Fractol Dust — *Crystalline prediction residue harvested from broken AI dreams.* High volatility.
- `PGAS` Plutonion Gas — *Sealed micro-reactor vapor used in illegal grid bursts.* Infrastructure demand.
- `NGLS` Neon Glass — *Optical memory shards that refract corrupted Pantheon fragments.* Lore-sensitive.
- `HXMD` Helix Mud — *Bio-synthetic coolant sludge for overheated drone minds.* Demand spikes on raids.
- `VBLM` Void Bloom — *Fungal code growth that eats dead packets and sells as compute feed.* Cheap, bulky.
- `ORRS` Oracle Resin — *Predictive resin wafers used by market prophets.* News-sensitive premium.
- `SNPS` Synapse Silk — *Threaded neural weave for stealth runners.* Faction routes.
- `MTRX` Matrix Salt — *Rare lattice salt for decrypting old city relays.* Node unlock gate.
- `AETH` Aether Tabs — *Temporary perception patches for Eidolon routing models.* Pump/crash rumors.
- `BLCK` Blacklight Serum — *Synthetic signal dye for hiding ghost packets.* High Heat, high margin.

**Telemetry strings (reuse freely as ambient):**
`ESTABLISHING SYSLINK · ROUTING VIA ONION RELAY · MOUNTING /dev/tty-pantheon · ROOTKIT CHANNEL STABILIZING · packet_loss=13% · checksum 0x7F3A · BOOT OK · STREAM LIVE · GLITCH TOLERANCE NOMINAL`

**ASCII art glyph — BLACK FLAG CURSOR (use something evocative of this; it is the pirate-OS mascot):**
```
    ▄▀▀▀▀▀▀▀▀▀▀▄
   ▐░░▄▀▀▀▀▄░░▌
   ▐░▐  ●●  ▌░▌
   ▐░▐   ──  ▌░▌
   ▐░▀▄▄▄▄▄▄▀░▌
    ▀▄░░░░░░▄▀
      ▀▀▀▀▀▀
   BLACK FLAG
     CURSOR
```
(The generator may stylize further using Unicode block characters — just keep the spirit: a skull-ish / helmet-ish glyph rendered entirely in ASCII/Unicode.)

---

## 11. Hard Rejects (DO NOT PRODUCE)

- Generic purple gradients, pink-to-blue gradients, any indigo/purple/pink hero backgrounds
- Empty neon rectangles or floating glass cards with no diegetic frame
- Rounded pill buttons, Material-style elevation, glassmorphism
- Playfair Display, Inter, Poppins, any serif, any "friendly" humanist sans
- Stock illustrations, photographic backgrounds, AI-generated photoreal imagery
- Hero sections with CTAs like "Start Free Trial" or "Get Started"
- Pricing tables, testimonials, 3-column feature grids with circular icons
- Copied marks from Ghost in the Shell, Watch Dogs, DedSec, Cyberpunk 2077, Deus Ex
- Real drug names (the commodities are fictional — use only the ten in §10)
- Lorem ipsum or placeholder text of any kind

---

## 12. Output Technical Requirements

- Target viewport: 1920×1080 desktop (device: desktop, no custom width/height needed)
- Use Google Fonts imports: VT323, JetBrains Mono, Orbitron
- Tailwind classes OK; inline styles OK; the only hard rule is using the tokens and components above
- All icons inline SVG (no icon library CDN except for edge cases), monochrome, 1px stroke
- Commodity icons: inline ASCII/SVG glyphs, NOT photos, NOT illustrations
- ASCII art must be real Unicode text, rendered in a `<pre>` or equivalent monospace block — not a background image
# Current Locked Visual Target — Pirate OS Mobile Concept

The active target is the user-provided final image dated April 17, 2026: a single premium mobile cyberdeck screen inside a glowing phone frame.

This section supersedes any older ASCII/green-terminal notes below for the current Pirate OS home screen.

- Composition: centered portrait phone shell, narrow playable screen, black outer stage, cyan glow on the left rim, magenta/violet glow on the right rim, subtle floor bloom under the device.
- Mood: clean black-market cyberdeck, premium neon HUD, restrained glass terminal, readable mobile game UI.
- Palette: pure black base, dark navy panels, white/off-white primary text, muted blue-gray metadata, cyan for energy/positive/live labels, magenta/pink for heat/negative/signal accents, violet for primary navigation.
- Layout order: status bar, AG3NT_OS/PIRAT3 identity, Eidolon ID, hamburger button, cityscape upper-half background, side-by-side circular Energy/Heat rings, one Live Signal card, S1LKROAD 4.0 header, exactly three compact market rows, three-button bottom nav, version footer, phone home indicator.
- Do not add: desktop dashboard chrome, matrix-green overload, large stat strips, wide hero banners, noisy terminal grids, extra cards, factions, territory map, node missions, raids, or 3D map on this Phase 1 home.
- Rounded geometry: this target uses small rounded phone/UI geometry, not sharp ASCII frames. Borders stay thin and subtle.

---
