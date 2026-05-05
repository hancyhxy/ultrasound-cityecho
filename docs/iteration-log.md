# Iteration Log — Ultrasound CityEcho

> Living log of every UX/product iteration we make on top of the original Lovable.dev prototype.
> Used as source material for the **Experience Evaluation** deliverable.

---

## How this log works

Each entry records **one coherent iteration** — a set of changes driven by a single experience pain point or design hypothesis. We write the entry **at the time of the change**, before/while we make it, never reconstructed afterwards.

### Why "Experience" and not "Usability"

This project sits at the *Digital Experience* end of the spectrum, not the productivity-tool end. So our evaluation dimensions are deliberately not Nielsen's classic usability heuristics (efficiency, error prevention, learnability, consistency, recognition-vs-recall…). Those measure whether a tool *works*. They don't measure whether an experience *moves you*.

We borrow Norman's tabular format (one row per issue, with severity + intervention + outcome) but swap the evaluation axis to a set of **experience dimensions** that match what Ultrasound is actually trying to do: turn solitary listening in public space into a quiet, asynchronous companionship with strangers.

### Our experience dimensions

When we describe what an iteration improved (or regressed), we tag it with one or more of these axes:

| Dimension | What it captures | Example signal |
|---|---|---|
| **Emotional resonance** | Does the moment carry feeling, or feel utilitarian? | Italic note vs. plain caption; "a stranger" vs. "@username" |
| **Pace & breathing room** | Does the UI rush you, or let you sit? | Sentence-forward feed vs. dense card grid; loading delay tolerated as anticipation |
| **Intimacy with strangers** | Does it feel like overhearing, eavesdropping, or being-with — vs. broadcasting? | One-sentence trace at a place vs. a profile page with follower count |
| **Discoverability of presence** | Do I sense others are here without being told? | Live "12 listening now" pulse vs. a static count |
| **Memory & ephemerality** | What stays, what fades, on whose terms? | "2h / 5h / 1d / 6w" decay; story bubbles vs. permanent profiles |
| **Voice & tone** | Does the copy sound like a product or like a person? | "Each place holds its own quiet listening" vs. "Tap to view details" |
| **Sense of place** | Does this moment feel rooted in a real city, or floating? | "T9 · Strathfield, tunnel just before home" vs. a generic map pin |
| **Companionship in solitude** | When I'm alone with my headphones, does it make me less alone? | Danmaku of strangers' notes drifting across the song you're playing |

These come from the brief (UTS Digital Experience Studio · Section D — *what we feel here, song by song*) and from the design language Evelyn established in the Lovable prototype, not from a generic UX framework.

### Severity scale (adapted from Norman / Nielsen)

We keep the 0–4 numeric scale because graders recognise it, but redefine the labels for experience:

| Severity | Meaning in our context |
|---|---|
| 0 — *Not a problem* | We considered this and chose to keep the original behaviour |
| 1 — *Cosmetic* | Tone/voice/visual nuance; small but compounds across screens |
| 2 — *Minor friction* | Breaks the spell briefly; user recovers in seconds |
| 3 — *Major friction* | The wrong product is being communicated; experience risks reading as generic |
| 4 — *Catastrophic mismatch* | The interaction directly contradicts the brief (e.g. competing with Spotify on functional music playback) |

---

## Iteration entries

### Format reference

```
### ITER-N · YYYY-MM-DD · <one-line headline>

| Field | Content |
|---|---|
| Pain point | What experience problem we noticed in the previous state |
| Source of insight | Where the problem came from (own playtest / tutor feedback / Evelyn / brief / heuristic walkthrough) |
| Severity | 0–4 |
| Dimension(s) affected | One or more from the table above |
| Hypothesis | What we believed the change would do |
| Change made | Concrete files / components / copy added, removed, modified |
| Outcome | What we observed after — even if "not yet evaluated" |
| Trade-offs | What we knowingly gave up |
| Commit / PR | Short SHA or PR link |
```

---

### ITER-1 · 2026-04-30 · Refactor music-app prototype into a stranger-traces experience

