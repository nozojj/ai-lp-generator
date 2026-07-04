"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useCredits() {
  const { isSignedIn } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setCredits(null);
      return;
    }

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
  }, [isSignedIn]);

  return { credits };
}
