"use client";

import { useEffect, useState } from "react";

/**
 * Detects touch/coarse-pointer devices (phones, tablets) so callers can skip
 * heavy effects (e.g. WebGL scenes) that are prone to crashing iOS Safari
 * when combined with backdrop-filter or high DPI framebuffers.
 */
export function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(pointer: coarse), (max-width: 768px)",
    );

    setIsCoarse(query.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsCoarse(e.matches);

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isCoarse;
}
