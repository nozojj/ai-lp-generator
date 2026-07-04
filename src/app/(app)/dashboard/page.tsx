import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import StatsCard from "@/components/dashboard/StatsCard";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Zap, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTemplateBadgeVariant } from "@/lib/tag-colors";
import GenerationTrendChart, {
  type TrendPoint,
} from "@/components/dashboard/GenerationTrendChart";

const TREND_DAYS = 30;

function buildTrendData(dates: Date[]): TrendPoint[] {
  const startOfRange = new Date();
  startOfRange.setHours(0, 0, 0, 0);
  startOfRange.setDate(startOfRange.getDate() - (TREND_DAYS - 1));

  const countsByDate = new Map<string, number>();
  for (const date of dates) {
    const key = date.toISOString().slice(0, 10);
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
  }

  return Array.from({ length: TREND_DAYS }, (_, i) => {
    const d = new Date(startOfRange);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);

    return {
      date: key,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: countsByDate.get(key) ?? 0,
    };
  });
}

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

  const startOfTrend = new Date();
  startOfTrend.setHours(0, 0, 0, 0);
  startOfTrend.setDate(startOfTrend.getDate() - (TREND_DAYS - 1));

  const [total, thisMonth, recent, trendGenerations] = await Promise.all([
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
        target: true,
        template: true,
        createdAt: true,
      },
    }),
    prisma.generation.findMany({
      where: { userId: user.id, createdAt: { gte: startOfTrend } },
      select: { createdAt: true },
    }),
  ]);

  const trendData = buildTrendData(trendGenerations.map((g) => g.createdAt));

  return (
    <main className="text-foreground min-h-screen p-10">
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
      <div className="bg-card border-border mb-8 rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          生成数の推移（過去{TREND_DAYS}日）
        </h2>

        <GenerationTrendChart data={trendData} />
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

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="blue">{item.business}</Badge>

                    <Badge variant="purple">{item.target}</Badge>

                    <Badge
                      variant={getTemplateBadgeVariant(item.template)}
                      className="capitalize"
                    >
                      {item.template}
                    </Badge>
                  </div>
                </div>

                <Badge variant="muted">
                  {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                </Badge>
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
