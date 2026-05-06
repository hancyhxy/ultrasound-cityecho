import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, X, Play, Plus } from "lucide-react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { PinnedToast } from "@/components/PinnedToast";
import { FEED, PINS, getUserAvatar, userTraceToTrace, type Trace } from "@/lib/seed-data";
import { getUserTraces, saveUserTrace, type UserTrace } from "@/lib/storage";

const tracesSearchSchema = z.object({
  highlight: z.string().optional(),
});

export const Route = createFileRoute("/traces")({
  validateSearch: tracesSearchSchema,
  head: () => ({
    meta: [
      { title: "Trace — Ultrasound" },
      { name: "description", content: "What strangers left behind, song by song." },
    ],
  }),
  component: TracesScreen,
});

type StoryStranger = {
  kind: "stranger";
  id: string;
  initial: string;
  color: string;
  hasNew: boolean;
  traces: Trace[];
};

type StoryItem = { kind: "self" } | StoryStranger;

function TracesScreen() {
  const { highlight } = Route.useSearch();
  const highlightRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  const [pinnedTrace, setPinnedTrace] = useState<UserTrace | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  // Paged feed — show 10 first, "Show more" reveals 10 more at a time.
  // Cuts initial cognitive load + lets the page breathe (airbuds-style).
  const [visibleCount, setVisibleCount] = useState(10);

  const myTracesAsTrace = useMemo(
    () => getUserTraces().map(userTraceToTrace),
    // re-read after a new pin lands so feed/stories pick it up immediately
    [pinnedTrace],
  );

  const feedToRender: Trace[] = useMemo(
    () => [...myTracesAsTrace, ...FEED],
    [myTracesAsTrace],
  );

  const storyItems = useMemo<StoryItem[]>(() => {
    const grouped = new Map<string, StoryStranger>();
    for (const t of FEED) {
      const existing = grouped.get(t.userId);
      if (existing) {
        existing.traces.push(t);
        if (t.unread) existing.hasNew = true;
      } else {
        grouped.set(t.userId, {
          kind: "stranger",
          id: t.userId,
          initial: t.userInitial,
          color: t.userColor,
          hasNew: !!t.unread,
          traces: [t],
        });
      }
    }
    return [{ kind: "self" }, ...Array.from(grouped.values())];
  }, []);

  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const openUser =
    storyItems
      .filter((s): s is StoryStranger => s.kind === "stranger")
      .find((u) => u.id === openUserId) ?? null;

  return (
    <PhoneShell>
      <header className="px-6 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
          Discover
        </p>
        <h1 className="mt-2 text-[28px] leading-[1.05] font-extrabold tracking-tight text-white">
          Strangers,<br />song by song.
        </h1>
      </header>

      {/* IG-style story bubbles — self pinned at the head of the row.
          Sized so 4 bubbles fit on one row (88px each: 80 avatar + ~8 gap),
          giving the row breathing room and matching the airbuds reference. */}
      <div className="mt-5 px-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1">
          {storyItems.map((s) =>
            s.kind === "self" ? (
              <button
                key="self"
                onClick={() => setComposerOpen(true)}
                className="shrink-0 flex flex-col items-center gap-1.5 group"
                aria-label="Pin a new trace"
              >
                <span className="relative h-20 w-20 rounded-full grid place-items-center transition-transform group-hover:scale-105 p-[2px] bg-white/10">
                  <img
                    src={getUserAvatar("self")}
                    alt="Your avatar"
                    className="h-full w-full rounded-full object-cover border-2 border-background"
                    loading="lazy"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent border-2 border-background grid place-items-center">
                    <Plus className="h-3 w-3 text-accent-foreground" strokeWidth={2.8} />
                  </span>
                </span>
                <span className="text-[10px] font-mono italic text-accent/90">your turn</span>
              </button>
            ) : (
              <button
                key={s.id}
                onClick={() => setOpenUserId(s.id)}
                className="shrink-0 flex flex-col items-center gap-1.5 group"
                aria-label={`See traces from ${s.initial}`}
              >
                <span
                  className={`relative h-20 w-20 rounded-full grid place-items-center transition-transform group-hover:scale-105 ${
                    s.hasNew ? "p-[2px] bg-gradient-to-tr from-accent via-primary to-accent" : "p-[2px] bg-white/10"
                  }`}
                >
                  <img
                    src={getUserAvatar(s.id)}
                    alt={`${s.initial} avatar`}
                    className="h-full w-full rounded-full object-cover border-2 border-background"
                    loading="lazy"
                  />
                  {s.hasNew && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-accent border-2 border-background" />
                  )}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {s.traces[0].time}
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Sentence-forward feed — paged 10-at-a-time so the page breathes
          and the user opts into more. Cards are slimmed: just avatar +
          quote + place·time meta, mood/song chips removed for density. */}
      <div className="px-5 mt-5 space-y-2 pb-4">
        <p className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Today, in the city
        </p>
        {feedToRender.slice(0, visibleCount).map((t) => (
          <article
            key={t.id}
            ref={(el) => {
              if (highlight === t.id) highlightRef.current = el;
            }}
            className={`rounded-2xl px-4 py-3 bg-white/8 backdrop-blur-md border transition-all ${
              highlight === t.id
                ? "border-accent shadow-accent bg-accent/5"
                : "border-white/10 hover:border-white/25"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={getUserAvatar(t.userId)}
                alt=""
                className="shrink-0 h-9 w-9 rounded-full object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-foreground/95 line-clamp-2 italic">
                  "{t.note}"
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  {t.locationId ? (
                    <Link
                      to="/"
                      search={{ pin: t.locationId }}
                      className="flex items-center gap-1 truncate hover:text-accent transition-colors"
                      aria-label={`Open map at ${t.place}`}
                    >
                      <MapPin className="h-2.5 w-2.5 text-accent" />
                      <span className="truncate">{t.place}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-2.5 w-2.5 text-accent" />
                      <span className="truncate">{t.place}</span>
                    </span>
                  )}
                  <span>·</span>
                  <span>{t.time}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
        {visibleCount < feedToRender.length && (
          <button
            onClick={() => setVisibleCount((n) => n + 10)}
            className="w-full mt-2 py-3 rounded-2xl bg-white/8 backdrop-blur-md border border-white/10 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white hover:border-white/25 transition-colors"
          >
            Show more
          </button>
        )}
      </div>

      {openUser && (
        <UserStoryModal user={openUser} onClose={() => setOpenUserId(null)} />
      )}
      {composerOpen && (
        <TracesComposer
          onSubmitted={(t) => setPinnedTrace(t)}
          onClose={() => setComposerOpen(false)}
        />
      )}
      <PinnedToast trace={pinnedTrace} onDismiss={() => setPinnedTrace(null)} />
    </PhoneShell>
  );
}

function UserStoryModal({ user, onClose }: { user: StoryStranger; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[28px] p-6 pb-24 border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />
        <div className="flex items-center gap-3">
          <img
            src={getUserAvatar(user.id)}
            alt={`${user.initial} avatar`}
            className="h-12 w-12 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <p className="font-display text-[18px] leading-tight">a stranger</p>
            <p className="text-[11px] text-muted-foreground">{user.traces.length} traces · this week</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {user.traces.map((t) => (
            <div key={t.id} className="rounded-2xl p-4 bg-background/40 border border-white/5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {t.locationId ? (
                  <Link
                    to="/"
                    search={{ pin: t.locationId }}
                    className="flex items-center gap-1.5 hover:text-accent transition-colors"
                    aria-label={`Open map at ${t.place}`}
                  >
                    <MapPin className="h-3 w-3 text-accent" />
                    <span>{t.place}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-accent" />
                    <span>{t.place}</span>
                  </div>
                )}
                <span>{t.time}</span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed italic text-foreground/95">"{t.note}"</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <Link
                  to="/playing"
                  search={{ song: t.forSong.song, artist: t.forSong.artist, loc: t.locationId }}
                  className="group/song min-w-0 flex items-center gap-2 rounded-xl -mx-1.5 px-1.5 py-1 hover:bg-accent/10 transition-colors"
                  aria-label={`Play ${t.forSong.song} by ${t.forSong.artist}`}
                >
                  <span className="shrink-0 h-7 w-7 rounded-full grid place-items-center bg-accent/15 border border-accent/30 group-hover/song:bg-accent group-hover/song:border-accent transition-colors">
                    <Play className="h-3 w-3 text-accent group-hover/song:text-accent-foreground" fill="currentColor" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate">{t.forSong.song}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{t.forSong.artist}</p>
                  </div>
                </Link>
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20">
                  {t.mood}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const COMPOSER_MOODS = ["calm", "lonely", "hopeful", "alive", "soft", "homesick"];

function TracesComposer({
  onSubmitted,
  onClose,
}: {
  onSubmitted: (t: UserTrace) => void;
  onClose: () => void;
}) {
  // Default place — pick the user's home pin if any user-traces exist; else Wynyard.
  const defaultPinId = useMemo(() => {
    const traces = getUserTraces();
    if (traces.length === 0) return "wynyard";
    const counts = new Map<string, number>();
    for (const t of traces) {
      if (!t.locationId) continue;
      counts.set(t.locationId, (counts.get(t.locationId) ?? 0) + 1);
    }
    let topId = "wynyard";
    let topN = 0;
    for (const [id, n] of counts) {
      if (n > topN) {
        topId = id;
        topN = n;
      }
    }
    return topId;
  }, []);

  const [pinId, setPinId] = useState<string>(defaultPinId);
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const selectedPin = PINS.find((p) => p.id === pinId);

  function handleSubmit() {
    const trimmedSong = song.trim();
    const trimmedArtist = artist.trim();
    const trimmedNote = note.trim();
    if (!trimmedSong || !trimmedArtist) {
      setHint("which song held you?");
      return;
    }
    if (!trimmedNote) {
      setHint("write one honest thing");
      return;
    }
    if (!mood) {
      setHint("choose a mood");
      return;
    }
    if (!selectedPin) {
      setHint("pick a place");
      return;
    }
    const t = saveUserTrace({
      song: trimmedSong,
      artist: trimmedArtist,
      place: selectedPin.label,
      locationId: selectedPin.id,
      note: trimmedNote,
      mood,
      forSong: { song: trimmedSong, artist: trimmedArtist },
    });
    onSubmitted(t);
    onClose();
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[28px] p-6 pb-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[88%] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-[22px] leading-tight">Pin a trace.</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              One song, one place, one honest sentence.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Where */}
        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Where</p>
        <div className="flex flex-wrap gap-2">
          {PINS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPinId(p.id);
                if (hint) setHint(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                p.id === pinId ? "bg-accent text-accent-foreground" : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* What song */}
        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">What song held you</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            value={song}
            onChange={(e) => {
              setSong(e.target.value);
              if (hint) setHint(null);
            }}
            placeholder="song"
            maxLength={80}
            className="rounded-2xl bg-background/50 border border-white/10 px-4 py-3 text-[14px] focus:outline-none focus:border-accent/40 placeholder:text-muted-foreground/60"
          />
          <input
            value={artist}
            onChange={(e) => {
              setArtist(e.target.value);
              if (hint) setHint(null);
            }}
            placeholder="artist"
            maxLength={60}
            className="rounded-2xl bg-background/50 border border-white/10 px-4 py-3 text-[14px] focus:outline-none focus:border-accent/40 placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Note */}
        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">What did it hold for you</p>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (hint) setHint(null);
          }}
          placeholder="A stranger in this seat tomorrow will read it."
          maxLength={140}
          className="w-full h-24 rounded-2xl bg-background/50 border border-white/10 p-4 text-[14px] resize-none focus:outline-none focus:border-accent/40 placeholder:text-muted-foreground/60"
        />
        <div className="mt-1 text-[10px] font-mono text-muted-foreground text-right">{note.length}/140</div>

        {/* Mood */}
        <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Mood</p>
        <div className="flex flex-wrap gap-2">
          {COMPOSER_MOODS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMood(m);
                if (hint) setHint(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                mood === m ? "bg-accent text-accent-foreground" : "bg-white/5 text-foreground/70 hover:bg-white/10"
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
          Pin to {selectedPin?.label ?? "this place"}
        </button>
      </div>
    </div>
  );
}
