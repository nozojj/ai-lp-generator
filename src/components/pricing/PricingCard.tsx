"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  recommended?: boolean;
  disabled?: boolean;
  checkoutEnabled?: boolean;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  recommended,
  disabled,
  checkoutEnabled,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgradeClick() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error ?? "決済ページの作成に失敗しました");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative transition-transform",
        recommended && "md:-translate-y-3 md:scale-105",
      )}
    >
      {recommended && (
        <span className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold tracking-wide whitespace-nowrap text-white shadow-md">
          ⭐ 人気No.1プラン
        </span>
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
          recommended
            ? "border-emerald-500 shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/30 md:p-10"
            : "border-border hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl",
            recommended ? "bg-emerald-500/25" : "bg-foreground/5",
          )}
        />

        <div className="relative">
          <h2 className="text-3xl font-bold">{title}</h2>

          <p className="mt-2 text-4xl font-bold">{price}</p>

          <p className="text-muted-foreground mt-2">{description}</p>

          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature}>✅ {feature}</li>
            ))}
          </ul>

          <Button
            onClick={checkoutEnabled ? handleUpgradeClick : undefined}
            disabled={disabled || isLoading}
            className={cn("mt-8 w-full", recommended && "bg-emerald-500 hover:bg-emerald-600")}
          >
            {isLoading ? "処理中..." : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
