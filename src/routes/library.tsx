import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { Play } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Ultrasound" },
      { name: "description", content: "Quiet catalogues built from strangers' recommendations." },
    ],
  }),
  component: LibraryScreen,
});

const PLAYLISTS = [
  { name: "UTS Library · study self", count: 24, gradient: "from-primary to-warm/60" },
  { name: "Wynyard, going home", count: 18, gradient: "from-warm to-destructive/60" },
  { name: "Single O mornings", count: 11, gradient: "from-warm/80 to-primary/70" },
  { name: "Broadway, leg day", count: 9, gradient: "from-primary to-background" },
];

function LibraryScreen() {
  return (
    <PhoneShell>
      <header className="px-6 pt-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm">Yours</p>
        <h1 className="mt-2 text-[30px] leading-[1.1] font-medium">
          The places you<br /><span className="italic text-gradient-warm">come back to.</span>
        </h1>
      </header>

      <div className="px-5 mt-6 grid grid-cols-2 gap-3">
        {PLAYLISTS.map((p, i) => (
          <button key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 text-left">
            <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <p className="text-[13px] font-medium leading-tight">{p.name}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">{p.count} songs</span>
                <span className="h-7 w-7 rounded-full bg-warm grid place-items-center shadow-warm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-3 w-3 text-warm-foreground" fill="currentColor" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <section className="mx-6 mt-7 rounded-2xl p-5 bg-card-gradient border border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm">This week</p>
        <h3 className="mt-2 font-display text-[20px] leading-snug">You contributed 4 traces.</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">3 strangers played the songs you pinned.</p>
        <div className="mt-4 flex gap-1.5 h-12 items-end">
          {[40, 22, 78, 55, 90, 30, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-warm/30 to-warm" style={{ height: `${h}%` }} />
          ))}
        </div>
      </section>
    </PhoneShell>
  );
}
