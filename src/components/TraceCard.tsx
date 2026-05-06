import { Link } from "@tanstack/react-router";
import type { Trace } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";

/** Hand-tuned rotation cycle so the stack feels like loosely tossed paper.
   Cycles through these values by index — predictable, no Math.random()
   that would re-roll on every re-render. */
const TILT_CYCLE = [-1.4, 0.8, -0.6, 1.2, -1.0, 0.5];

export function TraceCard({
  trace,
  index = 0,
  onClick,
}: {
  trace: Trace;
  /** Card index in the parent stack — drives the small tilt rotation. */
  index?: number;
  onClick?: () => void;
}) {
  const isSelf = trace.userId === "self";
  const tilt = TILT_CYCLE[index % TILT_CYCLE.length];
  // Per-trace cover: the album art for the song this trace is about.
  const theme = getSongTheme(trace.song, trace.artist);
  const cover = theme.cover;

  const inner = (
    <div
      className="flex items-stretch gap-3 p-3 bg-white rounded-card-lg shadow-soft transition-transform active:scale-[0.99]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* Left — album cover for the song this trace is about. */}
      <div className="relative h-[72px] w-[72px] shrink-0 rounded-2xl overflow-hidden bg-zinc-300">
        {cover ? (
          <img
            src={cover}
            alt={`${trace.song} cover`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-zinc-300 to-zinc-400">
            <span className="text-[28px]" aria-hidden>🎵</span>
          </div>
        )}
        {isSelf && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent-hot grid place-items-center">
            <span className="text-[8px] font-extrabold text-white">+</span>
          </span>
        )}
      </div>

      {/* Right — song + artist on a single line so the note has more room. */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <p className="text-[13px] leading-tight truncate">
          <span className="font-bold text-zinc-900">{trace.song}</span>
          <span className="text-zinc-500"> · {trace.artist}</span>
        </p>

        <p className="text-[12px] leading-snug text-zinc-700 line-clamp-3 italic mt-1">
          "{trace.note}"
        </p>

        <p className="text-[10px] text-zinc-500 truncate mt-1">
          <span className="font-semibold text-zinc-700">
            {isSelf ? "you" : `${trace.userInitial}-stranger`}
          </span>
          {" · "}
          {trace.time}
        </p>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${trace.place}`}
        className="block w-full text-left"
      >
        {inner}
      </button>
    );
  }

  if (trace.locationId) {
    return (
      <Link
        to="/"
        search={{ pin: trace.locationId }}
        aria-label={`Open map at ${trace.place}`}
        className="block"
      >
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}
