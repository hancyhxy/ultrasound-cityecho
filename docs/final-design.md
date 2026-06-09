# Final Design — Ultrasound CityEcho

> *People, places, songs, moods, memory — held together by one connection grammar.*

---

## 4. Final Design (Visual + Explanation)

### 4.1 The core experience — what it feels like, not what it does

Ultrasound is **not a music player**. It is a way of being a stranger to other strangers in the same city, mediated by the songs you happen to be playing in the place you happen to be in. The product's core primitive is a single shape we call a **trace**: one person + one place + one song + one mood + one sentence. Every surface in the app is either a way of *reading* someone else's trace or *leaving* one of your own — and the connections between traces are what give the city back to a newcomer who is otherwise too quiet to be seen.

The five dimensions never travel alone. A trace without a place is a Spotify scrobble. A trace without a mood is a check-in. A trace without a stranger on the other end is a private journal. What makes Ultrasound feel different from any of those is that **all five dimensions are pinned to the same one-sentence object**, and the entire app is the act of reading the city as a residue of those objects accumulating quietly on top of each other.

The opening line of the home screen — *"A city, by feeling."* (top-left of Fig. 1) — is not a tagline. It is a claim about how the map is sorted. Streets are still drawn underneath, but they are deliberately desaturated; what surfaces is a small constellation of pulse-pins, each carrying *N stories · M listening together*. You don't search for *a place*; you search for *a place that has been felt*. The city the user is given is one filtered through other people's quiet attention.

The product's emotional register is **late-night, low-volume, asynchronous chorus**. There is no DM, no follower count, no leaderboard. Strangers are visible only as a soft `T` or `O` initial inside a portrait halo, and they only become legible to each other through the trace they happen to share at the same place or the same song. Lina (the user we follow) never *talks* to anyone. She *recognises* them — *"someone wrote this exact thing here three nights ago"* — and that recognition, repeated across months and stations, becomes belonging.

### 4.2 The newcomer flow — how Lina moves through it

Lina is a Mandarin-speaking newcomer to Sydney who has been here for seven months. Her flow through the product is **discovery → reading → a song → leaving a trace → memory**, and each step is one of the four core surfaces shown in Fig. 1.

1. **Map (top-left).** Lina opens the app at UTS Library on a study night. The map shows her surroundings as feeling, not geography — the UTS pin pulses *124 stories · 12 listening*. She does not yet know who else is in the building. The pin is an invitation, not a destination.
2. **Story / Strangers feed (top-row, second tile).** She taps into *"Strangers, song by song"*. A vertical list of one-sentence traces unscrolls — *"first all-nighter. somehow felt like everyone here was awake with me." — UTS Library · L7 · 5h ago.* Each line is a stranger she will never meet, but whose tonight has briefly overlapped with hers. The first bubble in the row is **her own avatar with a `+` badge** — *your turn* — the act of writing back is built into the act of reading.
3. **Location story (second row).** She taps the UTS Library pin. A bottom-sheet rises with a `PLAYLIST · STORY` toggle. *Playlist* shows the songs other students have left here (《晴天》, *Love wins all*, *Sunday Morning*, …) tinted in the room's *quiet, focused, late-afternoon* mood; *Story* shows those same songs with their attached one-sentence notes (*"first all-nighter…"*, *"thesis at 2am, this song held me upright."*). The same place is presented twice — once as music, once as memory — and the toggle is the user's choice of how to receive it.
4. **Now-playing (bottom row).** Lina selects *Love wins all*. The screen becomes a single chunky album-art card, the place tag *LISTENING AT UTS Library · 12 LISTENING* sitting above it. There is no equaliser, no skip-forward, no queue. The screen's job is not to play music well — Spotify already does that. Its job is to be the room she is now sharing with eleven other people who chose this song in this place tonight, and to let her **leave a trace** when the song ends.
5. **`/me` (top-right).** A week later, Lina opens her own page. It does not greet her with *23 places / 186 songs*. It greets her with *"in this city for seven months, listening softly"* and four chapters: **08 stories · 06 songs · 04 places · 19 strangers**. Stranger is a countable axis next to song and place — the product is telling her, gently, that the people she has *recognised but never met* are part of the city she now lives in.

The flow is **never a funnel**. Lina can enter from any of the four surfaces, leave from any of them, and return weeks later to find the map has filled in slightly without her doing anything. The product is designed to reward *return*, not engagement minutes.

### 4.3 The visuals (Fig. 1 — twelve screens, four surface families)

