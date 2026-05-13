import { useEffect, useState } from "react";

/** True when running as an installed PWA (iOS "Add to Home Screen" or
 *  desktop/Android standalone). SSR-safe: returns false on first render,
 *  flips on hydration if the launch context is standalone. */
export function useStandaloneMode(): boolean {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(display-mode: standalone)");
    const iosStandalone =
      typeof navigator !== "undefined" &&
      // iOS Safari only — not in the typed Navigator interface
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const sync = () => setStandalone(mql.matches || iosStandalone);
    sync();

    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return standalone;
}
