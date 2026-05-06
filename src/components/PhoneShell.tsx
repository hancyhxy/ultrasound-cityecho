import { Link, useRouterState } from "@tanstack/react-router";
import { House, LayoutGrid, Library, User } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const NAV = [
  { to: "/", label: "Map", icon: House },
  { to: "/traces", label: "Trace", icon: LayoutGrid },
  { to: "/playlist", label: "Playlist", icon: Library },
  { to: "/me", label: "Me", icon: User },
] as const;

export function PhoneShell({
  children,
  backdropStyle,
}: {
  children: ReactNode;
  /** Per-page backdrop override. When provided, replaces the default plum
      background of the phone frame (covers status bar, main, and nav area). */
  backdropStyle?: CSSProperties;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center px-4">
      {/* Ambient backdrop orbs (visible behind phone on desktop) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="drift absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl" />
        <div className="drift absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-accent/20 blur-3xl" style={{ animationDelay: "3s" }} />
        <div className="drift absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/15 blur-3xl" style={{ animationDelay: "6s" }} />
      </div>

      {/* Phone frame — inflow inside an h-screen overflow-hidden parent, so
          the device is centred in the viewport and clipped (rather than
          scrolling) when the viewport is shorter than the phone. Outer is
          pure black so main + nav read as two stacked cards on the chassis. */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="relative rounded-[44px] border border-white/10 shadow-soft overflow-hidden bg-black">
          {/* main card — page content lives here. Per-page backdrop
              applied here so the card carries the color, not the chassis. */}
          <div
            className={`relative rounded-b-[28px] overflow-hidden ${
              backdropStyle ? "" : "bg-background/80"
            }`}
            style={backdropStyle}
          >
            {/* status bar */}
            <div className="flex items-center justify-between px-7 pt-4 pb-1 text-[11px] font-mono text-muted-foreground/80">
              <span>9:41</span>
              <span>100%</span>
            </div>

            {/* content area */}
            <main className="relative h-[760px] overflow-y-auto scrollbar-none">
              {children}
            </main>
          </div>

          {/* bottom nav — sits on the black chassis below the main card,
              with a sliver of black peeking between them */}
          <nav className="px-6 pt-3 pb-5 flex items-center justify-between">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className="relative flex flex-col items-center justify-center w-12 h-9 group"
                >
                  <Icon
                    className={`h-[22px] w-[22px] transition-colors ${
                      active ? "text-white" : "text-white/45 group-hover:text-white/70"
                    }`}
                    strokeWidth={active ? 2.4 : 1.9}
                    fill={active ? "currentColor" : "none"}
                  />
                  <span
                    className={`absolute -bottom-0.5 h-[2px] rounded-full bg-white transition-all ${
                      active ? "w-4 opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* subtle reflection */}
        <div aria-hidden className="absolute inset-x-12 -bottom-8 h-16 bg-primary/30 blur-2xl rounded-full opacity-40" />
      </div>
    </div>
  );
}