> **Fig. 1 — *Final design: 12 screens across 4 surface families.*** See `public/city-echo.png`. Reading order top-to-bottom:
> Row 1 — **Discovery surfaces.** Map · Strangers feed · Places-you-come-back-to (saved location collages) · Lina's `/me` page.
> Row 2 — **Location story surfaces.** Same place rendered twice via `PLAYLIST · STORY` toggle, across four locations (UTS Library / Strand Arcade in two tones each).
> Row 3 — **Now-playing surfaces.** Single-portrait album-art view, four songs at four locations, each tinted by the room's mood (Broadway gym blue / Glebe café sand / UTS Library brown / UTS Library red).

Six visual moves carry the product's voice across all twelve screens:

- **Plum-black base + neon magenta-purple wash.** No pure black anywhere. The background is `oklch(0.13 0.04 295)` with two soft radial halos — *late-night friend's room*, not *night-time public space*.
- **Stickered portraits with floating emoji.** Lina's `/me` portrait (top-right) is a 40-px softened-square frame with a halo and three emoji stickers (🥰 🔥 🥹) overlapping its edge. This is the highest-impact single signature in the system; it appears on user identity moments and on stranger-reveal moments, and is reserved for those.
- **Pill-or-card geometry.** Every interactive element is either a full pill (search bar, segment toggle, mood chip, now-playing tag) or a 24/32-px-radius card (trace cards, album-art card). There are no 6-px-rounded buttons anywhere. The grammar makes the product instantly recognisable in a screenshot.
- **Inter 800 uppercase display + Inter 400 body + italic for trace notes.** The product uses one typeface across two weights, with italic doing the work that a serif used to do. Trace notes are italic in quotes (*"the barista remembered my order. small, but it counted."*) — the literary spine survives without an art-house typeface.
- **Place tinting carries through the stack.** A song played at UTS Library is rendered in UTS Library's brown-amber wash on the now-playing screen; the same song played at Broadway gym is rendered in cool-blue. The place is not a label — it is a *colour the music is wearing tonight*.
- **Emoji as mood iconography.** `CALM 🫧 · FOCUS 🧿 · HOPEFUL 🌤️ · SOFT 🥹 · HOMESICK 🥲 · ALIVE 🔥 · WARM 🤍 · INSTRUMENTAL`. Mood is felt as an object, not selected as a string from a dropdown.

### 4.4 System overview — five dimensions, one connection grammar

> **Fig. 2 — *Concept diagram: the trace primitive and its four entry surfaces.***

```
                                    ┌──── place ────┐
                                    │               │
                       person ──── TRACE ─── song   │
                                    │     ╲         │
                                    │      mood     │
                                    │               │
                                  memory (the trace, kept)
                                    │
        ┌───────────────┬───────────┴───────────┬──────────────┐
        │               │                       │              │
       MAP           STORY              LOCATION-STORY        /me
   (place →       (people →            (place ↔ playlist)   (memory →
    traces)        traces)              (place ↔ stories)    self)
```

Every surface in the product is one *projection* of the same five-dimensional object onto a different axis. The map projects traces onto *place*. The Strangers feed projects them onto *people + recency*. The Location-Story toggle projects a single place onto *songs* (Playlist) or *memories* (Story) — the user picks the lens. `/me` projects the user's own traces onto *self-as-memory*. There is no separate data model behind any of these — they are all the same trace, queried differently.

This is the entire information architecture, and the reason the product feels small even though it covers four surfaces: there is only one object in it.

### 4.5 Storyboard — Lina across three rooms

> **Fig. 3 — *Lina at UTS Library → Glebe café → Wynyard Station.***

| Beat | Scene | Surface | What happens |
|---|---|---|---|
| 1 | UTS Library, Level 7, 9:40pm. Half-empty floor, fluorescent lights. | **Map → Story** | Lina opens the app. UTS pulses *124 stories · 12 listening*. She reads *"first all-nighter. somehow felt like everyone here was awake with me."* and feels less alone before she has spoken to anyone. |
| 2 | Glebe café, Sunday morning rain. Coffee gone cold. | **Now-playing → Trace** | She plays *Sunday Morning · The Velvet Underground*, sees the place tinted sand-warm, and writes back: *"first quiet sunday in a month. the windows were perfect."* The trace pins. The toast is one line in italic, two seconds, no celebration. |
| 3 | Wynyard Station, Wednesday 11:47pm, going home. | **`/me` → Memory** | Three days later, Lina opens her own page. Section II reads *"At 11:47pm, somebody else was playing this too."* — a stranger trace written within fifteen minutes of one of her own plays. She has not met them. The city has remembered for her. |

The storyboard is deliberately **three rooms, one person, never a conversation**. The product's claim — *belonging is asynchronous; it does not require speaking* — is only credible if the storyboard does not contain a chat screen.

### 4.6 User journey — before, during, after

> **Fig. 4 — *Lina's seven-month arc.***

