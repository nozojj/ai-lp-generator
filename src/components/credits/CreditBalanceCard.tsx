import { Coins } from "lucide-react";

interface Props {
  credits: number;
}

export default function CreditBalanceCard({ credits }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-slate-900 p-6 shadow-lg">
      <div>
        <p className="text-sm tracking-wider text-slate-400 uppercase">
          CURRENT CREDITS
        </p>

        <p className="text-xs tracking-wider text-slate-500 uppercase">
          CREDIT HISTORY
        </p>

        <h2 className="mt-2 text-5xl font-black text-emerald-400">{credits}</h2>
      </div>

      <Coins className="h-14 w-14 text-emerald-400 opacity-70" />
    </div>
  );
}
