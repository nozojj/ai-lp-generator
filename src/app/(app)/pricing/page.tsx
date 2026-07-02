import PageHeader from "@/components/common/PageHeader";
import PricingCard from "@/components/pricing/PricingCard";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function PricingPage() {
  const { userId } = await auth();

  const user = userId
    ? await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      })
    : null;
  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          label="Pricing"
          title="料金プラン"
          description="あなたに合ったプランを選択してください。"
        />

        <div className="grid gap-8 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="¥0"
            description="まずは無料で試したい方向け"
            features={["LP生成", "生成履歴", "HTMLダウンロード"]}
            buttonText={user?.isPro ? "Freeプラン" : "現在のプラン"}
            disabled={!user?.isPro}
          />

          <PricingCard
            title="Pro"
            price="¥980 / 月"
            description="本格的にLPを作成したい方向け"
            features={["無制限LP生成", "優先サポート", "今後の新機能"]}
            buttonText={user?.isPro ? "現在のプラン" : "Proにアップグレード"}
            disabled={!!user?.isPro}
            recommended
          />
        </div>
      </div>
    </main>
  );
}