```
BEFORE (months 1–2)        DURING (months 3–5)         AFTER (months 6–7)
──────────────────        ────────────────────        ─────────────────────
"I am new here."          "I recognise this place."   "the city knows me back."

· silent in the city      · reads strangers' traces    · /me shows 19 strangers,
· 0 traces left              at UTS, Wynyard, Glebe       4 places, 8 stories
· uses Spotify like        · leaves first trace at       · returns to a place and
   anywhere else             UTS Library — typo and         finds her own trace
· no place in Sydney         all                            already there, plus
   feels "hers"            · sees danmaku from an           three new ones from
                             older trace drift across       strangers who came
                             her current song —             after her
                             "wrote a letter i won't     · the city is no longer
                             send. the song made me         a place she lives in;
                             brave."                        it is a place that has
                                                            quietly been listening
                                                            back
```

The journey is **not gamified**. There is no streak, no badge, no level. The reward for using the product for seven months is that the product looks slightly different when you open it — *more rooms have been felt-in, more songs come back*. The user's own evidence of belonging is the artefact, not a score.

### 4.7 Three key screens (zoomed out of Fig. 1)

**Key screen A — Location *soundscape*** (Fig. 1, Row 2). The `PLAYLIST · STORY` toggle on a single place card is the single most distinctive interaction in the product. The same UTS Library is rendered twice in Row 2: as a list of songs strangers have left there, and as a list of one-sentence memories attached to those same songs. The toggle is a soft pill, not a tab — it implies *two ways of listening to a place*, not *two screens*.

**Key screen B — The trace** (Fig. 1, Row 1, second tile + Row 2). A trace is a card, not a post. It carries the song, the place, the mood as emoji, the stranger as initial-only avatar, and one italic sentence. It does not carry a like count, a comment thread, a share button, or a stranger's username. The absence of those affordances is the design.

**Key screen C — Matching as recognition** (Fig. 1, Row 1, second tile, top of feed). Matching in Ultrasound does not look like a Tinder card. It looks like *the first row of the Strangers feed is your own avatar with a `+` badge*, and the next four bubbles are strangers whose traces have surfaced for *this place / this song / this mood today*. The match is **already implicit** in the feed — the product never says "we matched you with someone"; it just shows you the strangers your day overlapped with and lets you choose to write back.

---

## 5. Design Rationale — Why each major feature exists

This product carries seven major features. Each was selected against the alternative every other music app already implements, on the basis of the eight experience dimensions used in our `iteration-log.md` evaluation: *Emotional resonance · Pace & breathing room · Intimacy with strangers · Discoverability of presence · Memory & ephemerality · Voice & tone · Sense of place · Companionship in solitude.* The rationale below explains each feature in those terms, not against generic UX heuristics.

### 5.1 Why a map sorted by feeling, not by streets

Every map app starts with the assumption that the user wants to know *where things are*. Ultrasound starts with the assumption that the user wants to know *where things have been felt*. Streets are drawn underneath because cognitive orientation is a basic affordance, but they are deliberately desaturated; the colour and motion belong to the pulse-pins. This decision makes one strong claim and pays one cost: the claim is that **place in this product is an emotional unit, not a navigational one**, and the cost is that you cannot use Ultrasound to find directions to a venue. We accept that cost because directions are a problem already solved by Google Maps; what is not solved is *how a newcomer figures out which corner of a city to feel at home in first*. The pulse pins, the *N stories · M listening* labels, and the bottom-sheet entry into Location Story all serve the same dimension — **Sense of Place** — by making the city legible as a residue of human attention rather than as a grid.

### 5.2 Why traces are one sentence, anonymous, and place-bound

