import { createFileRoute } from "@tanstack/react-router";
import { Search, Layers } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Music Map — Ultrasound" },
      { name: "description", content: "A city organised by what people felt here, song by song." },
    ],
  }),
  component: MapScreen,
});

const PINS = [
  { x: 22, y: 28, label: "UTS Library", count: 124, hot: true },
  { x: 62, y: 18, label: "Central Stn", count: 78 },
  { x: 78, y: 44, label: "Strand Arcade", count: 31 },
  { x: 38, y: 56, label: "Glebe café", count: 56 },
  { x: 70, y: 70, label: "Wynyard", count: 92, hot: true },
  { x: 28, y: 78, label: "Broadway gym", count: 19 },
];

function MapScreen() {
  return (
    <PhoneShell>
      <div className="px-6 pt-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm">Explore</p>
        <h1 className="mt-2 text-[30px] leading-[1.1] font-medium">
          A city, <span className="text-gradient-warm italic">organised by feeling.</span>
        </h1>

        <div className="mt-5 flex gap-2">
          <div className="flex-1 h-11 rounded-full glass flex items-center px-4 gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search a place, a mood, a song…</span>
          </div>
          <button className="h-11 w-11 rounded-full glass grid place-items-center">
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map canvas */}
      <div className="mx-5 mt-5 relative aspect-[4/5] rounded-[28px] overflow-hidden border border-white/10 bg-surface">
        {/* abstract topographic background */}
        <svg viewBox="0 0 100 125" className="absolute inset-0 w-full h-full opacity-50">
          <defs>
            <radialGradient id="g1" cx="40%" cy="35%">
              <stop offset="0%" stopColor="oklch(0.4 0.18 295)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="g2" cx="75%" cy="70%">
              <stop offset="0%" stopColor="oklch(0.55 0.16 60)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100" height="125" fill="url(#g1)" />
          <rect width="100" height="125" fill="url(#g2)" />
          {/* contour lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="62"
              rx={20 + i * 7}
              ry={14 + i * 5}
              fill="none"
              stroke="oklch(0.85 0.08 70 / 0.08)"
              strokeWidth="0.2"
            />
          ))}
          {/* train line */}
          <path
            d="M 8 22 Q 30 40, 55 50 T 92 92"
            stroke="oklch(0.82 0.13 65 / 0.7)"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
            fill="none"
          />
        </svg>

        {/* Pins */}
        {PINS.map((p, i) => (
          <button
            key={i}
            className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="relative">
              {p.hot && <span className="absolute inset-0 rounded-full bg-warm/40 animate-ping" />}
              <span className={`relative block rounded-full ${p.hot ? "h-3 w-3 bg-warm shadow-warm" : "h-2.5 w-2.5 bg-primary/80"}`} />
            </div>
            <div className="mt-1.5 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
              <p className="text-[9px] font-medium leading-tight whitespace-nowrap">{p.label}</p>
              <p className="text-[8px] font-mono text-warm leading-tight">{p.count} traces</p>
            </div>
          </button>
        ))}

        {/* you are here */}
        <div className="absolute left-[22%] top-[28%] -translate-x-1/2 -translate-y-1/2">
          <div className="pulse-ring relative h-4 w-4 rounded-full">
            <span className="absolute inset-1 rounded-full bg-warm shadow-warm" />
          </div>
        </div>
      </div>

      {/* Legend / spotlight */}
      <section className="mx-6 mt-5 rounded-2xl p-4 glass border border-white/5">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm">Spotlight · Wynyard</p>
        <p className="mt-2 text-[14px] leading-snug">
          92 traces. Mostly pinned between 6 and 8pm. The line wants to go home softly.
        </p>
      </section>
    </PhoneShell>
  );
}
