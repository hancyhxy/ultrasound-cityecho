import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import type { Trace } from "@/lib/seed-data";

type FloatingTrace = {
  trace: Trace;
  slot: number;
  bornAt: number;
  key: string;
};

const SLOTS = [
  { top: "18%", left: "6%" },
  { top: "32%", right: "6%" },
  { top: "62%", left: "8%" },
  { top: "74%", right: "10%" },
] as const;

const LIFESPAN_MS = 4200;
const SPAWN_INTERVAL_MS = 3500;
const MAX_CONCURRENT = 2;

export function DanmakuOverlay({
  traces,
  active,
}: {
  traces: Trace[];
  active: boolean;
}) {
  const navigate = useNavigate();
  const [floating, setFloating] = useState<FloatingTrace[]>([]);

  useEffect(() => {
    if (!active || traces.length === 0) {
      setFloating([]);
      return;
    }

    let i = 0;
    let slotCursor = 0;

    const spawn = () => {
      const trace = traces[i % traces.length];
      i += 1;
      setFloating((prev) => {
        if (prev.length >= MAX_CONCURRENT) return prev;
        const usedSlots = new Set(prev.map((f) => f.slot));
        let slot = slotCursor % SLOTS.length;
        while (usedSlots.has(slot)) slot = (slot + 1) % SLOTS.length;
        slotCursor = slot + 1;
        return [
          ...prev,
          {
            trace,
            slot,
            bornAt: Date.now(),
            key: `${trace.id}-${Date.now()}`,
          },
        ];
      });
    };

    const reaper = setInterval(() => {
      const now = Date.now();
      setFloating((prev) => prev.filter((f) => now - f.bornAt < LIFESPAN_MS));
    }, 600);

    spawn();
    const spawner = setInterval(spawn, SPAWN_INTERVAL_MS);

    return () => {
      clearInterval(spawner);
      clearInterval(reaper);
    };
  }, [active, traces]);

  if (!active) return null;

  return (
    <div aria-hidden={false} className="pointer-events-none absolute inset-0 z-30">
      {floating.map((f) => {
        const slot = SLOTS[f.slot];
        const age = Date.now() - f.bornAt;
        const phase = age < 400 ? "in" : age > LIFESPAN_MS - 600 ? "out" : "hold";
        return (
          <button
            key={f.key}
            onClick={() =>
              navigate({ to: "/traces", search: { highlight: f.trace.id } })
            }
            style={slot}
            className={`pointer-events-auto absolute max-w-[58%] text-left transition-all duration-500 ease-out ${
              phase === "in"
                ? "opacity-0 translate-y-3"
                : phase === "out"
                ? "opacity-0 -translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="rounded-2xl glass-strong border border-accent/30 px-3 py-2 shadow-glow backdrop-blur-md hover:border-accent transition-colors">
              <div className="flex items-start gap-2">
                <Quote className="h-3 w-3 text-accent shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] leading-snug italic text-foreground/95 line-clamp-2">
                    {f.trace.note}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full text-[7px] font-mono grid place-items-center text-background"
                      style={{ background: f.trace.userColor }}
                    >
                      {f.trace.userInitial}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
                      {f.trace.time} · {f.trace.mood}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
