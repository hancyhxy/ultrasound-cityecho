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

### ITER-4 · 2026-05-06 · Rewrite `/me` from data-dashboard into city-storytelling

| Field | Content |
|---|---|
| **Pain point** | The current `/me` screen is a Spotify-Wrapped-style dashboard: 3 stat tiles (23 places / 186 songs saved / 47 traces left), a "Year so far" bar chart, a strangers-avatar row with a "+12" overflow chip. Information **is there**, but it's communicated as **counts**, not as a story. The numbers do nothing the user cannot already guess about themselves; they generate no feeling. The screen treats the user as a *consumer of music* and reports their consumption volume. That framing fights the entire rest of the product, which is built around *being-with strangers in a city through song*. |
| **Source of insight** | Own playtest 2026-05-06 + designer's reference dump: NetEase Cloud Music annual report (Hi~ 我们在一起 2 年啦 / 夜深了 / 春天你最爱) and QQ Music annual report (你的音乐行星 / 全年 301 天都是 VIP / 全年最早听歌时刻定格于 1月9日 05:00). Two different storytelling grammars in the references — *literary minimalism* (NetEase) vs. *playful metaphor system* (QQ) — both unmistakably better than counts. |
| **Severity** | **3 — Major friction.** The screen reads as generic music-app boilerplate and dilutes the rest of the product's voice. A user who only sees `/me` would not be able to tell that this is Ultrasound and not any other music app. |
| **Dimension(s) affected** | Emotional resonance · Voice & tone · Memory & ephemerality · Companionship in solitude (the *deep* in "deep connection") |
| **Hypothesis** | Two key reframes: (a) **Replace counts with moments.** Each section is one *narrative unit* — a small scene with a sentence, a singular detail, and (when natural) a stranger or a place attached. (b) **Use the dimensions other music apps don't have.** Spotify Wrapped has *you + time*. NetEase has *you + time*. We have **you × time × place × strangers** — four axes, not two. Storytelling units should be cut along **two-axis intersections** (e.g. *time × stranger*, *place × song*), not along single-axis aggregates (*total songs*, *total places*). This is what makes the page feel like Ultrasound and not Wrapped. |
| **User-added dimensions** | Mid-design, the user asked for two extensions on top of the core thesis: **(a) emotional diary** — let the user's own past traces be told back to them as diary fragments; **(b) seasons** — a four-season time scale layered on top of the relative-time strings. Both folded into the section design without disturbing the *you × time × place × strangers* main spine — diary entries reuse the existing trace shape (no new data model), seasons use hand-annotated `season` field on `MY_TRACES` (no date parsing), and the seasonal narrative is *city × season × your own trace*, still on-axis. |
| **Narrative grammar** | Selected via AskUserQuestion 2026-05-06: **NetEase literary minimalism**. Quote-style sentences, huge whitespace, Fraunces serif for big lines, JetBrains Mono small-caps for chapter labels, no icons-as-stats, no charts. Roman numerals (I. II. III. IV.) mark chapters like a literary zine. |
| **Change made** | (1) `src/lib/seed-data.ts` — appended `Season` type, `MyTrace` type, `MY_TRACES` (8 hand-authored traces covering 4 seasons + 5 places, written to match `FEED`'s tonal register), and 5 helper functions (`getMyFirstTrace`, `getMyHomePlace`, `getStrangerTimeOverlap`, `getMyTracesBySeason`, `currentSeason` with Sydney / Southern Hemisphere month → season mapping). One trace (`m2`) intentionally shares song + location with `FEED.t7` (Leo's "thesis at 2am" trace for *An Ending (Ascent)* at UTS Library) so `getStrangerTimeOverlap()` returns a real, hand-curated pair for Section II. (2) `src/routes/me.tsx` — full rewrite. 6 sections top-to-bottom: Identity (minimal) → I. First heard → II. One night you were not alone → III. One place knows your songs → IV. Seasons → V. Footer ("someone is reading a song you left behind"). Sections I/II/III each become a tappable `<Link>` portal reusing ITER-2/3 routing. Section IV has a 4-tab season switcher; default tab uses `currentSeason()` which respects Sydney's southern-hemisphere months. Background `drift` orbs at staggered animation delays. All chapter Roman numerals are `aria-hidden`. |
| **Outcome** | Shipped 2026-05-06. HMR walkthrough on `localhost:8080/me`: identity block reads as a sentence not a stat; Section II's pulse-ring lands between the user's note and the stranger's note creating the emotional peak the brief asked for ("Strangers, song by song" reads as resolved); season tab defaults to autumn (Sydney is in autumn 2026-05-06), and tapping spring/summer/winter swaps the vignette text + gradient without page reload; footer one-liner reframes the page from self-report to *you-as-stranger-to-someone-else*, returning to the product's main spine. No `+N` chips, no bar charts, no stat tiles anywhere on the page. |
| **Trade-offs** | (1) **Losing legibility for atmosphere.** Counts are easy to scan; vignettes require reading. Accepted — the screen is not a productivity dashboard. (2) **Hand-authored sample data, not user-derived.** `MY_TRACES` is a literary fixture, not a function of real user activity, because trace write-persistence (`/playing` TraceModal → storage) is not yet wired up. The narrative grammar is correct *now* — when persistence ships, swapping the data source is a one-helper change. Logged as **ITER-5 candidate**: wire `playing.tsx:336` Pin button → `lib/storage.ts` and replace the `MY_TRACES` constant with a localStorage read. (3) **Vertical real estate increased substantially.** The page is now a long scroll. Acceptable — `/me` is destination, not glance-tab. (4) **`getStrangerTimeOverlap()` returns hand-curated coincidence.** It picks the user's earliest matching song and the first matching `FEED` entry; "minutesApart: 15" is narrative not computed. Acceptable for a design-experience deliverable; if it ever powers a real product, the timestamp story needs real timestamps. |
| **Commit / PR** | TBD |

