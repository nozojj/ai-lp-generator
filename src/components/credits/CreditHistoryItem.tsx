import {
  ArrowDownCircle,
  ArrowUpCircle,
  Crown,
} from "lucide-react";

import type { CreditHistory } from "@prisma/client";

interface Props {
  item: CreditHistory;
}

export default function CreditHistoryItem({
  item,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-muted hover:shadow-xl">
      <div className="flex items-center gap-3">
        {item.amount === 0 ? (
          <Crown className="h-6 w-6 text-yellow-400" />
        ) : item.amount < 0 ? (
          <ArrowDownCircle className="h-6 w-6 text-red-400" />
        ) : (
          <ArrowUpCircle className="h-6 w-6 text-green-400" />
        )}

        <div>
          <h2 className="font-bold">
            {item.reason}
          </h2>

          <p className="text-sm text-slate-400">
            {new Date(item.createdAt).toLocaleString("ja-JP")}
          </p>
        </div>
      </div>

      <div className="text-xl font-bold">
        {item.amount === 0 ? (
          <span className="text-blue-400">
            Pro
          </span>
        ) : (
          <span
            className={
              item.amount > 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {item.amount > 0 ? "+" : ""}
            {item.amount}
          </span>
        )}
      </div>
    </div>
  );
}