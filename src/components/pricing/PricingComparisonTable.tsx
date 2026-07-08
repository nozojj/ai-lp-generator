import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

interface Row {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
}

const ROWS: Row[] = [
  { feature: "LP生成", free: "クレジット制", pro: "無制限" },
  { feature: "生成履歴", free: true, pro: true },
  { feature: "HTMLダウンロード", free: true, pro: true },
  { feature: "優先サポート", free: false, pro: true },
  { feature: "今後の新機能への先行アクセス", free: false, pro: true },
  { feature: "画像生成速度UP", free: false, pro: true },
  { feature: "最新AIモデル", free: false, pro: true },
  { feature: "優先Queue", free: false, pro: true },
  { feature: "高画質出力", free: false, pro: true },
  { feature: "商用利用", free: false, pro: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="font-medium">{value}</span>;
  }

  return value ? (
    <Check className="mx-auto h-5 w-5 text-emerald-500" />
  ) : (
    <Minus className="text-muted-foreground/50 mx-auto h-5 w-5" />
  );
}

export default function PricingComparisonTable() {
  return (
    <div className="border-border bg-card mt-12 overflow-hidden rounded-2xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-120 border-collapse text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                機能比較
              </th>
              <th className="text-muted-foreground w-32 px-6 py-4 text-center text-xs font-medium tracking-wider uppercase">
                Free
              </th>
              <th className="w-32 px-6 py-4 text-center text-xs font-medium tracking-wider text-emerald-500 uppercase">
                Pro
              </th>
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.feature}
                className="border-border/60 border-b last:border-b-0"
              >
                <td className="px-6 py-4 font-medium">{row.feature}</td>

                <td className="px-6 py-4 text-center">
                  <Cell value={row.free} />
                </td>

                <td
                  className={cn(
                    "bg-emerald-500/5 px-6 py-4 text-center",
                  )}
                >
                  <Cell value={row.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
