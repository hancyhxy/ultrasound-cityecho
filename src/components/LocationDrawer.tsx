import { Link } from "@tanstack/react-router";
import { Play, Users, X, Plus, Heart, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Equalizer } from "@/components/Equalizer";
import type { Pin } from "@/lib/seed-data";
import { getUserPlaylists, addSongToPlaylist, saveUserPlaylist } from "@/lib/storage";

type Snap = "half" | "full";

export function LocationDrawer({
  pin,
  onOpenChange,
}: {
  pin: Pin | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [snap, setSnap] = useState<Snap>("half");
  const [savedSongIdx, setSavedSongIdx] = useState<number | null>(null);

  useEffect(() => {
    if (pin) setSnap("half");
  }, [pin?.id]);

  if (!pin) return null;

  const heightClass = snap === "half" ? "h-[58%]" : "h-[88%]";

  const onQuickSave = (idx: number) => {
    const song = pin.songs[idx];
    const playlists = getUserPlaylists();
    const target =
      playlists.find((p) => p.locationId === pin.id) ??
      saveUserPlaylist({
        name: `${pin.label} · saved`,
        moods: [pin.tags[0] ?? "soft"],
        locationId: pin.id,
        songs: [],
      });
    addSongToPlaylist(target.id, song);
    setSavedSongIdx(idx);
    setTimeout(() => setSavedSongIdx(null), 1200);
  };

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-40 px-3 transition-[height] duration-300 ease-out ${heightClass}`}
      role="dialog"
      aria-label={`${pin.label} location playlist`}
    >
      <div className="relative h-full rounded-t-[28px] overflow-hidden glass-strong border border-accent/20 shadow-glow animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col">
        <div aria-hidden className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-accent/40 blur-3xl pointer-events-none" />

        {/* drag handle / snap toggle */}
        <button
          onClick={() => setSnap(snap === "half" ? "full" : "half")}
          aria-label={snap === "half" ? "Expand drawer" : "Collapse drawer"}
          className="relative w-full pt-3 pb-1 flex flex-col items-center gap-1 group"
        >
          <span className="block h-1 w-10 rounded-full bg-white/30 group-hover:bg-accent/60 transition-colors" />
          <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60 flex items-center gap-1">
            {snap === "half" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {snap === "half" ? "swipe up for full list" : "collapse"}
          </span>
        </button>

        <div className="relative px-5 pt-1 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
                {pin.count} traces · here
              </p>
              <h3 className="mt-1 font-display text-[22px] leading-tight">{pin.label}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground italic">{pin.mood}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close drawer"
              className="h-8 w-8 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <Equalizer />
              <Users className="h-3.5 w-3.5 text-accent" />
              <span>{pin.listening} listening together</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {pin.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-foreground/70 border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable song list */}
        <div className="relative flex-1 overflow-y-auto px-5 scrollbar-none">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 mb-2">
            What plays here
          </p>
          <ul className="space-y-1.5 pb-4">
            {(snap === "half" ? pin.songs.slice(0, 3) : pin.songs).map((t, i) => {
              const justSaved = savedSongIdx === i;
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 px-2 py-2 rounded-xl bg-background/40 border border-white/5 hover:border-accent/20 transition-colors"
                >
                  <Link
                    to="/playing"
                    search={{ song: t.song, artist: t.artist, loc: pin.id }}
                    className="flex items-center gap-3 flex-1 min-w-0 px-1 py-0.5"
                    aria-label={`Play ${t.song} by ${t.artist}`}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground w-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium truncate">{t.song}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => onQuickSave(i)}
                    aria-label={`Save ${t.song} to ${pin.label} playlist`}
                    className={`h-7 w-7 grid place-items-center rounded-full transition-colors shrink-0 ${
                      justSaved ? "bg-accent text-accent-foreground" : "bg-white/5 text-muted-foreground hover:bg-accent/20 hover:text-accent"
                    }`}
                  >
                    {justSaved ? <Heart className="h-3.5 w-3.5" fill="currentColor" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom CTA bar */}
        <div className="relative px-5 pt-2 pb-4 border-t border-white/5 bg-background/40 flex gap-2">
          <Link
            to="/playlist"
            className="h-11 px-4 rounded-2xl bg-white/5 border border-white/5 text-[13px] font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Save list
          </Link>
          <Link
            to="/playing"
            search={{ song: pin.songs[0]?.song, artist: pin.songs[0]?.artist, loc: pin.id }}
            className="flex-1 h-11 rounded-2xl bg-accent text-accent-foreground font-medium shadow-accent flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Tune in to {pin.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
