"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";

export default function CreditUsageCard({
  consumed,
  remaining,
  isPro,
}: {
  consumed: number;
  remaining: number;
  isPro: boolean;
}) {
  const total = consumed + remaining;
  const rate = isPro ? 100 : total > 0 ? Math.round((consumed / total) * 100) : 0;

  const data = [{ value: rate, fill: "var(--chart-trend)" }];

  return (
    <div className="bg-card border-border flex h-full flex-col items-center justify-center rounded-xl border p-6">
      <p className="text-muted-foreground mb-2 text-sm">今月のAI使用率</p>

      <div className="relative h-36 w-36">
        <RadialBarChart
          width={144}
          height={144}
          innerRadius="72%"
          outerRadius="100%"
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

          <RadialBar
            dataKey="value"
            cornerRadius={999}
            background={{ fill: "var(--border)" }}
          />
        </RadialBarChart>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{isPro ? "∞" : `${rate}%`}</span>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 text-center text-xs">
        {isPro
          ? "Proプランは使い放題です"
          : total > 0
            ? `${consumed} / ${total} クレジット消費`
            : "今月の利用はまだありません"}
      </p>
    </div>
  );
}
