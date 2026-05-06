import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Pause, SkipBack, SkipForward, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { Equalizer } from "@/components/Equalizer";
import { FlipToggle, type CollageView } from "@/components/FlipToggle";
import { CollageBoard } from "@/components/CollageBoard";
import { DanmakuOverlay } from "@/components/DanmakuOverlay";
import { PinnedToast } from "@/components/PinnedToast";
import { TraceCard } from "@/components/TraceCard";
import { findTracesForLocation, findTracesForSong, PINS, userTraceToTrace } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";
import { getUserTraces, saveUserTrace, type UserTrace } from "@/lib/storage";

const playingSearchSchema = z.object({
  song: z.string().optional(),
  artist: z.string().optional(),
  loc: z.string().optional(),
  /** Initial view face. Defaults to track. Set ?view=story to land on the
      location's STORY face (used by LocationDrawer "Tune in to {place}"). */
  view: z.enum(["track", "story"]).optional(),
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

const MOODS = ["calm", "lonely", "hopeful", "alive", "soft", "homesick"];

function PlayingScreen() {
  const search = Route.useSearch();
  const song = search.song ?? DEFAULTS.song;
  const artist = search.artist ?? DEFAULTS.artist;
  const locId = search.loc ?? DEFAULTS.loc;
  const location = PINS.find((p) => p.id === locId) ?? PINS[0];

  const [view, setView] = useState<CollageView>(search.view ?? "track");

  // Sync view state when URL ?view changes (e.g. navigating from
  // LocationDrawer "Tune in" while already on /playing — React Router won't
  // re-mount the component, so the initial useState value never refreshes).
  useEffect(() => {
    if (search.view && search.view !== view) {
      setView(search.view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.view]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [pinnedTrace, setPinnedTrace] = useState<UserTrace | null>(null);

  // Song-scoped traces — used by TRACK face danmaku ("voices for this song").
  const songTraces = useMemo(() => {
    const fixtures = findTracesForSong(song, artist, locId);
    const mine = getUserTraces()
      .filter((ut) => ut.song === song && ut.artist === artist)
      .map(userTraceToTrace);
    return [...mine, ...fixtures];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song, artist, locId, pinnedTrace]);

  // Location-scoped traces — used by STORY face ("the story of this place").
  // Each card shows a different song; visual heterogeneity is the feature.
  const locationTraces = useMemo(() => {
    return findTracesForLocation(locId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locId, pinnedTrace]);

  const handleFlip = (next: CollageView) => {
    if (next === view) return;
    setIsFlipping(true);
    setView(next);
    setTimeout(() => setIsFlipping(false), 900);
  };

  // STORY backdrop tint: take from the first trace's song so the page has a
  // single anchor color (versus picking randomly across heterogeneous cards).
  const firstTraceSong = locationTraces[0];
  const backdropTheme = firstTraceSong
    ? getSongTheme(firstTraceSong.song, firstTraceSong.artist)
    : getSongTheme(song, artist);
  const isStory = view === "story";

  // FlipToggle only makes sense when both faces have a coherent context.
  // When entering /playing with only `loc` (no song), there's no single-song
  // context for the TRACK face — so we hide the toggle and the user can only
  // exit STORY via the back arrow. Otherwise the toggle would jump them into
  // an arbitrary fallback song's dashboard, which is jarring.
  const hasSongContext = Boolean(search.song && search.artist);
  const showFlipToggle = hasSongContext;

  // STORY face = full-bleed location page tinted by the first song; TRACK face = current plum dashboard.
  const backdropStyle = isStory
    ? {
        background: `
          radial-gradient(at 50% 0%, ${backdropTheme.tint}ee 0%, transparent 60%),
          linear-gradient(180deg, ${backdropTheme.tint} 0%, ${backdropTheme.tintDeep} 70%, #050a14 100%)
        `,
      }
    : undefined;

  return (
    <PhoneShell backdropStyle={backdropStyle}>
      <div className="relative z-10 px-5 pt-3 flex items-center justify-between">
        <Link to="/" className={`h-9 w-9 grid place-items-center rounded-full ${isStory ? "bg-white/10 backdrop-blur" : "glass"}`}>
          <ChevronDown className="h-4 w-4" />
        </Link>
        {/* TRACK face keeps the listening-at label; STORY face is single-song
            focus and shows nothing here (location surfaces inside each card via @place). */}
        {!isStory ? (
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Listening at
            </p>
            <p className="text-xs font-medium text-accent">{location.label}</p>
          </div>
        ) : (
          <div />
        )}
        {showFlipToggle ? (
          <FlipToggle view={view} onChange={handleFlip} />
        ) : (
          // Location-only context: PLAYLIST ↔ STORY pill toggle (airbuds-style).
          // PLAYLIST jumps back to /location/$id; STORY is active (we're on it).
          <div className="inline-flex items-center gap-0.5 h-9 rounded-pill bg-black/30 backdrop-blur p-0.5">
            <Link
              to="/location/$id"
              params={{ id: locId }}
              className="inline-flex items-center h-8 px-3.5 rounded-pill text-white/70 font-bold uppercase tracking-[0.16em] text-[11px] hover:text-white transition-colors"
            >
              Playlist
            </Link>
            <span className="inline-flex items-center h-8 px-3.5 rounded-pill bg-white text-zinc-900 font-extrabold uppercase tracking-[0.16em] text-[11px]">
              Story
            </span>
          </div>
        )}
      </div>

      {/* TRACK face — collage with flip animation kept for the dashboard side.
          Danmaku uses song-scoped traces ("voices for this song"). */}
      {!isStory && (
        <div className="relative z-10 px-3 mt-3">
          <CollageBoard
            view={view}
            track={<TrackFace song={song} artist={artist} location={location} />}
            story={null}
          />
          {!isFlipping && <DanmakuOverlay traces={songTraces} active={true} />}
        </div>
      )}

      {/* STORY face — full-bleed scrollable page (no collage container).
          Renders location-scoped traces (the place's story; heterogeneous songs). */}
      {isStory && (
        <div className="relative z-10 mt-2">
          <StoryFace
            location={location}
            traces={locationTraces}
            onLeaveTrace={() => setShowTraceModal(true)}
          />
        </div>
      )}

      {showTraceModal && (
        <TraceModal
          song={song}
          artist={artist}
          place={location.label}
          locationId={location.id}
          onSubmitted={(t) => setPinnedTrace(t)}
          onClose={() => setShowTraceModal(false)}
        />
      )}
      <PinnedToast trace={pinnedTrace} onDismiss={() => setPinnedTrace(null)} />
    </PhoneShell>
  );
}

function TrackFace({
  song,
  artist,
  location,
}: {
  song: string;
  artist: string;
  location: (typeof PINS)[number];
}) {
  return (
    <div className="grid grid-cols-3 gap-2 px-2">
      <div className="col-span-2 row-span-2 relative aspect-square rounded-3xl overflow-hidden shadow-glow border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/60 to-background" />
        <div aria-hidden className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-accent/50 blur-3xl drift" />
        <div aria-hidden className="absolute -bottom-12 -right-12 h-60 w-60 rounded-full bg-primary/60 blur-3xl drift" style={{ animationDelay: "4s" }} />
      </div>

      <div className="col-span-1 rounded-2xl glass border border-white/10 p-3 flex flex-col gap-1.5 justify-center">
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Mood</p>
        <p className="text-[12px] font-display leading-tight italic">{location.mood.split(",")[0]}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {location.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="col-span-1 rounded-2xl glass-strong border border-accent/20 p-3 flex flex-col items-start justify-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <p className="font-display text-[18px] leading-none">{location.listening}</p>
        <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">here, now</p>
      </div>

      <div className="col-span-1 rounded-2xl bg-card-gradient border border-white/10 p-3 flex flex-col justify-center gap-1">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        <p className="text-[11px] font-medium leading-tight">{location.label}</p>
        <p className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">{location.count} traces</p>
      </div>

      <div className="col-span-2 rounded-2xl glass border border-white/10 p-3 flex items-center justify-center gap-3">
        <Equalizer />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">streaming</span>
      </div>

      <div className="col-span-3 rounded-2xl bg-card-gradient border border-accent/20 p-4 shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[20px] leading-[1.1] font-medium truncate">{song}</h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground truncate">{artist}</p>
          </div>
          <button className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-accent/20 transition-colors shrink-0" aria-label="Like">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[42%] bg-gradient-to-r from-accent to-primary rounded-full" />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] font-mono text-muted-foreground">
            <span>1:48</span>
            <span>4:12</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-6">
          <button className="text-foreground/80 hover:text-accent transition-colors" aria-label="Previous">
            <SkipBack className="h-5 w-5" fill="currentColor" />
          </button>
          <button className="h-12 w-12 rounded-full bg-accent shadow-accent grid place-items-center hover:scale-105 transition-transform" aria-label="Pause">
            <Pause className="h-5 w-5 text-accent-foreground" fill="currentColor" />
          </button>
          <button className="text-foreground/80 hover:text-accent transition-colors" aria-label="Next">
            <SkipForward className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StoryFace({
  location,
  traces,
  onLeaveTrace,
}: {
  location: (typeof PINS)[number];
  traces: ReturnType<typeof findTracesForLocation>;
  onLeaveTrace: () => void;
}) {
  const count = traces.length;
  // Backdrop tint anchored to the first trace's song theme (set by parent).
  // Used here just for the CTA button color so it reads against the bg.
  const firstTrace = traces[0];
  const ctaTheme = firstTrace
    ? getSongTheme(firstTrace.song, firstTrace.artist)
    : { tint: "#3a3a3a", tintDeep: "#0a0a0a", tintLight: "#e0e0e0" };

  return (
    <div className="relative pb-4 min-h-full">
      {/* Hero — location identity. Place name + mood + count drive the page. */}
      <div className="flex flex-col items-center px-4 pt-2 pb-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
          The story of
        </p>
        <h1
          className="font-pop mt-2 text-[34px] text-white"
          style={{
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          {location.label}
        </h1>
        <p className="mt-2 text-[12px] italic text-white/70 max-w-[18rem]">
          {location.mood}
        </p>
        <p
          className="mt-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: ctaTheme.tintLight }}
        >
          {count > 0 ? `${count} ${count === 1 ? "trace" : "traces"} here` : "no traces yet"}
        </p>
      </div>

      {/* White-card stack of every trace at this location (heterogeneous songs). */}
      {count > 0 ? (
        <div className="flex flex-col gap-3 px-3">
          {traces.map((t, i) => (
            <TraceCard key={t.id} trace={t} index={i} />
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="italic text-[14px] text-white/70 leading-relaxed">
            no one has written about this place yet.
            <br />
            you could be the first.
          </p>
        </div>
      )}

      {/* Sticky chunky CTA — sits between the 4th/5th card area, just above the
          bottom nav. Negative bottom lets it overlap the nav padding zone. */}
      <div className="sticky -bottom-2 mt-6 flex justify-center pointer-events-none">
        <button
          onClick={onLeaveTrace}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white"
          style={{
            background: ctaTheme.tint,
            boxShadow: `0 8px 24px -8px ${ctaTheme.tintDeep}`,
          }}
        >
          <span aria-hidden>＋</span>
          Leave a trace here
        </button>
      </div>
    </div>
  );
}

function TraceModal({
  song,
  artist,
  place,
  locationId,
  onSubmitted,
  onClose,
}: {
  song: string;
  artist: string;
  place: string;
  locationId?: string;
  onSubmitted: (t: UserTrace) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) {
      setHint("write one honest thing first");
      return;
    }
    if (!selected) {
      setHint("choose a mood");
      return;
    }
    const t = saveUserTrace({
      song,
      artist,
      place,
      locationId,
      note: trimmed,
      mood: selected,
      forSong: { song, artist },
    });
    onSubmitted(t);
    onClose();
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[28px] p-6 pb-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-[22px] leading-tight">Leave one honest thing.</h3>
            <p className="mt-1 text-xs text-muted-foreground">A stranger in this seat tomorrow will read it.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (hint) setHint(null);
          }}
          placeholder="What did this song hold for you, here?"
          maxLength={140}
          className="mt-5 w-full h-24 rounded-2xl bg-background/50 border border-white/10 p-4 text-[14px] resize-none focus:outline-none focus:border-accent/40 placeholder:text-muted-foreground/60"
        />
        <div className="mt-1 text-[10px] font-mono text-muted-foreground text-right">{text.length}/140</div>

        <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Mood</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelected(m);
                if (hint) setHint(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selected === m ? "bg-accent text-accent-foreground" : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {hint && (
          <p className="mt-3 text-[11px] font-mono italic text-accent/80">{hint}</p>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full h-12 rounded-2xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity shadow-accent"
        >
          Pin to this place
        </button>
      </div>
    </div>
  );
}
