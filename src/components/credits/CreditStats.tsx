import { ArrowDownCircle, Crown, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

import type { CreditHistory } from "@prisma/client";

interface Props {
  history: CreditHistory[];
  isPro: boolean;
}

export default function CreditStats({ history, isPro }: Props) {
  const now = new Date();
  const monthly = history.filter((item) => {
    const date = new Date(item.createdAt);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  });

  const purchased = monthly
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const used = monthly
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const net = purchased - used;

  const stats = [
    {
      label: "今月購入",
      value: `+${purchased}`,
      icon: Wallet,
      accent: "text-emerald-500",
    },
    {
      label: "今月使用",
      value: `-${used}`,
      icon: ArrowDownCircle,
      accent: "text-red-500",
    },
    {
      label: "増減",
      value: `${net > 0 ? "+" : ""}${net}`,
      icon: net >= 0 ? TrendingUp : TrendingDown,
      accent: net >= 0 ? "text-emerald-500" : "text-red-500",
    },
    {
      label: "プラン",
      value: isPro ? "Pro" : "Free",
      icon: Crown,
      accent: isPro ? "text-purple-500" : "text-muted-foreground",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="border-border bg-card flex items-center gap-3 rounded-xl border p-4 shadow-sm"
        >
          <div className={cn("bg-muted rounded-lg p-2", accent)}>
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
