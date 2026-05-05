export type CollageView = "track" | "story";

export function FlipToggle({
  view,
  onChange,
}: {
  view: CollageView;
  onChange: (next: CollageView) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Switch view"
      className="relative inline-flex items-center h-8 rounded-full glass border border-white/10 p-0.5"
    >
      {/* sliding pill */}
      <span
        aria-hidden
        className={`absolute top-0.5 bottom-0.5 w-[50%] rounded-full bg-accent shadow-accent transition-transform duration-300 ease-out ${
          view === "track" ? "translate-x-0" : "translate-x-full"
        }`}
      />
      {(["track", "story"] as const).map((v) => (
        <button
          key={v}
          role="tab"
          aria-selected={view === v}
          onClick={() => onChange(v)}
          className={`relative z-10 px-3 h-7 rounded-full text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
            view === v ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
