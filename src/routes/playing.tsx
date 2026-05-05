import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Pause, SkipBack, SkipForward, MessageCircle, MapPin, Quote, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { Equalizer } from "@/components/Equalizer";
import { FlipToggle, type CollageView } from "@/components/FlipToggle";
import { CollageBoard } from "@/components/CollageBoard";
import { DanmakuOverlay } from "@/components/DanmakuOverlay";
import { PinnedToast } from "@/components/PinnedToast";
import { findTracesForSong, PINS } from "@/lib/seed-data";
import { saveUserTrace, type UserTrace } from "@/lib/storage";

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

const MOODS = ["calm", "lonely", "hopeful", "alive", "soft", "homesick"];

function PlayingScreen() {
  const search = Route.useSearch();
  const song = search.song ?? DEFAULTS.song;
  const artist = search.artist ?? DEFAULTS.artist;
  const locId = search.loc ?? DEFAULTS.loc;
  const location = PINS.find((p) => p.id === locId) ?? PINS[0];

  const [view, setView] = useState<CollageView>("track");
  const [isFlipping, setIsFlipping] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [pinnedTrace, setPinnedTrace] = useState<UserTrace | null>(null);

  const traces = useMemo(
    () => findTracesForSong(song, artist, locId),
    [song, artist, locId]
  );

  const handleFlip = (next: CollageView) => {
    if (next === view) return;
    setIsFlipping(true);
    setView(next);
    setTimeout(() => setIsFlipping(false), 900);
  };

  return (
    <PhoneShell>
      <div className="px-5 pt-3 flex items-center justify-between">
        <Link to="/" className="h-9 w-9 grid place-items-center rounded-full glass">
          <ChevronDown className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Listening at</p>
          <p className="text-xs text-accent font-medium">{location.label}</p>
        </div>
        <FlipToggle view={view} onChange={handleFlip} />
      </div>

      <div className="relative px-3 mt-3">
        <CollageBoard
          view={view}
          track={<TrackFace song={song} artist={artist} location={location} />}
          story={
            <StoryFace
              song={song}
              artist={artist}
              location={location}
              traces={traces}
              onLeaveTrace={() => setShowTraceModal(true)}
            />
          }
        />
        {view === "track" && !isFlipping && (
          <DanmakuOverlay traces={traces} active={true} />
        )}
      </div>

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
  song,
  artist,
  location,
  traces,
  onLeaveTrace,
}: {
  song: string;
  artist: string;
  location: (typeof PINS)[number];
  traces: ReturnType<typeof findTracesForSong>;
  onLeaveTrace: () => void;
}) {
  const heroTrace = traces[0];
  const otherTraces = traces.slice(1, 3);

  return (
    <div className="grid grid-cols-3 gap-2 px-2">
      <div className="col-span-3 rounded-3xl bg-card-gradient border border-accent/30 p-5 shadow-glow relative overflow-hidden">
        <div aria-hidden className="absolute -top-8 -right-8 h-32 w-32 bg-accent/30 rounded-full blur-3xl" />
        <Quote className="h-5 w-5 text-accent" />
        {heroTrace ? (
          <>
            <p className="mt-3 text-[15px] leading-relaxed italic text-foreground/95">
              "{heroTrace.note}"
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="h-6 w-6 rounded-full grid place-items-center text-[10px] font-mono text-background"
                style={{ background: heroTrace.userColor }}
              >
                {heroTrace.userInitial}
              </span>
              <p className="text-[11px] text-muted-foreground">
                a stranger · {heroTrace.time} ago · {heroTrace.place}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-[14px] leading-relaxed italic text-muted-foreground">
            No one has left a trace here yet. You could be the first.
          </p>
        )}
      </div>

      <div className="col-span-1 row-span-2 relative aspect-square rounded-2xl overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/60 to-background" />
        <div aria-hidden className="absolute -top-4 -left-4 h-20 w-20 bg-accent/40 rounded-full blur-2xl" />
        <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
          <p className="text-[10px] font-display font-medium leading-tight text-foreground/95 line-clamp-2">{song}</p>
          <p className="text-[8px] font-mono text-muted-foreground truncate">{artist}</p>
        </div>
      </div>

      <div className="col-span-2 rounded-2xl glass border border-white/10 p-3.5">
        {otherTraces[0] ? (
          <>
            <p className="text-[12px] leading-snug italic text-foreground/90 line-clamp-3">
              "{otherTraces[0].note}"
            </p>
            <p className="mt-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
              — {otherTraces[0].userInitial}-stranger · {otherTraces[0].time}
            </p>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">
            More voices will gather here as people pass through.
          </p>
        )}
      </div>

      <div className="col-span-2 rounded-2xl glass border border-white/10 p-3 flex flex-wrap gap-1.5 items-center">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-accent pr-1">moods here</span>
        {location.tags.map((t) => (
          <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
            #{t}
          </span>
        ))}
      </div>

      {otherTraces[1] && (
        <div className="col-span-3 rounded-2xl glass border border-white/10 p-3.5">
          <p className="text-[12px] leading-snug italic text-foreground/90">
            "{otherTraces[1].note}"
          </p>
          <p className="mt-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            — {otherTraces[1].userInitial}-stranger · {otherTraces[1].place} · {otherTraces[1].time}
          </p>
        </div>
      )}

      <button
        onClick={onLeaveTrace}
        className="col-span-3 rounded-2xl p-4 glass-strong border border-accent/30 hover:border-accent transition-colors text-left flex items-center gap-3"
      >
        <MessageCircle className="h-5 w-5 text-accent" />
        <div className="flex-1">
          <p className="text-[14px] font-medium">Leave a trace</p>
          <p className="text-[11px] text-muted-foreground">One sentence. No name. Stays in this room.</p>
        </div>
      </button>
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
