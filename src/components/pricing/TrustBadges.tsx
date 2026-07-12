import { Check } from "lucide-react";

const BADGES = ["Stripe決済", "SSL", "いつでも解約", "自動更新"];

export default function TrustBadges() {
  return (
    <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      {BADGES.map((badge) => (
        <span key={badge} className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-emerald-500" />
          {badge}
        </span>
      ))}
    </div>
  );
}
