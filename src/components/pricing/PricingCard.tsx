"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      className={`rounded-2xl border p-8 ${
        recommended ? "border-emerald-500 shadow-lg" : "border-border"
      }`}
    >
      {recommended && (
        <p className="mb-4 text-sm font-bold text-emerald-400">
          ⭐ Recommended
        </p>
      )}

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
        className="mt-8 w-full"
      >
        {isLoading ? "処理中..." : buttonText}
      </Button>
    </div>
  );
}
