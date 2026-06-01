"use client"

import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Pricing</h1>

          <p className="text-zinc-400 text-lg">あなたに合ったプランを選択</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FREE PLAN */}
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-8
            "
          >
            <h2 className="text-3xl font-bold mb-4">Free</h2>

            <p className="text-zinc-400 mb-8">お試し向けプラン</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">¥0</span>

              <span className="text-zinc-400">/月</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li>✓ 5クレジット</li>
              <li>✓ LP生成</li>
              <li>✓ 履歴保存</li>
            </ul>

            <Button className="w-full" variant="outline">
              現在のプラン
            </Button>
          </div>

          {/* PRO PLAN */}
          <div
            className="
              bg-[#6c47ff]
              rounded-2xl
              p-8
              relative
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                top-0
                right-0
                bg-white
                text-black
                px-4
                py-1
                text-sm
                font-bold
              "
            >
              POPULAR
            </div>

            <h2 className="text-3xl font-bold mb-4">Pro</h2>

            <p className="text-white/80 mb-8">本格利用向け</p>

            <div className="mb-8">
              <span className="text-5xl font-bold">¥980</span>

              <span className="text-white/80">/月</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li>✓ 無制限生成</li>
              <li>✓ 高速生成</li>
              <li>✓ 優先サポート</li>
            </ul>

            <Button
              onClick={() => {
                alert("Stripe連携予定");
              }}
              className="
                w-full
                bg-white
                text-black
                hover:bg-zinc-200
              "
            >
              Proにアップグレード
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
