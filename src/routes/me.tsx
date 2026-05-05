import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { Settings, MapPin, Music, Heart } from "lucide-react";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Me — Ultrasound" },
      { name: "description", content: "Your year of quiet inhabiting." },
    ],
  }),
  component: MeScreen,
});

function MeScreen() {
  return (
    <PhoneShell>
      <div className="px-6 pt-4 flex justify-between items-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm">Your 2026 in songs</p>
        <button className="h-9 w-9 grid place-items-center rounded-full glass" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="px-6 mt-2 flex flex-col items-center text-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-warm to-primary shadow-glow grid place-items-center">
            <span className="font-display text-3xl text-warm-foreground">L</span>
          </div>
          <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-warm border-2 border-background grid place-items-center">
            <span className="text-[10px] font-mono text-warm-foreground">4</span>
          </span>
        </div>
        <h1 className="mt-4 font-display text-[24px]">Lina</h1>
        <p className="mt-1 text-xs text-muted-foreground">Sydney · 7 months · listening with 412 strangers</p>
      </div>

      <div className="px-5 mt-7 grid grid-cols-3 gap-2.5">
        {[
          { icon: MapPin, n: "23", l: "places" },
          { icon: Music, n: "186", l: "songs saved" },
          { icon: Heart, n: "47", l: "traces left" },
        ].map(({ icon: Icon, n, l }, i) => (
          <div key={i} className="rounded-2xl p-3.5 glass border border-white/5 text-center">
            <Icon className="h-4 w-4 mx-auto text-warm" />
            <p className="mt-2 font-display text-xl">{n}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <section className="mx-6 mt-6 rounded-2xl overflow-hidden border border-white/10">
        <div className="relative h-32 bg-gradient-to-br from-primary via-warm/50 to-background">
          <div aria-hidden className="absolute -top-10 -right-10 h-40 w-40 bg-warm/40 rounded-full blur-3xl drift" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/80">Your distributed belonging</p>
            <p className="font-display text-[18px] mt-1">"This city is starting to know me back."</p>
          </div>
        </div>
        <div className="p-4 bg-background/60">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            You return to 5 places weekly. Each one knows your songs.
          </p>
        </div>
      </section>

      <section className="mx-6 mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm mb-3">Strangers becoming familiar</p>
        <div className="flex -space-x-2">
          {["#F5C26B", "#B68CFF", "#FF8A9B", "#7AC9C6", "#E89F71"].map((c, i) => (
            <div
              key={i}
              className="h-10 w-10 rounded-full border-2 border-background grid place-items-center text-[11px] font-mono text-background"
              style={{ background: c }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="h-10 w-10 rounded-full border-2 border-background bg-white/10 grid place-items-center text-[10px] font-mono text-foreground/80">
            +12
          </div>
        </div>
      </section>

      <section className="mx-6 mt-6 rounded-2xl p-5 bg-card-gradient border border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm">Year so far</p>
        <h3 className="mt-2 font-display text-[18px] leading-snug">
          Your most-listened: <span className="italic">An Ending (Ascent)</span>
        </h3>
        <p className="mt-1 text-[12px] text-muted-foreground">Brian Eno · 38 plays · mostly between 11pm and 2am</p>
        <div className="mt-4 flex gap-1 h-10 items-end">
          {[28, 35, 18, 52, 41, 67, 30, 48, 22, 60, 38, 55].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-warm/20 to-warm/80" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="mt-2 text-[10px] font-mono text-muted-foreground text-center">jan — apr</p>
      </section>
    </PhoneShell>
  );
}
