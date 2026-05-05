import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import {
  currentSeason,
  getMyFirstTrace,
  getMyHomePlace,
  getMyTracesBySeason,
  getStrangerTimeOverlap,
  type MyTrace,
  type Season,
} from "@/lib/seed-data";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Me — Ultrasound" },
      { name: "description", content: "A small diary of how this city has been listening with you." },
    ],
  }),
  component: MeScreen,
});

const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

const SEASON_GRADIENT: Record<Season, string> = {
  spring: "from-accent/30 via-primary/15 to-transparent",
  summer: "from-accent/40 via-accent/10 to-transparent",
  autumn: "from-destructive/20 via-accent/15 to-transparent",
  winter: "from-primary/30 via-primary/10 to-transparent",
};

const SEASON_COPY: Record<Season, { lead: string; tail: string }> = {
  spring: { lead: "This spring,", tail: "the city was warming back up to you." },
  summer: { lead: "This summer,", tail: "you stayed up later than the sun." },
  autumn: { lead: "This autumn,", tail: "you walked home slower." },
  winter: { lead: "This winter,", tail: "you found small rooms that held you." },
};

function MeScreen() {
  const first = useMemo(() => getMyFirstTrace(), []);
  const overlap = useMemo(() => getStrangerTimeOverlap(), []);
  const home = useMemo(() => getMyHomePlace(), []);
  const bySeason = useMemo(() => getMyTracesBySeason(), []);
  const initialSeason = useMemo(() => {
    const cur = currentSeason();
    return bySeason[cur].length > 0
      ? cur
      : (SEASONS.find((s) => bySeason[s].length > 0) ?? "autumn");
  }, [bySeason]);
  const [activeSeason, setActiveSeason] = useState<Season>(initialSeason);

  return (
    <PhoneShell>
      {/* Ambient orbs — layer 0, behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="drift absolute top-[12%] -left-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="drift absolute top-[42%] -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" style={{ animationDelay: "5s" }} />
        <div className="drift absolute bottom-[8%] left-1/4 h-56 w-56 rounded-full bg-accent/8 blur-3xl" style={{ animationDelay: "9s" }} />
      </div>

      {/* Top bar */}
      <header className="relative px-6 pt-4 flex items-center justify-between">
        <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
          Ultrasound · your year
        </p>
        <button
          aria-label="Settings"
          className="h-9 w-9 grid place-items-center rounded-full glass"
        >
          <Settings className="h-4 w-4" />
        </button>
      </header>

      {/* Section 0 · Identity (minimal) */}
      <section className="relative mt-6 px-6 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-portrait bg-gradient-to-br from-accent-hot via-primary to-primary-bright shadow-neon grid place-items-center ring-1 ring-white/10">
          <span className="font-extrabold text-[32px] text-white">L</span>
        </div>
        <h1 className="mt-6 text-[30px] leading-[0.95] font-extrabold tracking-[-0.02em] uppercase">Lina</h1>
        <p className="mt-3 italic text-[14px] leading-relaxed text-foreground/70 max-w-[14rem]">
          in this city for seven months,<br />
          listening softly.
        </p>
      </section>

      {/* Section 1 · First trace */}
      {first && (
        <section className="relative mt-20 px-8">
          <ChapterMark numeral="I." label="First heard" />
          <Link
            to="/playing"
            search={{ song: first.song, artist: first.artist, loc: first.locationId }}
            aria-label={`Play ${first.song} by ${first.artist}`}
            className="mt-6 block group"
          >
            <p className="font-display text-[22px] leading-[1.25] italic text-foreground/95 group-hover:text-accent transition-colors">
              "{first.song}"
            </p>
            <p className="mt-1 font-display text-[14px] text-muted-foreground italic">
              — {first.artist}
            </p>
            <p className="mt-6 font-display italic text-[15px] leading-relaxed text-foreground/85">
              "{first.note}"
            </p>
            <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              {first.place} · {first.when}
            </p>
          </Link>
        </section>
      )}

      {/* Section 2 · One night you were not alone — the emotional peak */}
      {overlap && (
        <section className="relative mt-24 px-8">
          <ChapterMark numeral="II." label="One night you were not alone" />
          <Link
            to="/playing"
            search={{ song: overlap.mine.song, artist: overlap.mine.artist, loc: overlap.mine.locationId }}
            aria-label={`Play ${overlap.mine.song} together`}
            className="mt-6 block group"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              {overlap.mine.when}, you wrote:
            </p>
            <p className="mt-3 font-display italic text-[18px] leading-relaxed text-foreground/95 group-hover:text-accent transition-colors">
              "{overlap.mine.note}"
            </p>

            {/* Sync pulse — the moment of overlap */}
            <div className="my-10 flex items-center justify-center">
              <span className="pulse-ring relative h-3 w-3 rounded-full">
                <span className="absolute inset-0 rounded-full bg-accent" />
              </span>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              about ~{overlap.minutesApart} minutes later, someone else wrote
              <br />about the same song:
            </p>
            <p className="mt-3 font-display italic text-[16px] leading-relaxed text-foreground/85">
              "{overlap.theirs.note}"
            </p>
            <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              {overlap.theirs.userInitial}-stranger · {overlap.theirs.place}
            </p>
          </Link>
        </section>
      )}

      {/* Section 3 · One place knows your songs */}
      {home && (
        <section className="relative mt-24 px-8">
          <ChapterMark numeral="III." label="One place knows your songs" />
          <Link
            to="/"
            search={{ pin: home.pin.id }}
            aria-label={`Open map at ${home.pin.label}`}
            className="mt-6 block group"
          >
            <p className="font-display text-[22px] leading-[1.25] text-foreground/95 group-hover:text-accent transition-colors">
              {home.pin.label} heard you{" "}
              <span className="italic text-gradient-neon">{numberToWord(home.tracesCount)}</span> times.
            </p>
            <p className="mt-5 font-display italic text-[15px] leading-relaxed text-foreground/75 max-w-[18rem]">
              {home.pin.mood.toLowerCase().replace(/\.$/, "")}.
            </p>
          </Link>
        </section>
      )}

      {/* Section 4 · Seasons */}
      <section className="relative mt-24 px-8">
        <ChapterMark numeral="IV." label="Seasons" />

        {/* Season tabs */}
        <div role="tablist" aria-label="Seasons" className="mt-6 flex items-center justify-center gap-1.5">
          {SEASONS.map((s) => {
            const has = bySeason[s].length > 0;
            const active = s === activeSeason;
            return (
              <button
                key={s}
                role="tab"
                aria-selected={active}
                disabled={!has}
                onClick={() => setActiveSeason(s)}
                className={`text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full transition-all ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : has
                    ? "text-foreground/70 hover:text-accent"
                    : "text-muted-foreground/40"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Season vignette */}
        <SeasonVignette season={activeSeason} bySeason={bySeason} />
      </section>

      {/* Section 5 · Footer */}
      <section className="relative mt-24 px-8 pb-12 text-center">
        <div className="mx-auto h-px w-16 bg-white/10" />
        <p className="mt-8 italic font-bold text-[18px] leading-[1.25] text-foreground/90 max-w-[16rem] mx-auto">
          <span className="uppercase tracking-[-0.01em] block text-gradient-neon">Somewhere<br />in the city,</span>
          <span className="block mt-3 font-medium text-foreground/75 text-[14px] leading-relaxed">
            someone is reading<br />
            a song you left behind.
          </span>
        </p>
        <div className="mt-8 mx-auto h-px w-16 bg-white/10" />
        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/70 leading-loose">
          Ultrasound<br />
          listening together<br />
          quietly
        </p>
      </section>
    </PhoneShell>
  );
}

function ChapterMark({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span aria-hidden className="font-extrabold italic text-[22px] text-gradient-neon">
        {numeral}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function SeasonVignette({
  season,
  bySeason,
}: {
  season: Season;
  bySeason: Record<Season, ReturnType<typeof getMyTracesBySeason>[Season]>;
}) {
  const traces = bySeason[season];
  const t = traces[0];
  const copy = SEASON_COPY[season];

  return (
    <div className="relative mt-7 rounded-2xl overflow-hidden">
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${SEASON_GRADIENT[season]} pointer-events-none`}
      />
      <div className="relative px-2 py-2">
        {t ? (
          <>
            <p className="font-display text-[18px] leading-[1.3] text-foreground/95">
              <span className="italic text-accent">{copy.lead}</span>
              <br />
              {seasonNarrative(t, traces.length)}
            </p>
            <p className="mt-5 font-display italic text-[14px] leading-relaxed text-foreground/80 max-w-[18rem]">
              "{t.note}"
            </p>
            <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              {t.place} · {t.when}
            </p>
            <p className="mt-6 font-display italic text-[13px] text-foreground/55 max-w-[16rem]">
              {copy.tail}
            </p>
          </>
        ) : (
          <p className="font-display italic text-[14px] text-muted-foreground">
            {copy.lead.toLowerCase()} the city was quiet.
          </p>
        )}
      </div>
    </div>
  );
}

/** Build the narrative second line of the seasonal vignette. */
function seasonNarrative(t: MyTrace, count: number): string {
  const placeShort = t.place.split("·")[0].trim();
  if (count > 1) {
    return `you returned to ${placeShort} ${numberToWord(count)} times,`;
  }
  return `you went once to ${placeShort},`;
}

/** Tiny number → word for narrative use. Falls back to digits beyond ten. */
function numberToWord(n: number): string {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return words[n] ?? String(n);
}

