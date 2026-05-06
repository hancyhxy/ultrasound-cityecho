import { createFileRoute } from "@tanstack/react-router";
import { ChevronUp, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomCarousel } from "@/components/BottomCarousel";
import { PINS } from "@/lib/seed-data";
import { getSongTheme } from "@/lib/song-themes";
import { assetPath } from "@/lib/utils";

const indexSearchSchema = z.object({
  pin: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: indexSearchSchema,
  head: () => ({
    meta: [
      { title: "Music Map — Ultrasound" },
      { name: "description", content: "A city organised by what people felt here, song by song." },
    ],
  }),
  component: MapScreen,
});

const YOU_ID = "uts";
const APP_BACKDROP = "oklch(0.14 0.03 290)";
const HERO_SURFACE = "rgba(17, 11, 28, 0.84)";
const HERO_ACCENT = "#a97bff";

function MapScreen() {
  const { pin } = Route.useSearch();
  // Default selection: URL ?pin=X wins, otherwise the user's anchor (UTS).
  const [selectedId, setSelectedId] = useState<string>(pin ?? YOU_ID);
  const [activeMoods, setActiveMoods] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [carouselExpanded, setCarouselExpanded] = useState(true);
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  useEffect(() => {
    if (pin) setSelectedId(pin);
  }, [pin]);

  const availableMoods = useMemo(() => {
    const set = new Set<string>();
    for (const p of PINS) for (const t of p.tags) set.add(t);
    return Array.from(set);
  }, []);

  const toggleMood = (m: string) =>
    setActiveMoods((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });

  const matchesFilter = (pinTags: readonly string[]) => {
    if (activeMoods.size === 0) return true;
    return pinTags.some((t) => activeMoods.has(t));
  };

  // Pins fed to the carousel — when filter is active, only matching pins
  // appear in the carousel (same component, contextual content).
  const visiblePins = useMemo(
    () => PINS.filter((p) => matchesFilter(p.tags)),
    // matchesFilter closes over activeMoods; depend on the set's identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMoods],
  );

  // If the current selection got filtered out, snap to the first visible pin.
  useEffect(() => {
    if (visiblePins.length === 0) return;
    if (!visiblePins.find((p) => p.id === selectedId)) {
      setSelectedId(visiblePins[0].id);
    }
  }, [visiblePins, selectedId]);

  return (
    <PhoneShell
      backdropStyle={{ background: APP_BACKDROP }}
      scrollable={false}
      showStatusBar={false}
    >
      {/* Map plate — img + pins + pulse-ring share this transform wrapper
          so when we scale/translate the map, pins ride along with their
          street blocks instead of decoupling. Toolbar/scrims/carousel sit
          outside, since they're chrome and shouldn't follow the map. */}
      <div
        className="absolute inset-0"
        style={{ transform: "scale(1.1) translateY(28px)", transformOrigin: "center" }}
      >
        {/* Map is the canvas — fills entire wrapper.
            objectPosition tuned so UTS sits horizontally centred. */}
        <img
          src={assetPath("/maps/sydney.png")}
          alt="Sydney"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          style={{
            // 46% horizontal centres UTS; 100% vertical aligns the map's
            // bottom edge with the container's bottom — so the visible
            // landmark zone stays anchored to the carousel/nav, and any
            // height changes (chevron collapse, etc.) crop from the top
            // instead of revealing the empty area below the image.
            objectPosition: "46% 100%",
            // grayscale → brighten → low contrast → tinted plum-grey via
            // sepia + hue-rotate so the map carries our chrome's purple cast
            filter: "grayscale(1) brightness(1.05) contrast(0.7) sepia(0.25) hue-rotate(220deg)",
          }}
        />
      </div>

      {/* Bottom scrim — anchors map to nav and gives the carousel a clean
          landing surface against the now-light map */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background/85 to-transparent pointer-events-none"
      />

      {/* Hero — restored as a rounded dark card that floats over the map,
          with a soft fade underneath so the transition into the map isn't abrupt. */}
      <div className="absolute inset-x-0 top-0 z-30">
        <div
          className="relative overflow-hidden rounded-b-[34px] border-b border-white/10 px-5 pt-2 pb-5 shadow-[0_24px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
          style={{ background: HERO_SURFACE }}
        >
          <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-mono text-white/48">
            <span>9:41</span>
            <span>100%</span>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              heroCollapsed ? "max-h-0 opacity-0 -mb-1" : "max-h-32 opacity-100 mb-4"
            }`}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: HERO_ACCENT }}
            >
              Explore by Map
            </p>
            <h1 className="mt-1.5 text-[22px] leading-[1.1] font-extrabold tracking-tight text-white">
              A city, by feeling.
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-11 rounded-pill bg-white/8 border border-white/12 flex items-center px-4 gap-2 min-w-0">
              <Search className="h-4 w-4 text-white/70 shrink-0" />
              <span className="text-[13px] text-white/70 truncate">
                Search a place, a mood, a song…
              </span>
            </div>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              aria-label="Filter by mood"
              aria-expanded={filterOpen}
              className={`relative h-11 w-11 rounded-full grid place-items-center transition-colors shrink-0 ${
                activeMoods.size > 0
                  ? "bg-white text-zinc-900"
                  : "bg-white/8 border border-white/12 text-white"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2.4} />
              {activeMoods.size > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-accent-hot text-[9px] font-bold text-white grid place-items-center">
                  {activeMoods.size}
                </span>
              )}
            </button>
            <button
              onClick={() => setHeroCollapsed((v) => !v)}
              aria-label={heroCollapsed ? "Show map title" : "Hide map title"}
              aria-expanded={!heroCollapsed}
              className="h-11 w-11 rounded-full grid place-items-center bg-white/8 border border-white/12 text-white/70 hover:text-white transition-colors shrink-0"
            >
              <ChevronUp
                className={`h-4 w-4 transition-transform duration-300 ${heroCollapsed ? "rotate-180" : ""}`}
                strokeWidth={2.4}
              />
            </button>
          </div>

          {filterOpen && (
            <div className="mt-3 rounded-[26px] border border-white/12 bg-black/25 p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Filter by mood
                </p>
                {activeMoods.size > 0 && (
                  <button
                    onClick={() => setActiveMoods(new Set())}
                    className="text-[10px] font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableMoods.map((m) => {
                  const on = activeMoods.has(m);
                  return (
                    <button
                      key={m}
                      onClick={() => toggleMood(m)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        on
                          ? "bg-white text-zinc-900"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div
          aria-hidden
          className="mx-6 -mt-2 h-10 rounded-full bg-black/28 blur-2xl pointer-events-none"
        />
      </div>

      {/* Pins — share the map's transform so they ride along with their
          street blocks. inset-0 wrapper means each pin's left/top% is
          measured against the same coordinate space as the map. */}
      <div
        className="absolute inset-0"
        style={{ transform: "scale(1.1) translateY(28px)", transformOrigin: "center" }}
      >
        {PINS.map((p) => {
          const active = p.id === selectedId;
          const matches = matchesFilter(p.tags);
          // Active pin gets a chunky cover-tile treatment (airbnb-style).
          // Non-active pins stay as small dots so the active one really pops.
          const firstSong = p.songs[0];
          const cover = firstSong ? getSongTheme(firstSong.song, firstSong.artist).cover : null;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              aria-label={`Open ${p.label}`}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-300 ${
                matches ? "opacity-100" : "opacity-25 scale-75"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: active ? 5 : 1 }}
            >
              {active ? (
                // Active = cover-tile pin (airbnb listing style)
                <div className="relative flex flex-col items-center">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-white shadow-2xl bg-zinc-800">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-white text-[18px]">
                        🎵
                      </div>
                    )}
                  </div>
                  {/* Speech-bubble pointer */}
                  <span aria-hidden className="absolute -bottom-1 h-3 w-3 rotate-45 bg-white" />
                </div>
              ) : (
                // Inactive = small dark dot + (optional) ping for hot pins.
                // Dark fill so dots stay visible on the light grayscale map.
                <div className="relative">
                  {p.hot && matches && (
                    <span className="absolute inset-0 rounded-full bg-zinc-900/40 animate-ping" />
                  )}
                  <span
                    className={`relative block rounded-full ring-2 ring-white transition-all duration-300 ${
                      p.hot
                        ? "h-3 w-3 bg-zinc-900 shadow-lg group-hover:scale-125"
                        : "h-2.5 w-2.5 bg-zinc-900/85 group-hover:bg-zinc-900 group-hover:scale-125"
                    }`}
                  />
                </div>
              )}
            </button>
          );
        })}

        {/* "you are here" pulse anchored to UTS — only visible when UTS isn't
          the active selection (otherwise the cover-pin overlaps it) */}
        {selectedId !== YOU_ID && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${PINS.find((p) => p.id === YOU_ID)!.x}%`,
              top: `${PINS.find((p) => p.id === YOU_ID)!.y}%`,
              zIndex: 1,
            }}
          >
            <div className="pulse-ring relative h-4 w-4 rounded-full">
              <span className="absolute inset-1 rounded-full bg-zinc-900 shadow-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Carousel — replaces LocationDrawer; tap card → /location/$id */}
      <BottomCarousel
        pins={visiblePins}
        selectedId={selectedId}
        onSelect={setSelectedId}
        expanded={carouselExpanded}
        onToggleExpand={() => setCarouselExpanded((v) => !v)}
      />
    </PhoneShell>
  );
}
