"use client";

import { useRef } from "react";

export function useMouseGlow() {
  const glowRef1 = useRef<HTMLDivElement>(null);
  const glowRef2 = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (glowRef1.current) {
      glowRef1.current.style.left = `${e.clientX - 192}px`;
      glowRef1.current.style.top = `${e.clientY - 192}px`;
    }

    if (glowRef2.current) {
      glowRef2.current.style.left = `${e.clientX - 300}px`;
      glowRef2.current.style.top = `${e.clientY - 300}px`;
    }
  };

  return { glowRef1, glowRef2, handleMouseMove };
}
