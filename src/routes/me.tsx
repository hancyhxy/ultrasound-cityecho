import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Settings } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { FourGridCover } from "@/components/FourGridCover";
import {
  getMyTopPlaces,
  getMyTopSongs,
  getMyYearStats,
  getStrangerTimeOverlap,
  getUserAvatar,
} from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";

// Brand-purple accent reused across the page (chapter marks, key
// emphases). Kept inline so it tracks the rest of the app's accent.
const ACCENT_PURPLE = "oklch(0.65 0.22 295)";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Me — Ultrasound" },
      {
        name: "description",
        content: "A small diary of how this city has been listening with you.",
      },
    ],
  }),
  component: MeScreen,
});

function MeScreen() {
  const stats = useMemo(() => getMyYearStats(), []);
  const topSongs = useMemo(() => getMyTopSongs(5), []);
  const topPlaces = useMemo(() => getMyTopPlaces(3), []);
  const overlap = useMemo(() => getStrangerTimeOverlap(), []);

  return (
    <PhoneShell>
      {/* Ambient orbs — layer 0, behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="drift absolute top-[12%] -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div
          className="drift absolute top-[42%] -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="drift absolute bottom-[8%] left-1/4 h-56 w-56 rounded-full bg-accent/8 blur-3xl"
          style={{ animationDelay: "9s" }}
        />
      </div>

      {/* Top bar */}
      <header className="relative px-6 pt-4 flex items-center justify-between">
        <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-white/55">Your year</p>
        <button
          aria-label="Settings"
          className="h-9 w-9 grid place-items-center rounded-full glass"
        >
          <Settings className="h-4 w-4" />
        </button>
      </header>

      {/* Section 0 · Identity — stickered portrait (airbuds-style). Real
          photo replaces the gradient placeholder so this matches the avatar
          system used everywhere else (traces, danmaku, modals). Emojis still
          float around it as collage stickers. */}
      <section className="relative mt-6 px-6 flex flex-col items-center text-center">
        <div className="relative">
          {/* Portrait — square chunky tile with white border. */}
          <div className="h-24 w-24 rounded-2xl overflow-hidden ring-[3px] ring-white shadow-lg">
            <img
              src={getUserAvatar("self")}
              alt="Your portrait"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Emoji stickers — each ring of white acts as the collage outline. */}
          <span
            aria-hidden
            className="absolute -top-3 -left-4 h-8 w-8 rounded-full bg-white grid place-items-center text-[18px] shadow-md ring-2 ring-white -rotate-12"
          >
            💝
          </span>
          <span
            aria-hidden
            className="absolute -top-2 -right-5 h-9 w-9 rounded-full bg-white grid place-items-center text-[20px] shadow-md ring-2 ring-white rotate-6"
          >
            🌙
          </span>
          <span
            aria-hidden
            className="absolute -bottom-2 -left-5 h-9 w-9 rounded-full bg-white grid place-items-center text-[20px] shadow-md ring-2 ring-white rotate-12"
          >
            🥰
          </span>
          <span
            aria-hidden
            className="absolute -bottom-3 -right-4 h-8 w-8 rounded-full bg-white grid place-items-center text-[18px] shadow-md ring-2 ring-white -rotate-6"
          >
            ☁️
          </span>
        </div>
        <h1 className="mt-7 text-[28px] leading-[1.05] font-extrabold tracking-tight text-white">
          Lina
        </h1>
        <p className="mt-3 italic text-[14px] leading-relaxed text-foreground/70 max-w-[14rem]">
          in this city for seven months,
          <br />
          listening softly.
        </p>
      </section>

      <div className="mt-8" />

      {/* Block A · YOUR YEAR — 4 stat tiles in a row. Mirrors a count-down
          / weekly-recap stat strip: equal-width tiles, mono digits, tiny
          uppercase caption. This is the "zoom out" so users see the
          whole year at a glance before any vignette. */}
      <section className="mx-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
          Your year
        </p>
        <div className="flex gap-2">
          <StatTile value={stats.stories} label="stories" />
          <StatTile value={stats.songs} label="songs" />
          <StatTile value={stats.places} label="places" />
          <StatTile value={stats.strangers} label="strangers" />
        </div>
      </section>

      {/* Block B · top songs — horizontal cover-tile row, ranked by how
          many stories the user wrote about each song. The #1 tile carries
          a small badge so the ranking is legible without numbering each. */}
      {topSongs.length > 0 && (
        <BlockSection title="songs you came back to">
          <div className="px-5 flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {topSongs.map((s, i) => (
              <Link
                key={`${s.song}::${s.artist}`}
                to="/playing"
                search={{ song: s.song, artist: s.artist }}
                aria-label={`Play ${s.song} by ${s.artist}`}
                className="shrink-0 w-[120px] group"
              >
                <div className="relative">
                  <SongCoverTile song={s.song} artist={s.artist} size={120} />
                  {i === 0 && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-white text-zinc-900 text-[9px] font-extrabold tracking-wider">
                      #1
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[12px] font-extrabold tracking-tight text-white truncate">
                  {s.song}
                </p>
                <p className="mt-0.5 text-[10px] text-white/55 truncate">{s.artist}</p>
                <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {s.storyCount} {s.storyCount === 1 ? "story" : "stories"}
                </p>
              </Link>
            ))}
          </div>
        </BlockSection>
      )}

      {/* Block C · top places — horizontal FourGridCover row, ranked by
          story count. Each tile carries the pin's tags as a sub-row so
          the row reads "place + flavour + count" at a glance. */}
      {topPlaces.length > 0 && (
        <BlockSection title="places that knew your name">
          <div className="px-5 flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {topPlaces.map(({ pin, storyCount }) => (
              <Link
                key={pin.id}
                to="/"
                search={{ pin: pin.id }}
                aria-label={`Open map at ${pin.label}`}
                className="shrink-0 w-[140px] group"
              >
                <FourGridCover songs={pin.songs} size={140} />
                <p className="mt-2 text-[12px] font-extrabold tracking-tight text-white truncate">
                  {pin.label}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {storyCount} {storyCount === 1 ? "story" : "stories"}
                </p>
              </Link>
            ))}
          </div>
        </BlockSection>
      )}

      {/* Block D · once, not alone — overlap moment kept as the page's
          single narrative beat (everything else is dashboard). Single
          centred cover so the two-quote structure reads as "two people,
          one room", not as two separate songs. */}
      {overlap && (
        <BlockSection title="once, not alone">
          <Link
            to="/playing"
            search={{
              song: overlap.mine.song,
              artist: overlap.mine.artist,
              loc: overlap.mine.locationId,
            }}
            aria-label={`Play ${overlap.mine.song} together`}
            className="block group px-5"
          >
            <div className="flex flex-col items-center">
              <SongCoverTile song={overlap.mine.song} artist={overlap.mine.artist} size={120} />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                ~{overlap.minutesApart} minutes apart
              </p>
            </div>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {overlap.mine.when}, you wrote
            </p>
            <p className="mt-2 font-display italic text-[14px] leading-relaxed text-white/90">
              "{overlap.mine.note}"
            </p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {overlap.theirs.userInitial}-stranger, {overlap.theirs.place}
            </p>
            <p className="mt-2 font-display italic text-[14px] leading-relaxed text-white/75">
              "{overlap.theirs.note}"
            </p>
          </Link>
        </BlockSection>
      )}

      {/* Section 5 · Footer */}
      <section className="relative mt-24 px-8 pb-12 text-center">
        <div className="mx-auto h-px w-16 bg-white/10" />
        <p className="mt-8 italic font-bold text-[18px] leading-[1.25] text-foreground/90 max-w-[16rem] mx-auto">
          <span className="uppercase tracking-[-0.01em] block" style={{ color: ACCENT_PURPLE }}>
            Somewhere
            <br />
            in the city,
          </span>
          <span className="block mt-3 font-medium text-foreground/75 text-[14px] leading-relaxed">
            someone is reading
            <br />a song you left behind.
          </span>
        </p>
        <div className="mt-8 mx-auto h-px w-16 bg-white/10" />
        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/70 leading-loose">
          Ultrasound
          <br />
          listening together
          <br />
          quietly
        </p>
      </section>
    </PhoneShell>
  );
}

