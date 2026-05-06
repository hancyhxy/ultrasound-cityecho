import { getSongTheme } from "@/lib/song-themes";
import type { Song } from "@/lib/seed-data";

/**
 * 2×2 grid of album covers — used as the artwork for a location's playlist.
 *
 * Takes the first 4 songs and renders each as a cell. If fewer than 4 songs
 * are available, missing cells render as a tint gradient placeholder so the
 * grid always has 4 visual quadrants.
 */
export function FourGridCover({
  songs,
  size = 160,
}: {
  songs: Song[];
  /** Outer square edge in px. Each cell is half this. */
  size?: number;
}) {
  // Always render exactly 4 cells; pad with nulls if needed.
  const cells: (Song | null)[] = [
    songs[0] ?? null,
    songs[1] ?? null,
    songs[2] ?? null,
    songs[3] ?? null,
  ];

  // If no songs at all, show a single friendly placeholder (not a 4-grid of greys).
  if (songs.length === 0) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden ring-2 ring-white/15 shadow-soft grid place-items-center bg-gradient-to-br from-primary/40 via-accent-hot/30 to-primary-bright/40"
        style={{ width: size, height: size }}
      >
        <span className="text-[36px] opacity-60" aria-hidden>🎵</span>
      </div>
    );
  }

  return (
    <div
      className="relative grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden ring-2 ring-white/15 shadow-soft"
      style={{ width: size, height: size }}
    >
      {cells.map((song, i) => {
        if (!song) {
          // Empty cell when there are some songs but fewer than 4 — use a tint
          // gradient that matches the first song so the missing quadrants don't
          // read as broken. Falls back to neutral grey if no first song.
          const fallbackTheme = songs[0] ? getSongTheme(songs[0].song, songs[0].artist) : null;
          return (
            <div
              key={i}
              className="bg-gradient-to-br from-zinc-700 to-zinc-900"
              style={
                fallbackTheme
                  ? { background: `linear-gradient(135deg, ${fallbackTheme.tint}, ${fallbackTheme.tintDeep})` }
                  : undefined
              }
            />
          );
        }
        const theme = getSongTheme(song.song, song.artist);
        return (
          <div key={i} className="relative bg-zinc-800 overflow-hidden">
            {theme.cover ? (
              <img
                src={theme.cover}
                alt={`${song.song} cover`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              // No registered cover — paint the cell with the song's tint
              // and stamp the song initial so the cell still carries info.
              <div
                className="absolute inset-0 grid place-items-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.tint}, ${theme.tintDeep})`,
                }}
              >
                <span className="text-white/80 text-[14px] font-extrabold uppercase tracking-tight">
                  {song.song.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
