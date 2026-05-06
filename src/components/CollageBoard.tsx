import type { ReactNode } from "react";
import type { CollageView } from "@/components/FlipToggle";

export function CollageBoard({
  view,
  track,
  story,
}: {
  view: CollageView;
  track: ReactNode;
  story: ReactNode;
}) {
  const isStory = view === "story";

  return (
    <div className="perspective-1800 relative w-full" style={{ minHeight: "560px" }}>
      <div
        className={`preserve-3d relative w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isStory ? "rotate-y-180" : ""
        }`}
        style={{
          minHeight: "560px",
          // Animated shadow simulating "the board lifts as it flips"
          boxShadow: isStory
            ? "0 30px 60px -20px oklch(0.1 0.05 280 / 0.45)"
            : "0 14px 30px -16px oklch(0.1 0.05 280 / 0.35)",
          transition:
            "transform 700ms cubic-bezier(0.4,0,0.2,1), box-shadow 700ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* TRACK face */}
        <div className="backface-hidden absolute inset-0 w-full">
          {track}
        </div>

        {/* STORY face — pre-rotated so flip lands face-up.
            overflow-y-auto so chunky-card stacks scroll within the 560 board. */}
        <div className="backface-hidden absolute inset-0 w-full rotate-y-180 overflow-y-auto scrollbar-none">
          {story}
        </div>
      </div>
    </div>
  );
}
