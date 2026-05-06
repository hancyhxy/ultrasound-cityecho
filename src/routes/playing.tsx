import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Heart, MapPin, Pin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { PINS } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";

const playingSearchSchema = z.object({
  song: z.string().optional(),
  artist: z.string().optional(),
  loc: z.string().optional(),
});

export const Route = createFileRoute("/playing")({
  validateSearch: playingSearchSchema,
  head: () => ({
    meta: [
      { title: "Playing — Ultrasound" },
      { name: "description", content: "You are not alone in this track." },
    ],
  }),
  component: PlayingScreen,
});

const DEFAULTS = {
  song: "An Ending (Ascent)",
  artist: "Brian Eno",
  loc: "uts",
} as const;

function PlayingScreen() {
  const search = Route.useSearch();
  const song = search.song ?? DEFAULTS.song;
  const artist = search.artist ?? DEFAULTS.artist;
  const locId = search.loc ?? DEFAULTS.loc;
  const location = PINS.find((p) => p.id === locId) ?? PINS[0];

  // Lift carousel state up so the page can react to song changes (recolor
  // backdrop to match the active song's album theme).
  const songs = location.songs.length ? location.songs : [{ song, artist }];
  const initialIdx = useMemo(() => {
    const i = songs.findIndex((s) => s.song === song && s.artist === artist);
    return i >= 0 ? i : 0;
  }, [songs, song, artist]);
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const activeSong = songs[activeIdx] ?? songs[0];
  const activeTheme = getSongTheme(activeSong.song, activeSong.artist);

  // Backdrop: vertical gradient from the song's mid-tint (top) to its
  // deep tint (bottom), so the room reads as the album's mood. CSS can't
  // smoothly transition between two gradients (gradient stops aren't
  // animatable), so a song change is a hard swap — but it happens at a
  // discrete moment (paging) and the colour family per song is stable.
  const backdropStyle = {
    background: `linear-gradient(180deg, ${activeTheme.tint} 0%, ${activeTheme.tintDeep} 100%)`,
  };

  return (
    <PhoneShell backdropStyle={backdropStyle}>
      {/* Slim chrome — back arrow + listening-at label. No view toggles,
          no flip animation, no story face. Single-purpose: play a song. */}
      <div className="relative z-10 px-5 pt-3 flex items-center justify-between">
        <Link to="/" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm">
          <ChevronDown className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/60">
            Listening at
          </p>
          <p className="text-xs font-medium text-white">{location.label}</p>
        </div>
        {/* Leave-a-trace entry — sits where the empty placeholder was so
            the chrome row stays balanced. Routes to /traces (the Discover
            feed) where the user pins a new trace tied to this song. */}
        <Link
          to="/traces"
          aria-label="Leave a trace for this song"
          className="h-9 w-9 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors"
        >
          <Pin className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </div>

      <div className="relative z-10 mt-3">
        <TrackFace
          songs={songs}
          initialIdx={initialIdx}
          activeIdx={activeIdx}
          onActiveChange={setActiveIdx}
          location={location}
        />
      </div>
    </PhoneShell>
  );
}

function TrackFace({
  songs,
  initialIdx,
  activeIdx,
  onActiveChange,
  location,
}: {
  songs: { song: string; artist: string }[];
  initialIdx: number;
  activeIdx: number;
  onActiveChange: (idx: number) => void;
  location: (typeof PINS)[number];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Place the scroller at the initial song on mount. Each snap card is
  // exactly the scroller's clientHeight, so scrollTop = idx * height.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = initialIdx * el.clientHeight;
  }, [initialIdx]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== activeIdx) onActiveChange(idx);
  };

  return (
    <div className="relative h-[640px] w-full">
      {/* Vertical paging — each card is one full-screen song. CSS scroll
          snap drives the paging; no JS swiping logic needed. */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        data-allow-scroll
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
      >
        {songs.map((s, i) => (
          <SongPanel
            key={`${s.song}-${s.artist}-${i}`}
            song={s.song}
            artist={s.artist}
            location={location}
          />
        ))}
      </div>

      {/* Left dot pagination — shows position in the song deck. */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        {songs.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              i === activeIdx ? "bg-white scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SongPanel({
  song,
  artist,
  location,
}: {
  song: string;
  artist: string;
  location: (typeof PINS)[number];
}) {
  const theme = getSongTheme(song, artist);
  const cover = theme.cover;
  const [liked, setLiked] = useState(false);

  return (
    <section className="snap-start h-full w-full px-5 py-6 flex flex-col justify-center">

      {/* Middle: song card — narrower than the panel so the song-themed
          backdrop reads as the page mood. Solid dark grey (no blur, no
          backdrop tint bleed) so the card is a discrete object floating
          on the colour, not part of it. */}
      <div className="mx-6 rounded-2xl bg-zinc-900 border border-white/10 p-3 shadow-2xl shadow-black/50">
        <div className="relative w-full aspect-square rounded-[28px] overflow-hidden border border-white/10">
          {cover ? (
            <img
              src={cover}
              alt={`${song} cover`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${theme.tint}, ${theme.tintDeep})` }}
            />
          )}
          {/* Like overlay — sits in the cover's top-right corner so the
              high-value "save this song" action lives with the song's
              identity, not in the mood reaction row. Dark scrim circle
              keeps the icon legible on any album art. */}
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
            className={`absolute top-3 right-3 h-10 w-10 rounded-full grid place-items-center transition-colors ${
              liked ? "bg-accent-hot" : "bg-black/45 backdrop-blur-sm hover:bg-black/60"
            }`}
          >
            <Heart
              className="h-4 w-4 text-white"
              fill={liked ? "currentColor" : "none"}
              strokeWidth={2.4}
            />
          </button>
        </div>

        <div className="mt-3 min-w-0 px-1">
          <h1 className="text-[18px] leading-[1.15] font-extrabold tracking-tight text-white truncate">
            {song}
          </h1>
          <p className="mt-0.5 text-[12px] text-white/75 truncate">{artist}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-white/60">
            <MapPin className="h-2.5 w-2.5 text-white/80" />
            {location.label} · {location.listening} listening
          </p>
        </div>
      </div>

    </section>
  );
}

