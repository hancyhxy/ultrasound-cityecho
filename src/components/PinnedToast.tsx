import { useEffect } from "react";
import type { UserTrace } from "@/lib/storage";

export function PinnedToast({
  trace,
  onDismiss,
}: {
  trace: UserTrace | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!trace) return;
    const t = setTimeout(onDismiss, 1800);
    return () => clearTimeout(t);
  }, [trace, onDismiss]);

  if (!trace) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] glass-strong rounded-full px-4 py-2 border border-warm/30 shadow-warm animate-in fade-in slide-in-from-top duration-300"
    >
      <p className="text-[12px] font-display italic text-foreground/95 whitespace-nowrap">
        pinned at {trace.place} · just now
      </p>
    </div>
  );
}
