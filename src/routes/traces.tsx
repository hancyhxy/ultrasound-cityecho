import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { FEED, type Trace } from "@/lib/seed-data";

const tracesSearchSchema = z.object({
  highlight: z.string().optional(),
});

export const Route = createFileRoute("/traces")({
  validateSearch: tracesSearchSchema,
  head: () => ({
    meta: [
      { title: "Trace — Ultrasound" },
      { name: "description", content: "What strangers left behind, song by song." },
    ],
  }),
  component: TracesScreen,
});

type StoryUser = {
  id: string;
  initial: string;
  color: string;
  hasNew: boolean;
  traces: Trace[];
};

function TracesScreen() {
  const { highlight } = Route.useSearch();
  const highlightRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  const storyUsers = useMemo<StoryUser[]>(() => {
    const grouped = new Map<string, StoryUser>();
    for (const t of FEED) {
      const existing = grouped.get(t.userId);
      if (existing) {
        existing.traces.push(t);
        if (t.unread) existing.hasNew = true;
      } else {
        grouped.set(t.userId, {
          id: t.userId,
          initial: t.userInitial,
          color: t.userColor,
          hasNew: !!t.unread,
          traces: [t],
        });
      }
    }
    return Array.from(grouped.values());
  }, []);

  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const openUser = storyUsers.find((u) => u.id === openUserId) ?? null;

  return (
    <PhoneShell>
      <header className="px-6 pt-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm">Discover</p>
        <h1 className="mt-2 text-[28px] leading-[1.1] font-medium">
          Strangers, <span className="italic text-gradient-warm">song by song.</span>
        </h1>
      </header>

      {/* IG-style story bubbles */}
      <div className="mt-5 px-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1">
          {storyUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => setOpenUserId(u.id)}
              className="shrink-0 flex flex-col items-center gap-1.5 group"
              aria-label={`See traces from ${u.initial}`}
            >
              <span
                className={`relative h-16 w-16 rounded-full grid place-items-center transition-transform group-hover:scale-105 ${
                  u.hasNew ? "p-[2px] bg-gradient-to-tr from-warm via-primary to-warm" : "p-[2px] bg-white/10"
                }`}
              >
                <span
                  className="h-full w-full rounded-full grid place-items-center font-display text-[20px] text-background border-2 border-background"
                  style={{ background: u.color }}
                >
                  {u.initial}
                </span>
                {u.hasNew && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-warm border-2 border-background" />
                )}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {u.traces[0].time}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sentence-forward feed */}
      <div className="px-5 mt-4 space-y-2.5 pb-2">
        <p className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Today, in the city
        </p>
        {FEED.map((t) => (
          <article
            key={t.id}
            ref={(el) => {
              if (highlight === t.id) highlightRef.current = el;
            }}
            className={`rounded-2xl px-4 py-3 glass border transition-all ${
              highlight === t.id
                ? "border-warm shadow-warm bg-warm/5"
                : "border-white/5 hover:border-warm/20"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="shrink-0 h-7 w-7 rounded-full grid place-items-center text-[10px] font-mono text-background"
                style={{ background: t.userColor }}
              >
                {t.userInitial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-foreground/90">
                  <span className="italic">"{t.note}"</span>
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <MapPin className="h-2.5 w-2.5 text-warm" />
                  <span className="truncate">{t.place}</span>
                  <span>·</span>
                  <span className="truncate">
                    {t.song} — {t.artist}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-warm/15 text-warm border border-warm/20">
                {t.mood}
              </span>
            </div>
          </article>
        ))}
      </div>

      {openUser && (
        <UserStoryModal user={openUser} onClose={() => setOpenUserId(null)} />
      )}
    </PhoneShell>
  );
}

function UserStoryModal({ user, onClose }: { user: StoryUser; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative w-full glass-strong rounded-t-[28px] p-6 pb-24 border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />
        <div className="flex items-center gap-3">
          <span
            className="h-12 w-12 rounded-full grid place-items-center font-display text-[18px] text-background"
            style={{ background: user.color }}
          >
            {user.initial}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-[18px] leading-tight">a stranger</p>
            <p className="text-[11px] text-muted-foreground">{user.traces.length} traces · this week</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {user.traces.map((t) => (
            <div key={t.id} className="rounded-2xl p-4 bg-background/40 border border-white/5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-warm" />
                  <span>{t.place}</span>
                </div>
                <span>{t.time}</span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed italic text-foreground/95">"{t.note}"</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">{t.song}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                </div>
                <span className="shrink-0 ml-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-warm/15 text-warm border border-warm/20">
                  {t.mood}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