| Field | Content |
|---|---|
| **Pain point** | The Lovable.dev prototype handed us a competent **music app** — a library tab, a player, a profile, a music map. It worked, but it competed directly with Spotify/Apple Music on functional ground we cannot win, and it carried none of the brief's intent: *song by song, what strangers felt here*. The app was about *playing music*, not about *being with strangers through music in a place*. |
| **Source of insight** | Brief re-reading + heuristic walkthrough of the prototype as it stood after Evelyn's `486e795 Update site info for publish`. Asked ourselves at every screen: *"what feeling does this leave?"* Answer was consistently "this is fine, it's an app." |
| **Severity** | **4 — Catastrophic mismatch.** The product as shipped would have been graded as "music app clone with a cute map," not as a digital experience entry. |
| **Dimension(s) affected** | Emotional resonance · Intimacy with strangers · Sense of place · Voice & tone · Companionship in solitude |
| **Hypothesis** | If we **strip the functional music-app surface** (library, player, profile-as-identity) and **rebuild around a single primitive — the *trace*** (one stranger + one song + one place + one sentence + one mood) — every remaining surface will be forced to express the brief instead of competing with Spotify. Removing the player is the riskiest call: we keep a "Now Playing" surface, but its job becomes *hosting other people's traces over your song*, not playback control. |
| **Change made** | **Deleted (4 routes)**: `routes/library.tsx`, `routes/map.tsx`, `routes/player.tsx`, `routes/profile.tsx` — every screen that framed the product as "your music app".<br><br>**Renamed**: `routes/profile.tsx → routes/me.tsx` (72% similar — kept the structure, dropped the *profile-as-identity* framing; "me" is a soft, lowercase pronoun, not a stage).<br><br>**Added (3 routes)**: `routes/traces.tsx` (the new home — IG-style story bubbles + sentence-forward feed of strangers' one-line traces), `routes/playing.tsx` (now-playing surface where strangers' traces drift over your song as danmaku), `routes/playlist.tsx` (place-anchored seed playlists).<br><br>**Added (5 components)**: `CollageBoard.tsx`, `DanmakuOverlay.tsx` (the core mechanic for *companionship in solitude*), `LocationDrawer.tsx` (place-as-context bottom sheet on the map), `FlipToggle.tsx`, `DebugNav.tsx`.<br><br>**Added (data layer)**: `lib/seed-data.ts` with **hand-written** stranger traces — *"missed my train on purpose to finish it"*, *"the barista remembered my order. small, but it counted."* Each trace carries `forSong` so the danmaku overlay knows which strangers to surface for the song you're playing. `lib/storage.ts` for local persistence.<br><br>**Voice rewrite** of `index.tsx` headline: *"A city, organised by feeling."* — replacing the prototype's product-style copy. |
| **Outcome** | *Not yet evaluated with users.* Internal walkthrough on 2026-05-06: every screen now answers the brief in a single sentence ("read what a stranger left here"), not "play music." The risk we knew we were taking — losing the "real music app" affordance — feels worth it: there is no point in being a worse Spotify. |
| **Trade-offs** | (1) **No real audio playback yet.** `playing.tsx` is currently a visual surface; danmaku is the feature, audio is implied. Acceptable for a design-experience deliverable but flagged for ITER-N if we ever go further. (2) **Lost the polished `map.tsx` (324 lines)** that Evelyn's Lovable bot generated — the new map on `index.tsx` is more abstract (radial gradients + pulse pins) and intentionally less map-like, because *literal cartographic accuracy* fights *sense of place as feeling*. (3) Walked away from the `library` framing entirely — we have *seed playlists* but no "your music library." This is on purpose: the product has nothing to do with what *you* listen to in private. |
| **Commit** | `1910a79` — *Refactor music prototype into traces + danmaku + collage UX* |

---

### ITER-2 · 2026-05-06 · Make song + place on a trace tappable, routing into the shared playing room

| Field | Content |
|---|---|
| **Pain point** | When a user opens a stranger's trace (either in the feed on `/traces` or inside the story modal), the song line — *"Cha Cha — Freddie Dredd"* — and the place tag — *"FITNESS FIRST BROADWAY"* — are displayed as **plain text**. There is no visual affordance saying "you can step into this." Reading a stranger's trace becomes a dead-end act of consumption: *I see what they felt, and now what?* The product's core mechanic — *being with strangers through the same song in the same place* — is one tap away but not invited. |
| **Source of insight** | Own playtest, 2026-05-06. Opened `/traces`, tapped the green `A` story bubble, read Ash's gym trace. Wanted to hear what they were hearing. Couldn't. The whole product collapses on this missing tap. |
| **Severity** | **3 — Major friction.** Not catastrophic (you can still navigate manually to `/playing?song=…&artist=…`), but the core feedback loop the product is designed around — read a trace → step into the song → see other strangers' traces drift over you on `/playing` via the danmaku overlay — is gated behind URL-bar typing. The mechanic exists in the code but is **invisible to the user**. |
| **Dimension(s) affected** | Companionship in solitude · Discoverability of presence · Intimacy with strangers |
| **Hypothesis** | If we make the song row a tappable `<Link>` that routes to `/playing?song={forSong.song}&artist={forSong.artist}&loc={locationId}`, the trace becomes a **portal** rather than a postcard. Reading a stranger's note will pull you into the room they were in (same song, same place if known), where `findTracesForSong()` will surface them and other strangers as danmaku — closing the loop *read → enter → be-with*. We use `forSong` (not `song`) because the overlay aggregates strangers by which song their note was written *for*, which is the unit of shared experience. The place tag gets the same treatment, routing to `/?pin={locationId}` (place-as-portal). |
| **Change made** | *(In progress as of this entry.)* (1) Wrap the song+artist + mood pill block on the trace cards with a `<Link>` to `/playing` carrying `forSong` and `locationId`. (2) Wrap the place row (`MapPin` + place name) with a `<Link>` to `/` carrying the pin id. (3) Apply both treatments **consistently** to both render sites — the small feed card on `traces.tsx:111-148` and the large story-modal card on `traces.tsx:184-204`. (4) Add a subtle hover/active state (border-warm-on-hover already there for the outer card, add a small chevron + `transition-colors` on the song row to teach the affordance without shouting). |
| **Outcome** | Shipped 2026-05-06. HMR walkthrough: tapping a song row on either render site routes to `/playing?song=…&artist=…&loc=…`, which correctly drives `findTracesForSong()` so the danmaku surfaces other strangers' notes for the same song. Tapping the place row routes to `/?pin=…` and auto-opens the LocationDrawer for that pin (see ITER-3 below — solved in the same patch). |
| **Trade-offs** | (1) Trace cards now have **nested interactive regions** (outer `<article>` is currently passive; inner song link + place link are clickable). We must avoid putting the whole article into a `<Link>` too — nested links break the a11y contract. We keep the article passive; only the meta rows are tappable. (2) The mood pill stays outside the song link's hit area (visual proximity but separate hit target). (3) On the small feed card we use a tiny `Play` icon as the affordance hint; on the modal's larger card we use a circular play button — the affordance scales with the card. |
| **Commit / PR** | TBD |

