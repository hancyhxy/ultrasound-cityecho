import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Layers, Play, Users, X } from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { Equalizer } from "@/components/Equalizer";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Music Map — Ultrasound" },
      { name: "description", content: "A city organised by what people felt here, song by song." },
    ],
  }),
  component: MapScreen,
});

type Pin = {
  id: string;
  x: number;
  y: number;
  label: string;
  count: number;
  hot?: boolean;
  mood: string;
  listening: number;
  tags: string[];
  preview: { song: string; artist: string }[];
};

const PINS: Pin[] = [
  {
    id: "uts",
    x: 22, y: 28,
    label: "UTS Library",
    count: 124, hot: true,
    mood: "Quiet, focused, late-afternoon",
    listening: 12,
    tags: ["focus", "calm", "instrumental"],
    preview: [
      { song: "An Ending (Ascent)", artist: "Brian Eno" },
      { song: "光るなら", artist: "Goose house" },
      { song: "Avril 14th", artist: "Aphex Twin" },
    ],
  },
  {
    id: "central",
    x: 62, y: 18,
    label: "Central Stn",
    count: 78,
    mood: "Rushed mornings, slow evenings",
    listening: 23,
    tags: ["commute", "drive", "indie"],
    preview: [
      { song: "Motion Picture Soundtrack", artist: "Radiohead" },
      { song: "Re:Stacks", artist: "Bon Iver" },
    ],
  },
  {
    id: "strand",
    x: 78, y: 44,
    label: "Strand Arcade",
    count: 31,
    mood: "Wandering, golden hour",
    listening: 4,
    tags: ["soft", "vintage", "wander"],
    preview: [
      { song: "Sunday Morning", artist: "The Velvet Underground" },
      { song: "La Vie en Rose", artist: "Édith Piaf" },
    ],
  },
  {
    id: "glebe",
    x: 38, y: 56,
    label: "Glebe café",
    count: 56,
    mood: "First-coffee thoughts",
    listening: 8,
    tags: ["acoustic", "warm", "morning"],
    preview: [
      { song: "Skinny Love", artist: "Bon Iver" },
      { song: "Holocene", artist: "Bon Iver" },
    ],
  },
  {
    id: "wynyard",
    x: 70, y: 70,
    label: "Wynyard",
    count: 92, hot: true,
    mood: "The line wants to go home softly",
    listening: 18,
    tags: ["home", "soft", "tunnel"],
    preview: [
      { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
      { song: "夜に駆ける", artist: "YOASOBI" },
      { song: "Nikes", artist: "Frank Ocean" },
    ],
  },
  {
    id: "broadway",
    x: 28, y: 78,
    label: "Broadway gym",
    count: 19,
    mood: "Suffering, together",
    listening: 6,
    tags: ["energy", "loud", "alive"],
    preview: [
      { song: "Cha Cha", artist: "Freddie Dredd" },
      { song: "HUMBLE.", artist: "Kendrick Lamar" },
    ],
  },
];

const YOU_ID = "uts";

function MapScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PINS.find((p) => p.id === selectedId) ?? null;

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
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="50" cy="62"
              rx={20 + i * 7} ry={14 + i * 5}
              fill="none"
              stroke="oklch(0.85 0.08 70 / 0.08)"
              strokeWidth="0.2"
            />
          ))}
          <path
            d="M 8 22 Q 30 40, 55 50 T 92 92"
            stroke="oklch(0.82 0.13 65 / 0.7)"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
            fill="none"
          />
        </svg>

        {/* Pins */}
        {PINS.map((p) => {
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              aria-label={`Preview ${p.label} soundscape`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center focus:outline-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: active ? 30 : 10 }}
            >
              <div className="relative">
                {p.hot && !active && (
                  <span className="absolute inset-0 rounded-full bg-warm/40 animate-ping" />
                )}
                <span
                  className={`relative block rounded-full transition-all duration-300 ${
                    active
                      ? "h-4 w-4 bg-warm ring-4 ring-warm/30 shadow-warm"
                      : p.hot
                      ? "h-3 w-3 bg-warm shadow-warm group-hover:scale-125"
                      : "h-2.5 w-2.5 bg-primary/80 group-hover:bg-warm group-hover:scale-125"
                  }`}
                />
              </div>
              <div
                className={`mt-1.5 px-2 py-0.5 rounded-md backdrop-blur-sm border transition-all ${
                  active
                    ? "bg-warm text-warm-foreground border-warm scale-105"
                    : "bg-background/80 border-white/10 opacity-90 group-hover:opacity-100"
                }`}
              >
                <p className="text-[9px] font-medium leading-tight whitespace-nowrap">{p.label}</p>
                <p
                  className={`text-[8px] font-mono leading-tight ${
                    active ? "text-warm-foreground/80" : "text-warm"
                  }`}
                >
                  {p.count} traces
                </p>
              </div>
            </button>
          );
        })}

        {/* you are here */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${PINS.find((p) => p.id === YOU_ID)!.x}%`,
            top: `${PINS.find((p) => p.id === YOU_ID)!.y}%`,
          }}
        >
          <div className="pulse-ring relative h-4 w-4 rounded-full">
            <span className="absolute inset-1 rounded-full bg-warm shadow-warm" />
          </div>
        </div>
      </div>

      {/* Default spotlight when nothing selected */}
      {!selected && (
        <section className="mx-6 mt-5 rounded-2xl p-4 glass border border-white/5">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm">Tap a pin</p>
          <p className="mt-2 text-[14px] leading-snug text-muted-foreground">
            Each place holds its own quiet listening. Tap to hear what it sounds like there, right now.
          </p>
        </section>
      )}

      {/* Preview sheet */}
      {selected && <PreviewSheet pin={selected} onClose={() => setSelectedId(null)} />}
    </PhoneShell>
  );
}

function PreviewSheet({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-24">
      <div className="relative rounded-3xl overflow-hidden glass-strong border border-warm/20 shadow-glow animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* glow */}
        <div aria-hidden className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-warm/40 blur-3xl" />

        <div className="relative p-5">
          {/* header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm">
                {pin.count} traces · here
              </p>
              <h3 className="mt-1 font-display text-[22px] leading-tight">{pin.label}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground italic">{pin.mood}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="h-8 w-8 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* listeners + tags */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <Equalizer />
              <Users className="h-3.5 w-3.5 text-warm" />
              <span>{pin.listening} listening together</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {pin.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-foreground/70 border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>

          {/* preview tracks */}
          <ul className="mt-4 space-y-1.5">
            {pin.preview.slice(0, 3).map((t, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-background/40 border border-white/5"
              >
                <span className="text-[10px] font-mono text-muted-foreground w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate">{t.song}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to="/player"
            className="mt-5 w-full h-12 rounded-2xl bg-warm text-warm-foreground font-medium shadow-warm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Tune in to {pin.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
