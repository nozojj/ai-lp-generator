"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TrendPoint = {
  date: string;
  label: string;
  count: number;
};

type TooltipPayload = {
  payload: TrendPoint;
}[];

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload;
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2 shadow-lg">
      <p className="text-muted-foreground mb-1 text-xs">{point.label}</p>

      <div className="flex items-center gap-2">
        <span
          className="h-0.5 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: "var(--chart-trend)" }}
        />

        <span className="text-foreground text-sm font-semibold">
          {point.count}件
        </span>
      </div>
    </div>
  );
}

export default function GenerationTrendChart({
  data,
}: {
  data: TrendPoint[];
}) {
  const tickInterval = Math.max(0, Math.ceil(data.length / 7) - 1);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--chart-trend)"
                stopOpacity={0.18}
              />
              <stop
                offset="100%"
                stopColor="var(--chart-trend)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="0"
          />

          <XAxis
            dataKey="label"
            interval={tickInterval}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            width={28}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />

          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--chart-trend)"
            strokeWidth={2}
            fill="url(#trendFill)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--chart-trend)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