A trace can carry up to 140 characters, must specify a mood, must be attached to a song *and* a place, and never carries a username — only a single-letter initial. Each of these constraints is doing a specific job. The 140-character ceiling forces the user to write *one honest thing* rather than a journal entry; long-form text degrades into self-narration and breaks the *Pace & breathing room* dimension. The mandatory mood gives every trace an emotional handle the system can use to surface it later (in danmaku, in `/me`'s seasonal vignette, in the *calm/focus* tinting on a place). The mandatory song-and-place is the spine of the product's data model — without both, the trace cannot participate in the connection grammar (5.4) and is silently useless. The single-letter initial is the most-debated decision in the whole system: it gives up the *Intimacy with strangers* dimension's social-graph affordance — you cannot follow someone — and gains the *Companionship in solitude* dimension's anonymity affordance — strangers stay strangers, and *being read* never escalates into *being friended*. The product would be a worse Instagram if traces had usernames; it would not be Ultrasound.

### 5.3 Why a `PLAYLIST · STORY` toggle on every place

The most subtle decision in the visual system is that **a place is not a screen — it is a card with two faces**. Tapping a pin opens a single bottom-sheet whose top toggle switches between *Playlist* (the songs other people have left here) and *Story* (the one-sentence memories attached to those same songs). The two views share their header, their tone, and their list spine — the only thing that changes is which axis of the trace the user is reading by. This was originally drafted as two separate tabs in the navigation, until we noticed that the experience we wanted was *the user choosing how to listen to a place*, not *the user navigating between two features*. The toggle expresses the relationship — songs and memories are the same residue, queried differently — in a way two routes never could. The dimension being served here is **Memory & ephemerality**: the place itself is the memory; the songs and the stories are two surfaces of it.

### 5.4 Why the Now-playing screen is one portrait, not a dashboard

An earlier iteration of this screen was a six-tile control panel — mood / *here, now* / pin / equaliser / progress / controls. It read as a *control panel* and not as *a room you stepped into to be with strangers*. The iteration-log entry on this (ITER-5/7) calls it "art-house mismatch": the visual frame was wrong, but more importantly the *information density* was wrong. A room you are sharing with eleven other people who chose this song in this place tonight is not a thing that needs six tiles of data to express; it needs one portrait, the song's title, the place's tag, and the affordance to leave a trace. Everything else is noise that distracts from the dimension this surface exists to serve, which is **Companionship in solitude**. The screen is intentionally close to a poster: a single album-art card, the place tinted into the background, *LISTENING AT … · 12 LISTENING*. Spotify renders the same song the same way regardless of where in the world you are; we render it differently for every place, because the place is the product.

### 5.5 Why `/me` shows four nouns instead of three numbers

The Spotify-Wrapped grammar — *23 places, 186 songs, 47 traces left* — was the default output of the prototype generator we inherited. It is dimensionally correct (the numbers are right) and experientially wrong (the numbers do not say anything). Counts measure consumption volume; they do not measure *belonging*. ITER-4 of the iteration log replaces them with four chapters — *I. First heard · II. One night you were not alone · III. One place knows your songs · IV. Seasons* — each rendered as a small literary scene with one singular detail (a stranger trace surfaced on the same song, the place that has seen the user most, the season the city is in tonight). Stranger is added as a fourth chapter alongside *song / place / season* because the product's whole claim is that **the people you have recognised but never met are part of your city**, and the chapter count — *19 strangers* — is the data evidence of that claim. The dimension being served is **Memory & ephemerality**, with **Voice & tone** as the second axis; the page reads as something the city is saying back to you, not as something you are reporting on yourself.

### 5.6 Why no chat, no follower count, no like button

The most consequential design decision in Ultrasound is one of subtraction. There is no DM. There is no follow. There is no like, no react, no reply, no share, no profile-with-username, no leaderboard, no trending tab. Every one of these affordances would make the product *more usable* against a generic-social-app rubric — and would degrade the dimension it is built on, **Intimacy with strangers**. The thesis the product is testing is that *recognising a stranger is a different and quieter relationship than knowing one*, and that the act of writing one honest sentence to no one in particular and finding it later read by no one in particular is a relationship the city has space for. Once a chat screen is added, every other screen in the product re-orients around it; once a follower count is added, the trace becomes a post. The product is the absence of those affordances as much as it is the presence of the four surfaces.

### 5.7 Why place-tinting flows through the entire stack

The last major feature is the smallest one to describe and the largest one to maintain: **the same song looks different at different places**. *Love wins all* at UTS Library is brown-amber; *Super Shy* at Broadway gym is cool-blue; *Ivy* at Glebe café is sand. The room's *mood string* (calm, focus, soft, alive, …) is mapped to a colour wash that tints every surface the song appears on while the user is in that place — the now-playing card, the album-art frame, the trace card on the way back to the feed. This is technically a single CSS-variable cascade controlled by a `data-tone` attribute on the page root. Experientially, it is the product's strongest argument for its own thesis: the song has not changed, but where you played it has, and the colour the music is wearing tonight is the proof. The dimensions served are **Sense of place** (place is a colour, not a label) and **Emotional resonance** (the wash is doing what a heading cannot — it is making the room *feel* a way before the user reads a single word).

### 5.8 What this rationale is *not* claiming

Every decision above is justified against the experience dimensions of **this** product, not against generic UX criteria. We are not claiming that anonymity is always better than identity, that one-sentence text is always better than long-form, that a portrait is always better than a dashboard, or that a place-tinted song is always better than a neutral one. We are claiming that for *this* product — *a quiet, asynchronous, place-bound listening companion for newcomers in a city* — these seven decisions hold the eight experience dimensions in a coherent shape. The proof of coherence is in `iteration-log.md`: every iteration that drifted away from this shape (the music-app prototype in ITER-1, the dashboard `/me` in ITER-4, the six-tile now-playing in ITER-5) was rolled back toward it. The proof of value will come from user playtest after submission.

---

*Documents in the same folder: `design.md` (visual rule book) · `iteration-log.md` (experience evaluation, seven iterations) · this file (final design + rationale).*
