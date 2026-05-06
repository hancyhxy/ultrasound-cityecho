import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, Play } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { FourGridCover } from "@/components/FourGridCover";
import { PINS } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";

export const Route = createFileRoute("/location/$id")({
  loader: ({ params }) => {
    const pin = PINS.find((p) => p.id === params.id);
    if (!pin) throw notFound();
    return { pin };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.pin.label ?? "Location"} — Ultrasound` },
      { name: "description", content: loaderData?.pin.mood ?? "" },
    ],
  }),
  component: LocationScreen,
});

function LocationScreen() {
  const { pin } = Route.useLoaderData();
  // First song's theme drives the page color field.
  const firstSong = pin.songs[0];
  const theme = firstSong
    ? getSongTheme(firstSong.song, firstSong.artist)
    : { tint: "#3a3a3a", tintDeep: "#0a0a0a", tintLight: "#e0e0e0" };

  const backdropStyle = {
    background: `
      radial-gradient(at 50% 0%, ${theme.tint}ee 0%, transparent 60%),
      linear-gradient(180deg, ${theme.tint} 0%, ${theme.tintDeep} 70%, #050a14 100%)
    `,
  };

  return (
    <PhoneShell backdropStyle={backdropStyle}>
      {/* Top bar — back arrow + PLAYLIST/STORY pill toggle (airbuds-style).
          PLAYLIST is active (we're on it); STORY navigates to /playing?view=story. */}
      <div className="relative z-10 px-5 pt-3 flex items-center justify-between">
        <Link to="/" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 backdrop-blur">
          <ChevronDown className="h-4 w-4 text-white" />
        </Link>
        <div className="inline-flex items-center gap-0.5 h-9 rounded-pill bg-black/30 backdrop-blur p-0.5">
          <span className="inline-flex items-center h-8 px-3.5 rounded-pill bg-white text-zinc-900 font-extrabold uppercase tracking-[0.16em] text-[11px]">
            Playlist
          </span>
          <Link
            to="/playing"
            search={{ loc: pin.id, view: "story" as const }}
            aria-label={`Open ${pin.label} story`}
            className="inline-flex items-center h-8 px-3.5 rounded-pill text-white/70 font-bold uppercase tracking-[0.16em] text-[11px] hover:text-white transition-colors"
          >
            Story
          </Link>
        </div>
      </div>

      {/* Hero — 2×2 cover grid + place name + mood */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-4 pb-5">
        <FourGridCover songs={pin.songs} size={160} />
        <h1 className="mt-5 text-[26px] font-bold text-white tracking-tight text-center">
          {pin.label}
        </h1>
        <p className="mt-1 text-[12px] italic text-white/70 text-center max-w-[18rem]">
          {pin.mood}
        </p>
        <p
          className="mt-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: theme.tintLight }}
        >
          {pin.songs.length} songs · {pin.listening} listening together
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
          {pin.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white/75 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Song list — airbuds-style compact rows. No bottom CTA bar:
          this page IS the "tune in" result — tapping any row is the action. */}
      <div className="relative z-10 px-3 pb-8">
        <ul className="flex flex-col gap-2">
          {pin.songs.map((song, i) => {
            const songTheme = getSongTheme(song.song, song.artist);
            return (
              <li key={`${song.song}::${song.artist}`}>
                <Link
                  to="/playing"
                  search={{ loc: pin.id, song: song.song, artist: song.artist }}
                  className="flex items-center gap-3 p-2.5 pr-3 rounded-2xl bg-white/8 backdrop-blur border border-white/10 transition-colors hover:bg-white/12 active:scale-[0.99]"
                >
                  <span className="text-[10px] font-mono text-white/45 w-5 text-center shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                    {songTheme.cover ? (
                      <img
                        src={songTheme.cover}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${songTheme.tint}, ${songTheme.tintDeep})`,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">
                      {song.song}
                    </p>
                    <p className="text-[11px] text-white/55 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <Play className="h-4 w-4 text-white/40 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

    </PhoneShell>
  );
}