#### ITER-4 candidate sections

Each candidate is a possible storytelling unit. Format: **headline · what it tells · which two axes it crosses · which reference grammar inspired it**.

1. **"You first heard yourself here."** · The first place the user left a trace, with the song they wrote it for. Static, anchored, slightly mythic. · *place × first-trace* · NetEase ("第一次遇见你 / 是你听的第一首歌")
2. **"At 11:47pm, somebody else was playing this too."** · Picks the song the user has played most often, surfaces one stranger trace for that song that was written within ±15 min of one of the user's plays. The "deep connection" is the time overlap, not the song. · *time × stranger* · NetEase ("夜深了 / 你很少在深夜听歌"), but inverted toward solidarity
3. **"Wynyard hears you most."** · The place where the user has left the most traces, framed as the place that *knows them back* (rather than "you visited this place 12 times"). Soft second-person. · *place × repetition* · NetEase ("春天你最爱")
4. **"Three strangers walked the same week as you."** · A small constellation of 3-5 stranger avatars whose traces overlap with the user's by *both* place and song within the same week. Tap → see whose. · *stranger × time × place* (the only triple-axis section) · QQ Music's planet metaphor, but the planet is a week, the moons are strangers
5. **"This song held you up at 2am."** · Surfaces the single trace the user wrote at the latest hour of the year, displayed as that trace + the song they wrote it for. Treats *the user themselves* as a stranger to read. · *time-of-day × user-as-stranger* · NetEase's literary tone
6. **"You returned to 5 places weekly. Each one knows your songs."** · Already exists in current me.tsx ("Your distributed belonging" hero card) — keep, lightly refine wording, position as the page's emotional anchor at the top. · *place × repetition* · already on-brand
7. **The "city heard you back" closing line** — a one-sentence farewell at the bottom of the page that varies by season/month, mirroring how NetEase ends each card with a singular emotional line. · pure voice, no data · NetEase

