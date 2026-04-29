import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/traces")({
  head: () => ({
    meta: [
      { title: "Traces — Ultrasound" },
      { name: "description", content: "What strangers left behind, song by song." },
    ],
  }),
  component: TracesScreen,
});

const FEED = [
  { song: "Motion Picture Soundtrack", artist: "Radiohead", place: "T9 · Strathfield", note: "tunnel just before home. cried a little. it was fine.", mood: "soft", time: "2h" },
  { song: "夜に駆ける", artist: "YOASOBI", place: "UTS Library · L7", note: "first all-nighter. somehow felt like everyone here was awake with me.", mood: "alive", time: "5h" },
  { song: "Sunday Morning", artist: "The Velvet Underground", place: "Single O, Surry Hills", note: "the barista remembered my order. small, but it counted.", mood: "hopeful", time: "1d" },
  { song: "Cha Cha", artist: "Freddie Dredd", place: "Fitness First Broadway", note: "leg day. nobody talks here either but at least we're suffering together.", mood: "alive", time: "1d" },
  { song: "Lover, You Should've Come Over", artist: "Jeff Buckley", place: "Wynyard platform 3", note: "missed my train on purpose to finish it.", mood: "lonely", time: "2d" },
];

const moodColor: Record<string, string> = {
  soft: "from-primary/40 to-primary/10",
  alive: "from-warm to-warm/30",
  hopeful: "from-warm/60 to-primary/30",
  lonely: "from-primary/60 to-background",
};

function TracesScreen() {
  return (
    <PhoneShell>
      <header className="px-6 pt-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm">Feed</p>
        <h1 className="mt-2 text-[30px] leading-[1.1] font-medium">
          What this city <span className="italic text-gradient-warm">felt today.</span>
        </h1>
      </header>

      <div className="px-5 mt-6 space-y-4">
        {FEED.map((t, i) => (
          <article key={i} className="relative rounded-3xl overflow-hidden border border-white/10">
            <div className={`absolute inset-0 bg-gradient-to-br ${moodColor[t.mood] ?? "from-primary/30 to-background"} opacity-40`} />
            <div className="relative p-5 bg-background/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-warm" />
                  <span>{t.place}</span>
                </div>
                <span>{t.time}</span>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed italic text-foreground/95">
                "{t.note}"
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">{t.song}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                </div>
                <span className="shrink-0 ml-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-warm/15 text-warm border border-warm/20">
                  {t.mood}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PhoneShell>
  );
}
