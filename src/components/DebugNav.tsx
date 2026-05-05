import { Link, useRouterState } from "@tanstack/react-router";

const SCREENS = [
  { to: "/", label: "Map" },
  { to: "/traces", label: "Trace" },
  { to: "/playlist", label: "Playlist" },
  { to: "/me", label: "Me" },
  { to: "/playing", label: "Playing" },
] as const;

export function DebugNav() {
  if (!import.meta.env.DEV) return null;

  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div
      aria-label="Debug screen navigator"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-wrap gap-1.5 justify-center max-w-[440px] px-3 py-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-soft"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60 self-center pl-1 pr-2 border-r border-white/10 mr-1">
        debug
      </span>
      {SCREENS.map(({ to, label }) => {
        const active = to === "/" ? path === "/" : path.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors ${
              active
                ? "bg-warm text-warm-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
