"use client";

import { useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const data = await response.json();

        setCredits(data.credits);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCredits();
  }, []);

  return { credits };
}
