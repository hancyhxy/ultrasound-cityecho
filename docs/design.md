# Design System Specification: Ultrasound CityEcho

> Visual language for an asynchronous, place-bound, song-by-song listening companion.
> Voice stays literary; visual frame becomes warm, social, and emoji-fluent.

---

## 1. Overview & Creative North Star

**Creative North Star: Late-Night Friend's Room**

Earlier iterations of Ultrasound leaned art-house: Fraunces serif on midnight-indigo with amber accents — beautiful, but read as *solemn-curatorial*. The product concept is the opposite: it's an asynchronous chorus of strangers leaving notes for each other in city corners. The visual language must say **"a friend turned the lights low and put a song on for you"**, not "step into the gallery."

We achieve this through three moves:

1. **Dark Lounge over Dark Museum.** Backgrounds shift from `oklch(0.16 0.04 270)` deep midnight to a layered dark-purple/black with neon accent washes — closer to *backstage at a small venue* than *night-time public space*.
2. **Chunky Pop, Sharp Voice.** Display type becomes a **bold uppercase sans-serif** with tight tracking and big size jumps. The result feels like a poster, not a magazine. Body voice (the one-line trace) stays literary — the *frame* changes, not the *writing*.
3. **Emoji as First-Class Iconography.** Stickered emojis floating around portraits and as reaction states replace abstract lucide icons wherever the meaning is emotional rather than functional. Lucide stays for navigation/utility (settings, close, chevron); emoji owns mood/reaction/affordance-with-feeling.

### What this design.md covers (and doesn't)

