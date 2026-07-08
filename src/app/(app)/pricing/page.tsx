import PageHeader from "@/components/common/PageHeader";
import PricingCard from "@/components/pricing/PricingCard";
import PricingComparisonTable from "@/components/pricing/PricingComparisonTable";
import TrustBadges from "@/components/pricing/TrustBadges";
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
    <main className="text-foreground min-h-screen p-8">
      <PageHeader
        label="Pricing"
        title="料金プラン"
        description="あなたに合ったプランを選択してください。"
      />

      <div className="grid gap-8 pt-4 md:grid-cols-2">
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
          features={[
            "無制限LP生成",
            "優先サポート",
            "今後の新機能",
            "画像生成速度UP",
            "最新AIモデル",
            "優先Queue",
            "高画質出力",
            "商用利用",
          ]}
          buttonText={user?.isPro ? "現在のプラン" : "Proにアップグレード"}
          disabled={!!user?.isPro}
          checkoutEnabled={!user?.isPro}
          recommended
        />
      </div>

      <TrustBadges />

      <PricingComparisonTable />
    </main>
  );
}
