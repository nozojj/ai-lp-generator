"use client";

import { useState } from "react";
import GenerationTrendChart, { type TrendPoint } from "./GenerationTrendChart";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

const PERIOD_LABELS: Record<Period, string> = {
  daily: "日別",
  weekly: "週別",
  monthly: "月別",
};

export default function UsageTrendPanel({
  daily,
  weekly,
  monthly,
}: {
  daily: TrendPoint[];
  weekly: TrendPoint[];
  monthly: TrendPoint[];
}) {
  const [period, setPeriod] = useState<Period>("daily");

  const data =
    period === "daily" ? daily : period === "weekly" ? weekly : monthly;

  return (
    <div className="bg-card border-border h-full rounded-xl border p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">生成数の推移</h2>

        <div className="border-border flex gap-1 rounded-lg border p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                period === key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {PERIOD_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <GenerationTrendChart data={data} />
    </div>
  );
}