---

### ITER-3 · 2026-05-06 · Place link should auto-open the LocationDrawer (folded into ITER-2)

| Field | Content |
|---|---|
| **Pain point** | Anticipated as a follow-up of ITER-2: routing to `/?pin=broadway` lands on the map screen but does **not** auto-open the `LocationDrawer` — the user has to find the right pin and tap it again. The portal half-works. |
| **Source of insight** | Self-spotted while implementing ITER-2. ITER-2's trade-off note explicitly logged this as a known gap. |
| **Severity** | **2 — Minor friction.** Recoverable in seconds, but breaks the "trace as portal" promise mid-step. |
| **Dimension(s) affected** | Discoverability of presence · Sense of place |
| **Hypothesis** | Adding a `pin` query param (zod schema) to `index.tsx` and seeding `selectedId` from it will let the existing `LocationDrawer` open automatically with the right context — costing ~5 lines, less than the cost of writing the deferral note in ITER-2 itself. |
| **Change made** | `routes/index.tsx`: add `validateSearch` with `z.object({ pin: z.string().optional() })`, read `pin` via `Route.useSearch()`, seed `useState(pin ?? null)` and a `useEffect([pin])` to react to URL-driven navigation (e.g. user comes from a trace, then taps another trace — drawer re-opens for the new pin). |
| **Outcome** | Verified via HMR: navigating to `/?pin=wynyard` lands on the map with the Wynyard LocationDrawer already open. Closing the drawer manually does not strip the URL param (intentional — back-button behaviour stays predictable). |
| **Trade-offs** | The URL stays `?pin=…` after the user closes the drawer manually. Acceptable; if it bothers anyone we can sync state → URL. We chose **not** to do that today because it would mean using `navigate()` inside `onOpenChange`, and over-syncing URL with transient UI state is exactly the kind of complexity that creates back-button surprises. |
| **Commit / PR** | TBD |

---

<!-- TEMPLATE FOR FUTURE ENTRIES — copy below this line and fill in -->

---

<!-- TEMPLATE FOR FUTURE ENTRIES — copy below this line and fill in -->

<!--
### ITER-N · YYYY-MM-DD · <headline>

| Field | Content |
|---|---|
| Pain point |  |
| Source of insight |  |
| Severity |  |
| Dimension(s) affected |  |
| Hypothesis |  |
| Change made |  |
| Outcome |  |
| Trade-offs |  |
| Commit / PR |  |
-->

---

## Cross-iteration patterns (filled in as the log grows)

This section is for spotting recurring themes across multiple iterations — the kind of insight you want to lead the Experience Evaluation document with.

- *(empty until ITER-3+)*

---

## How this maps to the Experience Evaluation deliverable

When we write the submission document:

1. **Lead** with the experience dimensions table (above) — declare the axes we're evaluating against and *why those axes, not Nielsen's*.
2. **Body** = a Norman-style table where each row is one ITER-N entry, columns are: Pain point · Severity · Dimension · Change · Outcome.
3. **Closing** = the *cross-iteration patterns* section as a short reflection: what we learned about designing experience (not function) over the course of the project.

Keep this log clean and current; it *is* the deliverable's first draft.
