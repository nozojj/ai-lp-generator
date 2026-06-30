"use client";

import { useState } from "react";
import GenerationCard from "./GenerationCard";
import type { Generation } from "@prisma/client";

type Props = {
  generations: Generation[];
};

export default function DashboardContent({ generations }: Props) {
  const [search, setSearch] = useState("");

  const filtered = generations.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.business.toLowerCase().includes(keyword) ||
      item.hero.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="LPを検索..."
        className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
      />

      <div className="space-y-6">
        {filtered.map((item) => (
          <GenerationCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
