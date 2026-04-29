import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Headphones, ArrowRight, Quote } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { Equalizer } from "@/components/Equalizer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Now — Ultrasound" },
      { name: "description", content: "Hear what people around you are listening to right now." },
    ],
  }),
  component: NowScreen,
});

const TRACES = [
  {
    song: "Lover, You Should've Come Over",
    artist: "Jeff Buckley",
    note: "first week here. didn't know anyone. this got me through.",
    listeners: 12,
  },
  {
    song: "光るなら",
    artist: "Goose house",
    note: "studying for finals. somewhere in level 5.",
    listeners: 7,
  },
  {
    song: "An Ending (Ascent)",
    artist: "Brian Eno",
    note: "rain outside. perfect for thesis writing.",
    listeners: 4,
  },
];

function NowScreen() {
  return (
    <PhoneShell>
      {/* Hero: where you are */}
      <header className="px-6 pt-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-warm">
          <MapPin className="h-3 w-3" />
          <span>UTS Library · Level 5</span>
        </div>
        <h1 className="mt-3 text-[34px] leading-[1.05] font-medium">
          <span className="text-foreground/95">This room is</span>
          <br />
          <span className="text-gradient-warm italic">listening with you.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          12 people here are inside the same three minutes of music right now.
        </p>
      </header>

      {/* Now playing card */}
      <section className="px-5 mt-7">
        <Link
          to="/player"
          className="group relative block rounded-[28px] p-5 bg-card-gradient border border-white/10 shadow-glow overflow-hidden"
        >
          {/* glow orb */}
          <div aria-hidden className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-warm/40 blur-3xl drift" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="pulse-ring absolute inset-0 rounded-full" />
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-warm to-primary shadow-warm grid place-items-center">
                <Headphones className="h-7 w-7 text-warm-foreground" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Library Soundscape</p>
              <h3 className="mt-1 font-display text-lg leading-tight truncate">Quiet, focused, late-afternoon</h3>
              <div className="mt-2 flex items-center gap-2">
                <Equalizer />
                <span className="text-xs text-muted-foreground">12 listening together</span>
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {["focus", "calm", "instrumental"].map((t) => (
                <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-foreground/70 border border-white/5">
                  {t}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-warm font-medium">
              Tune in <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* Traces left here */}
      <section className="px-6 mt-9">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[20px] font-medium">Traces left here</h2>
          <Link to="/traces" className="text-xs text-muted-foreground hover:text-warm transition-colors">all</Link>
        </div>

        <div className="space-y-3">
          {TRACES.map((t, i) => (
            <article key={i} className="rounded-2xl p-4 glass border border-white/5">
              <div className="flex items-start gap-3">
                <Quote className="h-4 w-4 text-warm shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-relaxed text-foreground/85 italic">"{t.note}"</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{t.song}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                    </div>
                    <span className="shrink-0 ml-3 text-[10px] font-mono text-muted-foreground">
                      {t.listeners} here
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tonight's drift */}
      <section className="px-6 mt-9">
        <h2 className="text-[20px] font-medium mb-4">Tonight, on your line</h2>
        <Link to="/map" className="block rounded-2xl p-4 glass border border-white/5 hover:border-warm/30 transition-colors">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">T2 · Burwood → Wynyard</p>
          <p className="mt-2 text-[15px] leading-snug">
            <span className="text-foreground/90">A stranger left a song on your line.</span>{" "}
            <span className="text-warm">It's been played 47 times this week.</span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-warm animate-pulse" />
            See the music map
          </div>
        </Link>
      </section>
    </PhoneShell>
  );
}
