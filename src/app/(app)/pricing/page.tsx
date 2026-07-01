"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | AI LP Generator",
  description: "AI LP Generatorの料金プランです。",
};

export default function PricingPage() {
  const [isPro, setIsPro] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/user");
      const data = await response.json();
      setIsPro(data.isPro);
    };
    fetchUser();
  }, []);
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Pricing</h1>

          <p className="text-lg text-muted-foreground">あなたに合ったプランを選択</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* FREE PLAN */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="mb-4 text-3xl font-bold">Free</h2>

            <p className="mb-8 text-muted-foreground">お試し向けプラン</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">¥0</span>

              <span className="text-muted-foreground">/月</span>
            </div>

            <ul className="mb-10 space-y-4">
              <li>✓ 5クレジット</li>
              <li>✓ LP生成</li>
              <li>✓ 履歴保存</li>
            </ul>

            <Button className="w-full cursor-default bg-zinc-700 text-foreground hover:bg-zinc-700">
              現在のプラン
            </Button>
          </div>

          {/* PRO PLAN */}
          <div className="relative overflow-hidden rounded-2xl bg-[#6c47ff] p-8">
            <div className="absolute top-0 right-0 bg-card px-4 py-1 text-sm font-bold text-foreground">
              POPULAR
            </div>

            <h2 className="mb-4 text-3xl font-bold">Pro</h2>

            <p className="mb-8 text-foreground/80">本格利用向け</p>

            <div className="mb-8">
              <span className="text-5xl font-bold">¥980</span>

              <span className="text-foreground/80">/月</span>
            </div>

            <ul className="mb-10 space-y-4">
              <li>✓ 無制限生成</li>
              <li>✓ 高速生成</li>
              <li>✓ 優先サポート</li>
            </ul>

            {isPro ? (
              <Button disabled className="w-full bg-green-500 text-foreground">
                現在Proプラン利用中
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  const response = await fetch("api/checkout", {
                    method: "POST",
                  });

                  const data = await response.json();

                  window.location.href = data.url;
                }}
                className="w-full bg-card text-foreground hover:bg-zinc-200"
              >
                Proにアップグレード
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