/** Section wrapper — uses the same caps-eyebrow header as YOUR YEAR
    so every block on this page speaks one type voice. The title is a
    plain uppercase eyebrow rather than a decorative watermark, which
    lets the album tiles below own the visual weight. */
function BlockSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="relative mt-8">
      <h2 className="px-5 mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Single album-cover tile for a song. Falls back to a tint gradient
    + first letter when the song has no registered cover (mirrors
    FourGridCover's per-cell fallback so the visual language is
    consistent across the app). */
function SongCoverTile({ song, artist, size }: { song: string; artist: string; size: number }) {
  const theme = getSongTheme(song, artist);
  return (
    <div
      className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-soft shrink-0"
      style={{ width: size, height: size }}
    >
      {theme.cover ? (
        <img
          src={theme.cover}
          alt={`${song} cover`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ background: `linear-gradient(135deg, ${theme.tint}, ${theme.tintDeep})` }}
        >
          <span className="text-white/85 text-[28px] font-extrabold uppercase tracking-tight">
            {song.slice(0, 1)}
          </span>
        </div>
      )}
    </div>
  );
}

/** Single stat cell in the YOUR YEAR strip. Equal-width via flex-1 so a
    row of N stays evenly distributed regardless of digit count. Mono
    digits keep the row visually balanced when values vary in width. */
function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex-1 rounded-2xl bg-white/4 py-3 px-2 text-center"
      style={{ border: "1px solid oklch(0.65 0.22 295 / 0.55)" }}
    >
      <p className="text-[26px] font-extrabold tracking-tight text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
    </div>
  );
}