- **Covers:** color tokens, type scale, radius scale, elevation/glow, component shapes, layout grammar, do/don't.
- **Does not cover:** features, copy, information architecture, or any product mechanic. We borrow visual grammar; we do not borrow product surfaces (no reaction-tray UI, no Q&A list, no "weekly recap" countdown card, no inbox metaphor — those are someone else's product, not ours).

### Continuity rules with prior iterations

- The **Fraunces serif** is not removed. It is **demoted to a specialized role**: pull-quote face for trace `note` italics and `/me` chapter narration. Headlines, buttons, tabs, captions all move to the new bold sans-serif.
- ITER-2/3 portal links and ITER-4 narrative chapter structure stay intact. Only their visual costume changes.
- The bottom-tab `PhoneShell` keeps its 4 tabs; the icons may switch from Lucide outlines to emoji-style or filled glyphs (TBD in ITER-6).

---

## 2. Colors: Neon-on-Plum

The base shifts from cool midnight to a **plum-violet black**; accents shift from amber to a **magenta-purple gradient pair** with a hot-pink highlight. The amber `--warm` token is retained as a deep-yellow secondary for sparingly used "human" punctuation (like a candle in a dark room), but it loses its primary-accent role.

### Token map (proposed for `styles.css` rewrite in ITER-6)

| Token | Old (current) | New (target) | Purpose |
|---|---|---|---|
| `--background` | `oklch(0.16 0.04 270)` midnight indigo | `oklch(0.13 0.04 295)` deep plum-black | Page base |
| `--surface` | `oklch(0.21 0.045 272)` | `oklch(0.18 0.05 295)` | Card base |
| `--surface-elevated` | `oklch(0.26 0.05 274)` | `oklch(0.23 0.06 295)` | Lifted card |
| `--primary` (accent A) | `oklch(0.72 0.16 295)` violet | `oklch(0.62 0.25 305)` neon purple | Primary CTA, glow |
| `--primary-bright` (new) | — | `oklch(0.72 0.27 320)` magenta | Gradient endpoint, neon halo |
| `--accent-hot` (new) | — | `oklch(0.66 0.28 12)` hot-pink | Highlight strokes, CTA underline |
| `--warm` (demoted) | `oklch(0.82 0.13 65)` amber | unchanged but used **sparingly** | Trace mood pill `calm`/`hopeful` only |
| `--foreground` | `oklch(0.96 0.01 80)` warm white | `oklch(0.97 0.005 290)` cool white | Body text |
| `--muted-foreground` | `oklch(0.68 0.03 270)` | `oklch(0.62 0.04 295)` | Secondary text |

### The "Neon Wash" Rule

**Explicit instruction:** every full-screen background must carry a low-opacity radial wash blending `--primary` and `--primary-bright`. This replaces the existing `--gradient-aurora` and is what ties screens visually to the reference grammar.

```css
--gradient-night: radial-gradient(at 18% 8%, oklch(0.45 0.22 305 / 0.55), transparent 55%),
                  radial-gradient(at 82% 18%, oklch(0.5 0.25 320 / 0.45), transparent 60%),
                  radial-gradient(at 65% 92%, oklch(0.4 0.18 280 / 0.4), transparent 55%);
```

### The "Neon Halo" Rule

Replaces traditional drop-shadows for elevation. Any portrait, hero card, or modal floats inside a **soft glow ring** in `--primary-bright` rather than casting a downward shadow. This is the most distinctive visual move from the reference and the cheapest to apply globally.

```css
--shadow-neon: 0 0 32px -2px oklch(0.62 0.27 305 / 0.55),
               0 0 64px -8px oklch(0.72 0.27 320 / 0.35);
```

### The "No Pure Black" Rule

Same as before: never `#000000`. New baseline darkest is `oklch(0.08 0.04 295)` — still deep, but plum-tinted so neon accents sit in the same family.

---

## 3. Typography: Bold Display, Quiet Body, Demoted Serif

We move from the editorial **Fraunces + Inter + JetBrains Mono** triad to a **two-and-a-half** system:

1. **Display (primary):** A bold geometric sans-serif. Use **Inter** at `font-weight: 800` with negative letter-spacing as a starting point (already loaded). If we add a face: SF Pro Display Black or a similar wide-bold display sans. Used for screen titles, single-word headers, percentage/large-number callouts. Always **uppercase or sentence-case sans tight kerning**.
2. **Body (secondary):** Inter at `font-weight: 400-500`. Small captions and chip labels use Inter `font-weight: 600` with `letter-spacing: 0.05em` and uppercase — no longer JetBrains Mono. This is a quiet move that consolidates the type system.
3. **Pull-quote (specialized, the "half"):** **Fraunces italic** survives as a single-purpose face for two contexts only:
   - Trace `note` rendering (the one-sentence stranger note)
   - `/me` chapter narration ("Somewhere in the city, someone is reading a song you left behind.")
   Anywhere else we previously used `font-display`, switch to the bold sans display. This is what keeps Ultrasound's literary spine while the surface goes pop.

### Type scale (target)

| Role | Class direction | Old example | New example |
|---|---|---|---|
| Hero | `text-[40px] font-extrabold tracking-[-0.02em]` | "A city, organised by feeling." Fraunces 30 | "STRANGERS / SONG BY SONG" Inter 800 40 |
| Section title | `text-[18px] font-bold uppercase tracking-[0.04em]` | "Strangers becoming familiar" mono small-caps | "RECENTLY HEARD" Inter 700 uppercase |
| Body | `text-[14px]` Inter 400 | unchanged in role | unchanged |
| Pull-quote | `font-display italic text-[15-22px]` Fraunces | unchanged in role | unchanged (specialized) |
| Caption | `text-[10px] font-semibold uppercase tracking-[0.06em]` Inter | mono small-caps | Inter 600 uppercase |

### The "No Mono" Rule

JetBrains Mono is deprecated for UI labels. It's an art-house signal that no longer fits. If we ever need monospace (e.g. timestamps in a debug surface), use it inline only — never as the global caption face.

---

## 4. Radius & Shape: Chunky Pill, Generous Card

The reference grammar is unmistakable: **everything is more rounded than you expect**. We codify this as a numeric ramp (replacing the current `--radius: 0.875rem` baseline).

| Token | Value | Used on |
|---|---|---|
| `--radius-pill` | `9999px` | Buttons, tabs, chips, search bars, segmented controls |
| `--radius-card-lg` | `1.5rem` (24px) | Large content cards (trace items, recap cards) |
| `--radius-card-xl` | `2rem` (32px) | Hero portraits, modal sheets |
| `--radius-portrait` | `2.5rem` (40px) | The user/stranger portrait frame (a soft superellipse-ish look) |
| `--radius-sm` | `0.75rem` | Small chips inside cards |

### The "Pill or Card" Rule

**Explicit instruction:** every interactive element resolves to one of two shapes — a **pill** (height ≈ width × 0.3, fully rounded) or a **card** (`--radius-card-lg` or larger). No 4-8px subtle rounds; no sharp corners.

### The "Stickered Portrait" Rule

User and stranger portraits no longer sit in plain circles. They use:
- A **portrait-frame radius** (`--radius-portrait`, the 40px softened-square)
- A subtle **neon halo** (`--shadow-neon`, see §2)
- **Emoji stickers floating around the frame** (3-5 emojis at small angular offsets, half-overlapping the frame edge)

This is the highest-impact single move from the reference and the most identifiable visual signature of the new system.

---

## 5. Components: Chunky, Glowy, Emoji-Aware

### Buttons

- **Primary (CTA):** `--radius-pill`, gradient fill from `--primary` to `--primary-bright`, white text, `font-weight: 700`, height **48-56px** (chunky, not slim). Hover: brighten gradient by ~8%, do not shift opacity.
- **Secondary:** `--radius-pill`, `--surface-elevated` fill at 60% opacity, ghost border `oklch(1 0 0 / 0.12)`, white text. Used for "Settings" / "Close" type actions.
- **Tertiary (icon-only):** Pill-circle (`h-9 w-9 rounded-full`), `glass` background. Used in headers.

### Segmented Control / Tabs

The "RECENT / SPACE" pattern from the reference is our standard 2-3-segment switcher.

- Outer container: `--radius-pill`, `--surface-elevated` at 60%
- Active segment: white text on `--primary` to `--primary-bright` gradient, full pill, soft inner shadow
- Inactive segment: `--muted-foreground` text, no background
- Always **inside** the parent component's frame, never floating

### Trace cards (re-skin of existing)

Old: glass card on indigo with amber pill mood.
New: `--radius-card-lg` card on `--surface` with **emoji-as-mood** in the corner instead of an amber text pill. The emoji is **sticker-style** (subtle outer white stroke + ~12% drop-shadow) at ~20px.

Emoji ↔ mood mapping (proposed in ITER-6 implementation):

| Mood | Emoji |
|---|---|
| calm | 🫧 |
| lonely | 🥺 |
| hopeful | 🌤️ |
| alive | 🔥 |
| soft | 🥹 |
| homesick | 🥲 |
| focus | 🧿 |
| warm | 🤍 |

### Bottom navigation

The PhoneShell tab bar keeps its 4-tab structure but:
- Background: `glass-strong` upgraded with the neon-wash gradient at 25% opacity
- Active tab indicator: a **filled pill** behind the icon + label (not the current `text-warm` color shift)
- Icons: switch from outline-style Lucide to **filled-style** Lucide variants (`Map` → keep, but stroke 2.4 → fill); active icon is white on the pill

### Portrait sticker frame (new, signature)

Used on `/me` (the user) and inside trace modals (a stranger). See §4 "Stickered Portrait" rule. Implementation outline:

```jsx
<div className="relative">
  <div className="rounded-[40px] overflow-hidden shadow-neon ring-1 ring-white/10">
    {/* portrait fill — gradient or photo */}
  </div>
  {/* 3-5 floating emoji stickers */}
  <span className="absolute -top-2 -left-3 text-[28px] rotate-[-12deg] drop-shadow-md">🥰</span>
  <span className="absolute -top-3 -right-2 text-[24px] rotate-[10deg] drop-shadow-md">🔥</span>
  <span className="absolute -bottom-2 -right-3 text-[26px] rotate-[8deg] drop-shadow-md">🥹</span>
</div>
```

### Search field

- `--radius-pill`, `glass` fill, leading lucide `Search` icon, body text Inter 400 at 14px, height 44-48px. Same shape as a button — the field *is* a pill.

---

## 6. Layout & Density Patterns

The reference grammar pushes a specific density rhythm: **a single dense focal block + breathing room above and below**. We adopt the same.

### "Hero + Two-Up + List" rule

Most screens follow this stack:
1. **Top:** thin header (title pill or back button + page title in caps + settings icon)
2. **Hero:** one chunky focal element — either a stickered portrait, a big headline, or a gradient card with one number
3. **Two-Up:** a tab/segment switch (pill, see §5)
4. **List:** a vertical list of cards using `--radius-card-lg`

This replaces ITER-1's "feed of equal-weight glass cards" pattern on `/traces`. The feed becomes the *list section* of the new pattern; the hero above it changes per screen.

### `/playing` exception (the redesign target of ITER-7)

The current 6-tile dashboard is replaced by a **single hero portrait + danmaku + one chunky now-playing pill**. Nothing else above the fold. Specifics deferred to ITER-7 — design.md only mandates the principle: *one focal portrait, glow halo, song title in display sans below it; everything else (mood pill, place, "leave a trace" button) drops into a bottom drawer or chunky pill at viewport edge*.

### Spacing scale (unchanged from Tailwind defaults but with conventions)

- Between sections in a scrolling page: `mt-12` (`/me` literary chapters keep `mt-20+`)
- Inside a card: `p-5` for hero cards, `p-4` for list cards
- Between list cards: `gap-3` (was `gap-2.5`)

---

## 7. Voice & Content Continuity

Critical reminder: **only visual layer changes**. The product copy stays.

- Trace `note` rendering: still **Fraunces italic in quotes**.
- "Strangers, song by song." headline: re-render in the new bold sans display, but **the words don't change**.
- "Each place holds its own quiet listening." `/index` body: same words, new sans face.
- `/me` chapter Roman numerals (I. II. III. IV.): **keep**, render in Fraunces italic at smaller size as a literary holdover punctuating the otherwise pop visual.
- Footer one-liner: **keep** ("Somewhere in the city, someone is reading a song you left behind.") in Fraunces italic with the new colour palette.

This protects the experience-evaluation thesis: *we changed visual frame, not voice*.

---

## 8. Do's and Don'ts

### Do

- **Do** apply the neon wash + halo combo as the global elevation system. It is the single most identifying visual move from the reference and propagates well across all screens.
- **Do** use emoji as visible iconography for emotion/reaction. Lucide is not banned but is now demoted to navigation/utility.
- **Do** treat every interactive surface as a pill or a card. If you're tempted to make a 6px-rounded button, you are designing the wrong system.
- **Do** retain Fraunces italic for the two specialized roles (trace `note`, `/me` chapter narration). The contrast between bold-pop frames and small italic body is exactly what gives Ultrasound its tonal signature.
- **Do** keep the "stickered portrait" pattern reserved for human-presence moments — user identity, stranger reveal, "you were not alone" peak. Overusing it dilutes its impact.

### Don't

- **Don't** import the reference's product mechanics. No reaction-tray, no Q&A list, no inbox tabs, no leaderboard, no "weekly recap" countdown — those are *their* features. We borrow only the visual grammar.
- **Don't** pure-black anything. The new dark base is plum-black (`oklch(0.13 0.04 295)`).
- **Don't** rely on solid 1px borders to separate sections. Use surface-tone shifts and glow halos.
- **Don't** decorate with emoji where the meaning is purely structural — settings cog stays a Lucide icon, not 🛠️. Emoji is for *emotion expressed as a visible object*.
- **Don't** delete Fraunces. The italic pull-quote is part of the voice that distinguishes this product from the reference. Demote, don't remove.
- **Don't** introduce a new brand color outside the magenta/purple/pink/plum family. The current `--warm` amber survives only as a sparing secondary accent (e.g. `calm`/`hopeful` mood emoji-strings); it cannot return to a primary CTA role.

---

## 9. Migration sequence (forward reference into the iteration log)

This document is the **rule set**; the application of it is sequenced across the next iterations:

| Iteration | Scope |
|---|---|
| **ITER-6** (next) | Token swap on `src/styles.css` — colors, radius scale, gradients, shadow-neon. Plus minimal class adjustments where token names changed. No structural HTML changes. Visual smoke test across all 5 routes. |
| **ITER-7** | `/playing` structural redesign per §6 exception (single hero portrait + danmaku + chunky now-playing pill). |
| **ITER-8** | Stickered-portrait component built and applied to `/me` Section 0 and inside trace modal. Bottom-nav pill indicator. |
| **ITER-9+** | Emoji-as-mood mapping rolled out to trace cards and Playing-page mood pill. |

Each iteration gets its own log entry with its own pain point and outcome — design.md only stops the bleeding by making sure every implementer is reading from the same rule book.
