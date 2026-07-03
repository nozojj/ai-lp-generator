import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import StatsCard from "@/components/dashboard/StatsCard";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Zap, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | AI LP Generator",
  description: "AIで生成したLPを管理できます。",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div>ログインしてください</div>;
  }
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return <div>ユーザーが存在しません</div>;
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, thisMonth, recent] = await Promise.all([
    prisma.generation.count({
      where: { userId: user.id },
    }),
    prisma.generation.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        hero: true,
        business: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <main className="bg-background text-foreground min-h-screen p-10">
      <PageHeader
        label="Dashboard"
        title="マイLP"
        description="AIで生成したLPを管理できます。"
      />
      <div className="bg-card border-border mb-8 rounded-xl border p-6">
        <p className="text-muted-foreground text-sm">Welcome back 👋</p>

        <h2 className="mt-2 text-3xl font-bold">{user.name ?? "ユーザー"}</h2>

        <p className="text-muted-foreground mt-2">
          今日もAIでLPを作成しましょう。
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="生成したLP"
          value={total}
          description="Total Generated"
          icon={FileText}
        />

        <StatsCard
          title="残りクレジット"
          value={user.credits}
          description="Remaining"
          icon={Zap}
        />

        <StatsCard
          title="利用プラン"
          value={user.isPro ? "Pro" : "Free"}
          description="Current Plan"
          icon={Crown}
        />

        <StatsCard
          title="今月生成"
          value={thisMonth}
          description="This Month"
          icon={TrendingUp}
        />
      </div>
      {recent.length > 0 && (
        <>
          <h2 className="mb-4 text-2xl font-semibold">
            最近生成したLP ({recent.length})
          </h2>
          <div className="space-y-3">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/history/${item.id}`}
                className="bg-card border-border flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
              >
                <div>
                  <h3 className="line-clamp-2 font-semibold">{item.hero}</h3>

                  <span className="bg-muted text-muted-foreground mt-2 inline-flex rounded-full px-3 py-1 text-xs">
                    {item.business}
                  </span>
                </div>

                <span className="text-muted-foreground text-xs">
                  {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </Link>
            ))}

            <div className="flex justify-end">
              <Link
                href="/mylp"
                className="text-primary text-sm hover:underline"
              >
                すべて見る →
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