**What we leave behind**: the `23 places / 186 songs saved / 47 traces left` triplet (counts without story), the `jan — apr` bar chart (decorative, doesn't *say* anything), the `+12` strangers chip (a count masquerading as people).

**Sections we keep but reframe**: the user identity block at the top (avatar + name) — but rewrite the subtitle from `"Sydney · 7 months · listening with 412 strangers"` to a single sentence in the voice of the rest of the product.

---

### ITER-5 · 2026-05-06 · Visual-language pivot toward "modern-pop, friend-shared, emoji-loaded" idiom

| Field | Content |
|---|---|
| **Pain point** | Two compounding problems surfaced in playtest. (a) `/playing` is **too dashboard-y** — a 6-tile grid of mood / "here, now" counter / pin / equalizer / progress / controls. It reads as a *control panel*, not as a *room you've stepped into to be with strangers*. (b) The current ambient/literary aesthetic (Fraunces serif + amber/violet midnight-blue) is **moving toward "art house" while the product concept is "social and intimate"**. The user noticed the visual language is leaning solemn-curatorial rather than warm-shared. The mismatch makes `/playing` feel like a museum wall when it should feel like a friend's room. |
| **Source of insight** | User identified a reference product (modern-pop social listening app) with a visual DNA that matches Ultrasound's product intent: **dark base + neon purple/magenta accents + chunky rounded-pill components + heavy use of emoji as iconography + bold sans-serif display type + chip/pill layout density + portrait + neon-glow halos**. User's directive: "color, type, radius, layout — borrow visual grammar 1:1; content + features stay ours." |
| **Severity** | **3 — Major friction.** The mismatch between visual tone and product intent dilutes Companionship-in-Solitude (the page reads cold/curated rather than warm/shared) and Voice-and-Tone (the Fraunces gravity contradicts "it's like overhearing a friend"). |
| **Dimension(s) affected** | Voice & tone · Companionship in solitude · Emotional resonance · Pace & breathing room (the new grammar is denser/punchier than the literary one) |
| **Hypothesis** | The fastest, lowest-risk way to test the pivot is to (a) **codify the new visual grammar in a `docs/design.md`** so every screen has a shared rule book, then (b) **do style-only overrides on the largest visual elements first** (background gradient, accent color, component radii, button shape, type pairing) without touching feature/content. If the override feels right across `/`, `/traces`, `/me`, then `/playing` gets a structural redesign in ITER-6. If it feels wrong, the override is cheap to revert (CSS tokens only). |
| **Change made (this entry)** | Authored `docs/design.md` codifying the new visual system: dark-purple base (replacing midnight-indigo), neon magenta/purple gradient accents (replacing amber), 1.5rem-2rem rounded-pill component radii (replacing 0.875rem), bold sans-serif display (Inter/SF-Display direction, with Fraunces demoted to a specialized "editorial pull-quote" role only used in `/me` chapter narratives), emoji-as-iconography rule, neon-glow halo elevation rule replacing soft drop-shadows. **No code changes in this entry** — design.md only. Code changes are sequenced as ITER-6+ entries below. |
| **Outcome** | Shipped 2026-05-06 as `docs/design.md`. Document committed to repo (commit `e8f8f05`); subsequent ITER entries reference §-numbers as canonical rule citations. **Migration sequence reset** based on user's playtest finding (see ITER-6 below): publish-trace flow is the new highest-priority next step, not the token swap. The token swap is deferred to ITER-7+ so the publish flow can be built once on the existing visual system and re-skinned in a single pass rather than once-now-and-again-later. |
| **Trade-offs** | (1) **Fraunces does not disappear, but is demoted.** The editorial chapter narration on `/me` (Roman numerals + italic pull-quotes) is one of ITER-4's emotional levers and we lose narrative voice if we delete the serif globally. The compromise: Fraunces stays only as a *pull-quote face* inside `/me` and trace `note` italics; everywhere else (headlines, tabs, buttons, captions) becomes the new bold-sans display. (2) **Risk of looking generic.** "Dark + neon purple + chunky rounded" is a popular 2024-2025 aesthetic — Ultrasound's distinctive note risks being absorbed. Mitigation: keep the *content voice* (one-sentence traces, "a stranger" anonymity, place-bound noting) untouched; the visual frame changes, the writing inside it doesn't. (3) **emoji-as-iconography requires data-model rethink eventually.** Right now `mood` is a 6-string enum (`calm/lonely/hopeful/alive/soft/homesick`); to put emoji on cards we either map enum → emoji (acceptable for ITER-6) or replace mood-strings with mood-emojis (deferred). |
| **Commit / PR** | TBD |

---

### ITER-6 · 2026-05-06 · Wire the trace-publishing flow end-to-end

| Field | Content |
|---|---|
| **Pain point** | The product reads beautifully in one direction but is broken in the other. A user can **read** strangers' traces — story bubbles, feed, modals, danmaku, the whole portal/companion mechanic of ITER-2/3 works. But they cannot **write** one in a way that survives the act. Three concrete gaps surface in playtest: **(a) Submit is a no-op.** `playing.tsx:336`'s "Pin to this place" button is wired to `onClose` only; nothing writes to `lib/storage.ts`. The user types a sentence, picks a mood, taps the button — and their words vanish on close. **(b) The entry point is hidden.** The `TraceModal` opens only from `/playing`'s StoryFace ("Leave a trace" CTA). There is no entry from `/traces` (where the act of *reading* should naturally provoke *writing back*) or from `/me` (where one's own diary should accept new entries). **(c) The act has no completion.** There is no toast, no "your trace pinned at Wynyard", no return to where the user came from with their note now visible. The product asks the user to *leave one honest thing*, then makes it disappear. This is the single largest experience contradiction in the app: we built the read side of an asynchronous chorus and forgot to build the write side. |
| **Source of insight** | User playtest 2026-05-06 — Xinyi screenshotted every screen for the Experience Evaluation deliverable and noticed there was **no screenshot of the publishing flow** because the flow does not coherently exist. (The modal exists; the journey does not.) |
| **Severity** | **4 — Catastrophic mismatch.** The asymmetry between read and write means the product, taken at face value, says "strangers leave traces for you" but does not let you become a stranger to someone else. The Companionship-in-Solitude dimension only stands if the loop closes both ways. Until ITER-6 ships, every claim in the Experience Evaluation about "asynchronous chorus" is partially fictional. |
| **Dimension(s) affected** | Companionship in solitude · Voice & tone (the act of writing must read as soft and one-shot, not as a "post" or "publish") · Memory & ephemerality (where a trace lives after submission and how long, on whose terms) · Intimacy with strangers (the symmetry — *they wrote one for me, I write one back into the city* — is the heart) |
| **Hypothesis** | The flow already exists in 80% form (the `TraceModal` UI is well-written: textarea + 140-char counter + mood pill row + clear copy "Leave one honest thing"). What's missing is plumbing — a storage write path, two new entry points, and a completion moment. Building **all three at once** in a single iteration is correct: a partial fix (e.g. just plumbing storage but no new entry points) ships an even more confusing product because the user still cannot find the act. |
| **Plan: scope of ITER-6** | (Logged here for execution; this is the log entry, not the plan file. The plan file `~/.claude/plans/sleepy-toasting-giraffe.md` will be overwritten with the ITER-6 plan when execution begins.) |
| ↳ **Storage layer** | Extend `src/lib/storage.ts`: add `UserTrace` zod schema (mirrors `Trace` shape from seed-data: `id`, `song`, `artist`, `place`, `locationId?`, `note`, `mood`, `createdAt: number`, `forSong: { song, artist }`). Add `getUserTraces()`, `saveUserTrace(input)`, `deleteUserTrace(id)`. Storage key `ultrasound:user-traces:v1`. |
| ↳ **Modal wires up** | Replace `playing.tsx:334-339`'s `onClick={onClose}` with a real submit handler: validate (text non-empty, mood selected), construct `UserTrace` (pulling `song/artist/loc` from the playing-page search params + the modal's text+mood), call `saveUserTrace`, show a brief in-modal "pinned" state for ~700ms, then close. Modal becomes a controlled component receiving `onSubmit` from the parent. |
| ↳ **Entry point A: from `/traces` feed** | Add a soft pencil pill at the bottom of each trace card: *"write one back"* — opens the `TraceModal` pre-filled with the same `forSong` + `locationId` as the trace being read. This is the most important new entry: it makes "I read yours, now I write mine" a one-tap motion. |
| ↳ **Entry point B: from `/me`** | Top of `/me` (above Section 0 identity), add a thin pill: *"add to your diary"* — opens the `TraceModal` without a pre-filled song/place (user picks where they are first; this is the "I'm somewhere new and want to leave something" entry). |
| ↳ **Completion moment** | After submit on either entry, a tiny toast at the top of the phone shell: *"pinned at {place} · {time}"* in Fraunces italic, 2 seconds, dismisses itself. No success animation; no confetti. The act is quiet, like the rest of the product. |
| ↳ **Made-by-you visibility** | After ITER-6 ships, `MY_TRACES` (the seed array used by `/me`) is **augmented at runtime** by user-written traces from storage: `getMyFirstTrace()`, `getMyHomePlace()`, etc. all start reading from `[...MY_TRACES, ...getUserTraces()]`. ITER-4's hand-authored fixture remains as floor data so the page is never empty for a fresh user. |
| **Out of scope** | (1) Visual restyle per `design.md` — explicitly deferred to ITER-7 to avoid double-work; ITER-6 builds on the current amber/violet system, ITER-7 then re-skins the publish flow alongside everything else. (2) Editing or deleting an already-published user trace — the current product premise is *"one honest thing pinned and left behind"*; an "edit" affordance would damage the voice. We accept the cost (typo lives forever); if it bites in user testing, ITER-9+ revisits. (3) Sharing the trace outside the app. The product is purposefully not a broadcast surface. |
| **Outcome** | Shipped 2026-05-06. HMR walkthrough on `localhost:8080/traces`: the user's avatar `L` (in the same warm-to-primary gradient as `/me`'s identity) now sits at the head of the story-bubble row with a `Plus` badge in its bottom-right and a soft *"your turn"* caption — Instagram-grammar applied without copying its product. Tapping the self-bubble opens a 4-field bottom sheet (place picker · song · artist · note · mood) styled identically to `UserStoryModal`. Submit calls `saveUserTrace`, the sheet closes, a Fraunces-italic toast *"pinned at {place} · just now"* fades in at the top of the phone for 1.8s, the new trace appears at the head of the feed below (and survives a browser refresh via localStorage). The user has now also written a working entry through `/playing`'s "Leave a trace" button — same toast, same persistence. The read ↔ write asymmetry called out in the pain point is resolved at v1; the chorus loop is closed. |
| **Trade-offs** | (1) **Two new entry points means the modal becomes a portable component**, not a private child of `playing.tsx`. The component lifts to `src/components/TraceModal.tsx`, parameterised on `prefilledSong?` and `prefilledLocationId?`. Mild refactor cost; pays off again at ITER-7. (2) **Storage is purely client-side localStorage** — refresh wipes nothing, but the user's traces never reach another device. Acceptable for a design-experience deliverable. Real product would need a backend; that is not what this codebase is. (3) **No moderation, no profanity filter, no rate limit.** Single-user demo product. Documented so that a real-world reviewer of the deliverable can see we considered and de-scoped it. |
| **Commit / PR** | TBD |

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
