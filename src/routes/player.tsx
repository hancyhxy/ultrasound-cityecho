import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Plus, Pause, SkipBack, SkipForward, MessageCircle } from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Now playing — Ultrasound" },
      { name: "description", content: "You are not alone in this track." },
    ],
  }),
  component: PlayerScreen,
});

function PlayerScreen() {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <PhoneShell>
      <div className="px-6 pt-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="h-9 w-9 grid place-items-center rounded-full glass">
            <ChevronDown className="h-4 w-4" />
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Listening at</p>
            <p className="text-xs text-warm font-medium">UTS Library · Level 5</p>
          </div>
          <div className="h-9 w-9" />
        </div>

        {/* Album art — abstract gradient */}
        <div className="mt-8 relative aspect-square rounded-[32px] overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-warm/60 to-background" />
          <div aria-hidden className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-warm/50 blur-3xl drift" />
          <div aria-hidden className="absolute -bottom-12 -right-12 h-60 w-60 rounded-full bg-primary/60 blur-3xl drift" style={{ animationDelay: "4s" }} />

          {/* listeners-here badge */}
          <div className="absolute top-4 left-4 glass-strong rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-warm animate-ping opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warm" />
            </span>
            <span className="text-[11px] font-mono">12 here, now</span>
          </div>
        </div>

        {/* Track meta */}
        <div className="mt-7 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[26px] leading-[1.1] font-medium truncate">An Ending (Ascent)</h1>
            <p className="mt-1 text-sm text-muted-foreground">Brian Eno</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="h-10 w-10 grid place-items-center rounded-full glass hover:bg-warm/20 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="h-10 w-10 grid place-items-center rounded-full glass hover:bg-warm/20 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[42%] bg-gradient-to-r from-warm to-primary rounded-full" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>1:48</span>
            <span>4:12</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-center gap-7">
          <button className="text-foreground/80 hover:text-warm transition-colors">
            <SkipBack className="h-6 w-6" fill="currentColor" />
          </button>
          <button className="h-16 w-16 rounded-full bg-warm shadow-warm grid place-items-center hover:scale-105 transition-transform">
            <Pause className="h-7 w-7 text-warm-foreground" fill="currentColor" />
          </button>
          <button className="text-foreground/80 hover:text-warm transition-colors">
            <SkipForward className="h-6 w-6" fill="currentColor" />
          </button>
        </div>

        {/* The trace from a stranger */}
        <section className="mt-8 rounded-2xl p-4 bg-card-gradient border border-warm/20">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-warm mb-2">Someone was here before</p>
          <p className="text-[14px] leading-relaxed text-foreground/90 italic">
            "Played this on my third night in Sydney. Fell asleep at this desk. Woke up still feeling held."
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">— a stranger · 6 weeks ago</p>
        </section>

        {/* Leave a trace CTA */}
        <button
          onClick={() => setShowTrace(true)}
          className="mt-5 w-full rounded-2xl p-4 glass border border-white/5 hover:border-warm/40 transition-colors text-left flex items-center gap-3"
        >
          <MessageCircle className="h-5 w-5 text-warm" />
          <div className="flex-1">
            <p className="text-[14px] font-medium">Leave a trace</p>
            <p className="text-[12px] text-muted-foreground">One sentence. No name. Stays here.</p>
          </div>
        </button>
      </div>

      {/* Modal */}
      {showTrace && <TraceModal onClose={() => setShowTrace(false)} />}
    </PhoneShell>
  );
}

function TraceModal({ onClose }: { onClose: () => void }) {
  const moods = ["calm", "lonely", "hopeful", "alive", "soft", "homesick"];
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");

  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[32px] p-6 pb-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-5" />
        <h3 className="font-display text-[22px] leading-tight">
          Leave one honest thing.
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">A stranger in this seat tomorrow will read it.</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did this song hold for you, here?"
          maxLength={140}
          className="mt-5 w-full h-24 rounded-2xl bg-background/50 border border-white/10 p-4 text-[14px] resize-none focus:outline-none focus:border-warm/40 placeholder:text-muted-foreground/60"
        />
        <div className="mt-1 text-[10px] font-mono text-muted-foreground text-right">{text.length}/140</div>

        <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">Mood</p>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelected(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selected === m
                  ? "bg-warm text-warm-foreground"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full h-12 rounded-2xl bg-warm text-warm-foreground font-medium hover:opacity-90 transition-opacity shadow-warm"
        >
          Pin to this place
        </button>
      </div>
    </div>
  );
}
