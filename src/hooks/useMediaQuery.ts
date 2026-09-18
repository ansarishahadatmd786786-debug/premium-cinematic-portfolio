import { useEffect, useState } from "react";

export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tablet & below — simplified interactions */
export const useIsMobile = () => useMediaQuery("(max-width: 900px)");

/** Accessibility: respect reduced motion */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** Devices with a real mouse/trackpad — enables custom cursor & hover art */
export const useFinePointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");
