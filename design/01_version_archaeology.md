# Version Archaeology — Cybertrader prior iterations

Source material: four deployed Vercel builds. WebFetch pulls only server-rendered HTML, so client-rendered routes returned thin content. Findings below are grounded in what actually came back — gaps are flagged, not invented.

---

## v1 — cybertrader-v1.vercel.app
**Stage archetype:** Raw pirate broadcast. Closest in spirit to the **Ag3nt_0S//pIRAT3** tier described in BUILD_PLAN §6.

**Aesthetic:**
- Pure green-on-black phosphor CRT. No secondary hues observed on landing.
- Heavy ASCII box-drawing (├ ─ │ ╔ etc.) forming frames and dividers.
- Binary-string visual noise at top: `01001011 01100101 01110000 …`
- Central ASCII portrait titled **"BLACK FLAG CURSOR"** — an iconic face/skull-style glyph serving as the brand mark.

**Diegetic copy worth preserving as design vocabulary:**
- Header: `ROGUE TERMINAL BROADCAST`
- Device path: `/dev/tty-pantheon`
- Telemetry: `packet_loss=13%`, hex noise values
- State: `STREAMING`, `Rootkit channel stabilizing`
- Economy stub: `token: $OBOL_LOCKED`

**What worked:** Committed single-color palette. Feels like an actual pirate signal, not a cyberpunk sticker. `$OBOL_LOCKED` is an excellent diegetic way to communicate the two-ledger story from BUILD_PLAN §9 without a modal.

**What to elevate:** Needs the secondary colors defined in BUILD_PLAN §17 (cyan for interactables, red for Heat, amber for warnings) *used sparingly* — current state is too monochrome to signal action affordance. Scanlines/jitter were implied in copy ("scanline degradation") but not confirmed as motion.

---

## v2 — cybertrader-v2.vercel.app
**Status: GAP.** SPA returned only `<title>CyberTrader: Age of Pantheon</title>` and a cyberpunk subtitle. No markup, no text, no confirmable layout. Two options:
1. I can try specific sub-routes (`/login`, `/market`, `/boot`) to pierce the client router.
2. You can drop screenshots into `design/reference/v2/` and I'll work from those.

Recommend option 2 — screenshots are higher-fidelity than guessing routes.

---

## v3 — cybertrader-v3.vercel.app
**Stage archetype:** Boot / login gateway. Shows the intended first-launch flow from BUILD_PLAN §5.

**Aesthetic:** Dark cyberpunk with neon accents (cyan/magenta/acid-green implied, not hex-confirmed). Monospaced angular typography. Leetspeak branding in play: **"Ag3nt_0S//pIRAT3"**.

**Narrative / copy captured:**
- World-anchor line: `2077. Pantheon shattered...`
- Boot telemetry: `ESTABLISHING SYSLINK`, `ROUTING VIA ONION RELAY`
- Final prompt: `ENTER SIGNAL` — acts as the CTA/login button

**Structure:** Vertical narrative flow — title → lore anchor → boot-sequence ticker → single CTA. This is a strong template for the Intro Cinematic + Wallet/Login screens (BUILD_PLAN §16 items 1–2). Treat this pattern as the **canonical opening grammar** across all three OS tiers.

**What worked:** Narrative pacing. The boot messages *are* the UI — no decorative cards, no empty neon boxes (exactly what BUILD_PLAN §17 warns against).

**What to elevate:** Boot sequence needs timing/animation spec (Reanimated typewriter cadence + selective glitch on key tokens). Need to confirm whether this screen leads into an actual dashboard or is a teaser page.

---

## str33t-trad3r-v1.vercel.app
**Stage archetype:** Functional dashboard. Closest to an **AgentOS**-tier module grid (BUILD_PLAN §11 Tier 2), predating the PantheonOS mental model.

**Module inventory captured (this is gold):**
| Key | Module | Maps to BUILD_PLAN |
|---|---|---|
| D | DECK | Cyberdeck shell / profile |
| $ | MARKET | S1LKROAD 4.0 §7 |
| O | OPS | Missions / node puzzles §15 |
| G | GRAPH | Chart view / market data |
| I | INV | Inventory §16 |
| R | RAIDS | Advanced raids (PantheonOS-tier) |
| C | CREW | Crew / faction war |
| A | RANKS | Rank + Leaderboard §10 |

