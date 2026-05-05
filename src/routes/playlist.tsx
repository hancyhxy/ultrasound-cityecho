// TODO ITER-9+: redesign /playlist UX from scratch.
// This page is Lovable-prototype residue — its UX was never re-examined during
// ITER-1..ITER-7. ITER-7 only token-shifts the visuals so it doesn't visually
// break vs. the rest of the app; structure and information hierarchy below
// remain Lovable-original and should be rebuilt around place-bound seed
// playlists + user-pinned traces playlists in a future iteration.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Play, Plus, Trash2, X, MapPin } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { ALL_MOODS, PINS, SEED_PLAYLISTS, type SeedPlaylist } from "@/lib/seed-data";
import {
  deleteUserPlaylist,
  getUserPlaylists,
  saveUserPlaylist,
  type UserPlaylist,
} from "@/lib/storage";

export const Route = createFileRoute("/playlist")({
  head: () => ({
    meta: [
      { title: "Playlist — Ultrasound" },
      { name: "description", content: "Quiet catalogues built from strangers' recommendations." },
    ],
  }),
  component: PlaylistScreen,
});

type FilterMode = "all" | "mood" | "location";

type Card =
  | { kind: "seed"; data: SeedPlaylist }
  | { kind: "user"; data: UserPlaylist };

function PlaylistScreen() {
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [filterValue, setFilterValue] = useState<string | null>(null);

  useEffect(() => {
    setUserPlaylists(getUserPlaylists());
  }, []);

  const reload = () => setUserPlaylists(getUserPlaylists());

  const cards: Card[] = useMemo(() => {
    const all: Card[] = [
      ...userPlaylists.map((p) => ({ kind: "user" as const, data: p })),
      ...SEED_PLAYLISTS.map((p) => ({ kind: "seed" as const, data: p })),
    ];
    if (filterMode === "mood" && filterValue) {
      return all.filter((c) => c.data.moods.includes(filterValue));
    }
    if (filterMode === "location" && filterValue) {
      return all.filter((c) => c.data.locationId === filterValue);
    }
    return all;
  }, [userPlaylists, filterMode, filterValue]);

  return (
    <PhoneShell>
      <header className="px-6 pt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">Yours</p>
          <h1 className="mt-2 text-[28px] leading-[1.1] font-medium">
            The places you<br /><span className="italic text-gradient-neon">come back to.</span>
          </h1>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create new playlist"
          className="h-11 w-11 rounded-full bg-accent shadow-accent grid place-items-center hover:scale-105 transition-transform shrink-0 mt-1"
        >
          <Plus className="h-5 w-5 text-accent-foreground" strokeWidth={2.5} />
        </button>
      </header>

      {/* Filter row */}
      <div className="mt-5 px-5 space-y-2">
        <div className="flex gap-1.5">
          {(["all", "mood", "location"] as FilterMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setFilterMode(m);
                setFilterValue(null);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-colors ${
                filterMode === m
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {m === "all" ? "all" : `by ${m}`}
            </button>
          ))}
        </div>

        {filterMode === "mood" && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ALL_MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setFilterValue(filterValue === m ? null : m)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  filterValue === m
                    ? "bg-accent/30 text-accent border border-accent/40"
                    : "bg-white/5 text-foreground/70 border border-white/5 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {filterMode === "location" && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PINS.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterValue(filterValue === p.id ? null : p.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1 ${
                  filterValue === p.id
                    ? "bg-accent/30 text-accent border border-accent/40"
                    : "bg-white/5 text-foreground/70 border border-white/5 hover:bg-white/10"
                }`}
              >
                <MapPin className="h-2.5 w-2.5" />
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        {cards.length === 0 && (
          <div className="col-span-2 rounded-2xl p-5 glass border border-white/5 text-center">
            <p className="text-[13px] text-muted-foreground">Nothing here yet under this filter.</p>
          </div>
        )}
        {cards.map((c) => (
          <PlaylistCard key={`${c.kind}-${c.data.id}`} card={c} onDelete={reload} />
        ))}
      </div>

      <section className="mx-6 mt-7 rounded-2xl p-5 bg-card-gradient border border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">This week</p>
        <h3 className="mt-2 font-display text-[20px] leading-snug">You contributed 4 traces.</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">3 strangers played the songs you pinned.</p>
        <div className="mt-4 flex gap-1.5 h-12 items-end">
          {[40, 22, 78, 55, 90, 30, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-accent/30 to-accent" style={{ height: `${h}%` }} />
          ))}
        </div>
      </section>

      {createOpen && (
        <CreatePlaylistModal
          onClose={() => setCreateOpen(false)}
          onSaved={() => {
            reload();
            setCreateOpen(false);
          }}
        />
      )}
    </PhoneShell>
  );
}

function PlaylistCard({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const isUser = card.kind === "user";
  const data = card.data;
  const gradient = isUser
    ? "from-accent/60 to-primary/60"
    : (data as SeedPlaylist).gradient;
  const count = isUser ? (data as UserPlaylist).songs.length : (data as SeedPlaylist).count;

  return (
    <div className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

      {isUser && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteUserPlaylist(data.id);
            onDelete();
          }}
          aria-label="Delete playlist"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/60 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3 w-3 text-foreground/80" />
        </button>
      )}
      {isUser && (
        <span className="absolute top-2 left-2 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/30 text-accent border border-accent/40">
          yours
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-[13px] font-medium leading-tight line-clamp-2">{data.name}</p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground">{count} songs</span>
          <span className="h-7 w-7 rounded-full bg-accent grid place-items-center shadow-accent opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-3 w-3 text-accent-foreground" fill="currentColor" />
          </span>
        </div>
        {data.moods.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {data.moods.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-foreground/70"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePlaylistModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);

  const toggleMood = (m: string) =>
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    saveUserPlaylist({ name: name.trim(), moods, locationId, songs: [] });
    onSaved();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[28px] p-6 pb-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-[22px] leading-tight">A new place to return to.</h3>
            <p className="mt-1 text-xs text-muted-foreground">Name it. Tag the mood. Songs come later.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sunday on the line"
          maxLength={60}
          autoFocus
          className="mt-5 w-full h-12 rounded-2xl bg-background/50 border border-white/10 px-4 text-[15px] focus:outline-none focus:border-accent/40 placeholder:text-muted-foreground/60"
        />

        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Moods</p>
        <div className="flex flex-wrap gap-2">
          {ALL_MOODS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMood(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                moods.includes(m)
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Bind to a place (optional)</p>
        <div className="flex flex-wrap gap-2">
          {PINS.map((p) => (
            <button
              key={p.id}
              onClick={() => setLocationId(locationId === p.id ? undefined : p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                locationId === p.id
                  ? "bg-accent/30 text-accent border border-accent/40"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10 border border-transparent"
              }`}
            >
              <MapPin className="h-3 w-3" />
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="mt-7 w-full h-12 rounded-2xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity shadow-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Make it
        </button>
      </div>
    </div>
  );
}
