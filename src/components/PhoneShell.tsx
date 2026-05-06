import { Link, useRouterState } from "@tanstack/react-router";
import { House, LayoutGrid, Library, User } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const NAV = [
  { to: "/", label: "Map", icon: House },
  { to: "/traces", label: "Story", icon: LayoutGrid },
  { to: "/playlist", label: "Playlist", icon: Library },
  { to: "/me", label: "Me", icon: User },
] as const;

export function PhoneShell({
  children,
  backdropStyle,
  scrollable = true,
  showStatusBar = true,
}: {
  children: ReactNode;
  /** Per-page backdrop override. When provided, replaces the default plum
      background of the phone frame (covers status bar, main, and nav area). */
  backdropStyle?: CSSProperties;
  /** Some screens are fixed canvases and should not vertically scroll. */
  scrollable?: boolean;
  /** Some screens render a custom status bar inside their own overlay chrome. */
  showStatusBar?: boolean;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center px-4">
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
            {showStatusBar && (
              <div className="flex items-center justify-between px-7 pt-4 pb-1 text-[11px] font-mono text-muted-foreground/80">
                <span>9:41</span>
                <span>100%</span>
              </div>
            )}

            {/* content area */}
            <main
              className={`relative ${showStatusBar ? "h-[760px]" : "h-[781px]"} scrollbar-none ${
                scrollable ? "overflow-y-auto" : "overflow-hidden"
              }`}
            >
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
        <div
          aria-hidden
          className="absolute inset-x-12 -bottom-8 h-16 bg-primary/30 blur-2xl rounded-full opacity-40"
        />
      </div>
    </div>
  );
}
