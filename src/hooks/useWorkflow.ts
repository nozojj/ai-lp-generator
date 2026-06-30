"use client";

import { useEffect, useState } from "react";

export function useWorkflow() {
  const [displayStep, setDisplayStep] = useState(0);

  useEffect(() => {
    const duration =
      displayStep === 0
        ? 2200
        : displayStep === 4
          ? 2800
          : 1500;

    const timeout = setTimeout(() => {
      setDisplayStep((prev) => (prev === 4 ? 0 : prev + 1));
    }, duration);

    return () => clearTimeout(timeout);
  }, [displayStep]);

  return displayStep;
}