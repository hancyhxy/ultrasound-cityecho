import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, MapPin } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { FourGridCover } from "@/components/FourGridCover";
import { ALL_MOODS, PINS, SEED_PLAYLISTS, type Song, type SeedPlaylist } from "@/lib/seed-data";
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
      { name: "description", content: "The places you come back to." },
    ],
  }),
  component: PlaylistScreen,
});

type Card =
  | { kind: "seed"; data: SeedPlaylist }
  | { kind: "user"; data: UserPlaylist };

function PlaylistScreen() {
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    // One-time cleanup: remove user playlists whose songs reference tracks that
    // were retired during ITER-9 (Bon Iver, Cha Cha, etc). These show as plum
    // placeholders because their cover lookups now miss song-themes.
    const RETIRED_ARTISTS = new Set(["Bon Iver", "Freddie Dredd", "Aphex Twin", "Brian Eno", "Neil Young"]);
    const all = getUserPlaylists();
    for (const p of all) {
      const allRetired = p.songs.length > 0 && p.songs.every((s) => RETIRED_ARTISTS.has(s.artist));
      if (allRetired) deleteUserPlaylist(p.id);
    }
    setUserPlaylists(getUserPlaylists());
  }, []);

  const reload = () => setUserPlaylists(getUserPlaylists());

  const cards: Card[] = useMemo(() => {
    return [
      ...userPlaylists.map((p) => ({ kind: "user" as const, data: p })),
      ...SEED_PLAYLISTS.map((p) => ({ kind: "seed" as const, data: p })),
    ];
  }, [userPlaylists]);

  return (
    <PhoneShell>
      {/* Hero — chunky-pop title + create button */}
      <header className="px-6 pt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Yours
          </p>
          <h1 className="mt-2 text-[28px] leading-[1.05] font-extrabold tracking-tight text-white">
            The places you<br />come back to.
          </h1>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create new playlist"
          className="h-11 w-11 rounded-full bg-white grid place-items-center shadow-lg active:scale-95 transition-transform shrink-0"
        >
          <Plus className="h-5 w-5 text-zinc-900" strokeWidth={2.6} />
        </button>
      </header>

      {/* 2-col grid of playlist cards (airbuds-style chunky tiles) */}
      <div className="px-5 mt-7 grid grid-cols-2 gap-3 pb-8">
        {cards.length === 0 && (
          <div className="col-span-2 rounded-card-lg p-5 bg-white/5 border border-white/10 text-center">
            <p className="text-[13px] text-white/60">
              Nothing yet. Tap + to start a place to come back to.
            </p>
          </div>
        )}
        {cards.map((c) => (
          <PlaylistCard key={`${c.kind}-${c.data.id}`} card={c} onDelete={reload} />
        ))}
      </div>

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

/** Resolve the songs to render in the cover grid for a card. */
function songsForCover(card: Card): Song[] {
  if (card.kind === "user") {
    return card.data.songs.slice(0, 4);
  }
  // Seed playlist: try to fall back to the bound location's top songs.
  const locId = card.data.locationId;
  if (locId) {
    const pin = PINS.find((p) => p.id === locId);
    if (pin) return pin.songs.slice(0, 4);
  }
  return [];
}

function PlaylistCard({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const isUser = card.kind === "user";
  const data = card.data;
  const count = isUser ? (data as UserPlaylist).songs.length : (data as SeedPlaylist).count;
  const songs = songsForCover(card);
  const linkProps = card.data.locationId
    ? { to: "/location/$id" as const, params: { id: card.data.locationId } }
    : { to: "/playlist" as const };

  return (
    <div className="group relative rounded-card-lg overflow-hidden bg-white/8 backdrop-blur border border-white/10 transition-all hover:border-white/25 hover:bg-white/12">
      {/* Delete button — only for user playlists, hover-revealed */}
      {isUser && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteUserPlaylist(data.id);
            onDelete();
          }}
          aria-label="Delete playlist"
          className="absolute top-2 right-2 h-7 w-7 z-10 rounded-full bg-black/50 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3 w-3 text-white" />
        </button>
      )}

      <Link {...linkProps} className="block p-3">
        {/* Top — 4-grid cover (centered) */}
        <div className="flex justify-center">
          <FourGridCover songs={songs} size={120} />
        </div>

        {/* Body — title, count, moods */}
        <div className="mt-3">
          {isUser && (
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-accent-hot mb-1">
              Yours
            </p>
          )}
          <p className="text-[13px] font-bold text-white leading-tight line-clamp-2">
            {data.name}
          </p>
          <p className="text-[10px] text-white/55 mt-1">{count} songs</p>
          {data.moods.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {data.moods.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/70"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
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
            <h3 className="font-extrabold text-[22px] leading-tight text-white">A new place to return to.</h3>
            <p className="mt-1 text-xs text-white/60">Name it. Tag the mood. Songs come later.</p>
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

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-2">Moods</p>
        <div className="flex flex-wrap gap-2">
          {ALL_MOODS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMood(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                moods.includes(m)
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-2">Bind to a place (optional)</p>
        <div className="flex flex-wrap gap-2">
          {PINS.map((p) => (
            <button
              key={p.id}
              onClick={() => setLocationId(locationId === p.id ? undefined : p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                locationId === p.id
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
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
          className="mt-7 w-full h-12 rounded-2xl bg-white text-zinc-900 font-extrabold uppercase tracking-[0.14em] text-[13px] hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Make it
        </button>
      </div>
    </div>
  );
}