**Header:** `AgentOS // PIRAT3` with `PANTHEON` co-branding — interesting hybrid that contradicts the clean three-tier naming in BUILD_PLAN. Going forward we'll rename per the plan: **Ag3nt_0S//pIRAT3**, **AgentOS**, **PantheonOS** — no slash-mashing.

**Interaction model:** Keyboard-driven shortcut keys (D/$/O/G/I/R/C/A) alongside labels. This is the **strongest preserved pattern** across versions — retain it. Hacker-deck feel without sacrificing touch accessibility if we also make them tap targets.

**What worked:** Module grid as the primary nav. Single-letter keys. Clear system-boot messaging (`AgentOS initializing...`) consistent with v3's boot grammar.

**What to elevate:**
- `CREW` and `RAIDS` appearing at an AgentOS-adjacent tier violates the BUILD_PLAN progression (those are PantheonOS §11 Tier 3). Either the naming was aspirational or the prior build didn't gate features. **Strict fix: gate modules by OS tier in the new design.**
- No evidence of Heat / Energy / rank meters in the header — these are mandatory-visible per BUILD_PLAN §6. Add to every OS tier's persistent chrome.

---

## Cross-version synthesis → carries into Pass 1

**Preserve (the DNA):**
1. Green-on-black phosphor base layer (v1) as Ag3nt_0S//pIRAT3's floor.
2. ASCII-portrait brand glyphs per OS tier (v1's BLACK FLAG CURSOR pattern).
3. Single-letter keyboard shortcuts for module nav (str33t-trad3r).
4. Boot-sequence-as-UI grammar (v3): `ESTABLISHING SYSLINK` / `ROUTING VIA ONION RELAY`.
5. `$OBOL_LOCKED` diegetic treatment for gated economy states.
6. Vertical narrative opening flow (v3) for intro + login.

**Evolve (problems to fix):**
1. Palette discipline — prior versions underused the cyan/red/amber/violet accent system mandated by BUILD_PLAN §17. Result: action affordance was muddy.
2. Tier discipline — prior builds leaked PantheonOS features (RAIDS, CREW) into AgentOS-tier UI. New design strictly gates by OS tier and makes the progression a game mechanic, per BUILD_PLAN §11.
3. Persistent chrome — Energy meter, Heat gauge, Rank chip, OBOL/$OBOL ledger must be visible *every frame*. Prior dashboards didn't guarantee this.
4. Motion spec — scanlines/glitch were implied but never specified. Pass 2/3 must define exact Reanimated timing curves.
5. Brand naming — drop `PIRAT3` mashups on the AgentOS+ tiers. Each OS has one canonical name.

**Genuinely missing across all four versions (design-opportunity gaps):**
- Pantheon Memory Shard codex — no evidence any prior build shipped the Archivist/lore system (BUILD_PLAN §16 screen 19).
- 3D / pseudo-3D Neon Void territory map (§15). None of the prior builds had this.
- Faction selection ceremony (§14). No faction UI observed.
- The "Ghost in the Shell retro anime" aesthetic layer is largely absent from prior versions — they read more as generic hacker-terminal than GitS-coded. This is the single biggest aesthetic opportunity for the overhaul.

---

## Open questions before Pass 1

1. **v2 screenshots** — want to drop any into `design/reference/v2/` so I can fill the gap?
2. **str33t-trad3r-v1 dashboard depth** — I only see the module header. Are the inner panels (market order ticket, chart layout, inventory grid) worth a second, deeper fetch of specific routes, or do you already know they weren't built out?
3. **Authoritative naming** — confirming I should use exactly `Ag3nt_0S//pIRAT3`, `AgentOS`, `PantheonOS` and drop any `// PIRAT3` co-branding from AgentOS+ tiers going forward. (This is what BUILD_PLAN §2 says; flagging because prior builds conflated them.)
