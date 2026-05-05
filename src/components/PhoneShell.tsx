import { Link, useRouterState } from "@tanstack/react-router";
import { Map, Sparkles, Library, User } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Map", icon: Map },
  { to: "/traces", label: "Trace", icon: Sparkles },
  { to: "/playlist", label: "Playlist", icon: Library },
  { to: "/me", label: "Me", icon: User },
] as const;

export function PhoneShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-6 md:py-10">
      {/* Ambient backdrop orbs (visible behind phone on desktop) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="drift absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl" />
        <div className="drift absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-warm/20 blur-3xl" style={{ animationDelay: "3s" }} />
        <div className="drift absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/15 blur-3xl" style={{ animationDelay: "6s" }} />
      </div>

      {/* Phone frame */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="relative rounded-[44px] border border-white/10 bg-background/80 shadow-soft overflow-hidden backdrop-blur-xl">
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pt-4 pb-1 text-[11px] font-mono text-muted-foreground/80">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warm" />
              <span>Ultrasound</span>
            </div>
            <span>100%</span>
          </div>

          {/* content area */}
          <main className="relative h-[760px] overflow-y-auto pb-28 scrollbar-none">
            {children}
          </main>

          {/* bottom nav */}
          <nav className="absolute bottom-3 left-3 right-3 glass-strong rounded-3xl px-2 py-2 flex items-center justify-between">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
                    active ? "text-warm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] transition-transform ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.4 : 1.8} />
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
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
