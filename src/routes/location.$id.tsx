import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, Play } from "lucide-react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { FourGridCover } from "@/components/FourGridCover";
import { TraceCard } from "@/components/TraceCard";
import { findTracesForLocation, PINS } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";

const locationSearchSchema = z.object({
  // Inner tab: playlist (default) shows the song deck;
  // story shows the place's trace stream.
  tab: z.enum(["playlist", "story"]).optional(),
});

export const Route = createFileRoute("/location/$id")({
  validateSearch: locationSearchSchema,
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
  const { tab = "playlist" } = Route.useSearch();
  const isStory = tab === "story";
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
      {/* Top bar — back arrow + PLAYLIST/STORY pill toggle. The pill keeps
          the place as the anchor and switches the lens (curated songs vs
          this place's trace stream). */}
      <div className="relative z-10 px-5 pt-3 flex items-center justify-between">
        <Link to="/" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 backdrop-blur">
          <ChevronDown className="h-4 w-4 text-white" />
        </Link>
        <div className="inline-flex items-center gap-0.5 h-9 rounded-pill bg-black/30 backdrop-blur p-0.5">
          <Link
            to="/location/$id"
            params={{ id: pin.id }}
            search={{ tab: "playlist" as const }}
            className={`inline-flex items-center h-8 px-3.5 rounded-pill font-extrabold uppercase tracking-[0.16em] text-[11px] transition-colors ${
              !isStory ? "bg-white text-zinc-900" : "text-white/70 hover:text-white"
            }`}
          >
            Playlist
          </Link>
          <Link
            to="/location/$id"
            params={{ id: pin.id }}
            search={{ tab: "story" as const }}
            className={`inline-flex items-center h-8 px-3.5 rounded-pill font-extrabold uppercase tracking-[0.16em] text-[11px] transition-colors ${
              isStory ? "bg-white text-zinc-900" : "text-white/70 hover:text-white"
            }`}
          >
            Story
          </Link>
        </div>
        {/* Empty slot keeps the back arrow / pill centred. */}
        <span className="h-9 w-9" />
      </div>

      {isStory ? (
        <StoryTab pin={pin} theme={theme} />
      ) : (
        <PlaylistTab pin={pin} theme={theme} />
      )}
    </PhoneShell>
  );
}

function PlaylistTab({
  pin,
  theme,
}: {
  pin: (typeof PINS)[number];
  theme: { tint: string; tintDeep: string; tintLight: string };
}) {
  return (
    <>

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
    </>
  );
}

function StoryTab({
  pin,
  theme,
}: {
  pin: (typeof PINS)[number];
  theme: { tint: string; tintDeep: string; tintLight: string };
}) {
  const traces = findTracesForLocation(pin.id);
  const count = traces.length;
  return (
    <div className="relative z-10 pb-32 min-h-full">
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
          {pin.label}
        </h1>
        <p className="mt-2 text-[12px] italic text-white/70 max-w-[18rem]">
          {pin.mood}
        </p>
        <p
          className="mt-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: theme.tintLight }}
        >
          {count > 0 ? `${count} ${count === 1 ? "story" : "stories"} here` : "no stories yet"}
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

      {/* Sticky chunky CTA — sits above the bottom nav with breathing
          room (the parent's pb-32 reserves space so the last trace card
          isn't covered by the CTA). Tapping routes to /traces. */}
      <div
        className="sticky mt-6 flex justify-center pointer-events-none"
        style={{ bottom: "calc(var(--nav-height) + 8px)" }}
      >
        <Link
          to="/traces"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white"
          style={{
            background: theme.tint,
            boxShadow: `0 8px 24px -8px ${theme.tintDeep}`,
          }}
        >
          <span aria-hidden>＋</span>
          Leave a story here
        </Link>
      </div>
    </div>
  );
}
