import { Link } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { FourGridCover } from "@/components/FourGridCover";
import type { Pin } from "@/lib/seed-data";

/**
 * Horizontal scroll carousel of location cards anchored above the nav bar.
 * Used on the map screen to browse pins, and (later) to surface filter
 * results — same component, different `pins` slice.
 *
 * Two-way binding:
 *   - swiping the carousel updates `selectedId` (so the map can highlight)
 *   - changing `selectedId` externally scrolls the carousel to that card
 *
 * The card itself is a Link to /location/$id; tapping any non-link area
 * (the chevron strip at the top) toggles the collapsed state.
 */
export function BottomCarousel({
  pins,
  selectedId,
  onSelect,
  expanded,
  onToggleExpand,
}: {
  pins: Pin[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  // Skip the next scroll-driven onSelect after we programmatically scrolled.
  // Otherwise a click-on-pin → scrollTo would fire scroll events that bounce
  // selectedId back, fighting the user's intent.
  const programmaticScroll = useRef(false);

  // Sync external selectedId → scroll position
  useEffect(() => {
    if (!selectedId) return;
    const idx = pins.findIndex((p) => p.id === selectedId);
    if (idx < 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.children[idx] as HTMLElement | undefined;
    if (!card) return;
    const target = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;
    if (Math.abs(scroller.scrollLeft - target) < 4) return;
    programmaticScroll.current = true;
    scroller.scrollTo({ left: target, behavior: "smooth" });
    // Release the flag after the smooth scroll likely finishes.
    window.setTimeout(() => (programmaticScroll.current = false), 450);
  }, [selectedId, pins]);

  // Sync scroll position → selectedId (when user swipes)
  const handleScroll = () => {
    if (programmaticScroll.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < scroller.children.length; i++) {
      const child = scroller.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    const id = pins[bestIdx]?.id;
    if (id && id !== selectedId) onSelect(id);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
      {/* The whole carousel slides between expanded and collapsed via
          translate-y. Collapsed leaves only the chevron handle visible. */}
      <div
        className={`pointer-events-auto transition-transform duration-300 ease-out ${
          expanded ? "translate-y-0" : "translate-y-[calc(100%-44px)]"
        }`}
      >
        {/* Handle strip — tap to expand/collapse */}
        <button
          onClick={onToggleExpand}
          aria-label={expanded ? "Collapse cards" : "Expand cards"}
          className="block w-full h-11 grid place-items-center"
        >
          <span className="flex flex-col items-center gap-1">
            <span className="h-1 w-10 rounded-full bg-white/70" />
            <ChevronUp
              className={`h-3 w-3 text-white/80 transition-transform ${expanded ? "rotate-180" : ""}`}
              strokeWidth={2.6}
            />
          </span>
        </button>

        {/* Card track — horizontal snap scroll */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-3 px-[11%] pb-4"
        >
          {pins.map((p) => (
            <CarouselCard key={p.id} pin={p} active={p.id === selectedId} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselCard({ pin, active }: { pin: Pin; active: boolean }) {
  const top4 = pin.songs.slice(0, 4);
  return (
    <Link
      to="/location/$id"
      params={{ id: pin.id }}
      className={`shrink-0 w-[78%] snap-center rounded-card-lg overflow-hidden bg-white/12 backdrop-blur-md border transition-all ${
        active
          ? "border-white/40 shadow-2xl"
          : "border-white/15 opacity-85"
      }`}
    >
      <div className="p-3 flex gap-3 items-center">
        <div className="shrink-0">
          <FourGridCover songs={top4} size={72} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {pin.count} traces · {pin.listening} listening
          </p>
          <p className="mt-1 text-[16px] font-extrabold tracking-tight text-white truncate">
            {pin.label}
          </p>
          <p className="mt-0.5 text-[11px] italic text-white/65 line-clamp-1">
            {pin.mood}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {pin.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
