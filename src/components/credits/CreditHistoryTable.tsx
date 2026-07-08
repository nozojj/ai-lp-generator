import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Crown,
  Gift,
  RotateCcw,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { CreditHistory } from "@prisma/client";

interface Props {
  history: CreditHistory[];
  currentBalance: number;
}

interface Category {
  icon: LucideIcon;
  color: string;
}

function getCategory(item: CreditHistory): Category {
  const { reason, amount } = item;

  if (reason.includes("キャンセル")) {
    return { icon: AlertTriangle, color: "text-orange-500" };
  }

  if (reason.includes("返却") || reason.includes("返金")) {
    return { icon: RotateCcw, color: "text-blue-500" };
  }

  if (reason.includes("ボーナス")) {
    return { icon: Gift, color: "text-pink-500" };
  }

  if (reason.includes("購入")) {
    return { icon: Wallet, color: "text-emerald-500" };
  }

  if (reason.includes("加入")) {
    return { icon: Crown, color: "text-purple-500" };
  }

  if (amount === 0) {
    return { icon: Crown, color: "text-yellow-500" };
  }

  if (amount < 0) {
    return { icon: ArrowDownCircle, color: "text-red-500" };
  }

  return { icon: ArrowUpCircle, color: "text-green-500" };
}

interface Row {
  item: CreditHistory;
  balanceAfter: number;
}

// history is newest-first; walk backwards from the current balance to
// recover the running balance immediately after each transaction.
function computeRows(history: CreditHistory[], currentBalance: number): Row[] {
  let running = currentBalance;
  return history.map((item) => {
    const balanceAfter = running;
    running -= item.amount;
    return { item, balanceAfter };
  });
}

export default function CreditHistoryTable({ history, currentBalance }: Props) {
  const rows = computeRows(history, currentBalance);

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-xs tracking-wider uppercase">
              <th className="px-5 py-3 text-left font-medium">日付</th>
              <th className="px-5 py-3 text-left font-medium">内容</th>
              <th className="px-5 py-3 text-right font-medium">金額</th>
              <th className="px-5 py-3 text-right font-medium">残高</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ item, balanceAfter }) => {
              const { icon: Icon, color } = getCategory(item);
              const date = new Date(item.createdAt);

              return (
                <tr
                  key={item.id}
                  className="border-border/60 hover:bg-muted/50 border-b transition-colors last:border-b-0"
                >
                  <td className="text-muted-foreground px-5 py-4 align-top whitespace-nowrap tabular-nums">
                    <div>{date.toLocaleDateString("ja-JP")}</div>
                    <div className="text-xs opacity-70">
                      {date.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("h-4 w-4 shrink-0", color)} />
                      <span className="font-medium">{item.reason}</span>
                    </div>
                  </td>

                  <td
                    className={cn(
                      "px-5 py-4 text-right font-semibold tabular-nums",
                      item.amount === 0
                        ? "text-blue-500"
                        : item.amount > 0
                          ? "text-emerald-500"
                          : "text-red-500",
                    )}
                  >
                    {item.amount === 0
                      ? "Pro"
                      : `${item.amount > 0 ? "+" : ""}${item.amount}`}
                  </td>

                  <td className="text-foreground px-5 py-4 text-right font-bold tabular-nums">
                    {balanceAfter.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
