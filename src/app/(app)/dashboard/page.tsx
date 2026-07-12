import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import StatsCard from "@/components/dashboard/StatsCard";
import PageHeader from "@/components/common/PageHeader";
import { FileText, Zap, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTemplateBadgeVariant } from "@/lib/tag-colors";
import { type TrendPoint } from "@/components/dashboard/GenerationTrendChart";
import UsageTrendPanel from "@/components/dashboard/UsageTrendPanel";
import CreditUsageCard from "@/components/dashboard/CreditUsageCard";

const DAILY_DAYS = 30;
const WEEKLY_WEEKS = 12;
const MONTHLY_MONTHS = 6;

// Local calendar date, not UTC — Date#toISOString shifts the date under
// non-UTC server timezones and desyncs from the local setHours/setDate bucketing below.
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildDailyTrend(dates: Date[]): TrendPoint[] {
  const startOfRange = new Date();
  startOfRange.setHours(0, 0, 0, 0);
  startOfRange.setDate(startOfRange.getDate() - (DAILY_DAYS - 1));

  const countsByDate = new Map<string, number>();
  for (const date of dates) {
    const key = toDateKey(date);
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
  }

  return Array.from({ length: DAILY_DAYS }, (_, i) => {
    const d = new Date(startOfRange);
    d.setDate(d.getDate() + i);
    const key = toDateKey(d);

    return {
      date: key,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: countsByDate.get(key) ?? 0,
    };
  });
}

function buildWeeklyTrend(dates: Date[]): TrendPoint[] {
  const startOfRange = new Date();
  startOfRange.setHours(0, 0, 0, 0);
  startOfRange.setDate(startOfRange.getDate() - (WEEKLY_WEEKS * 7 - 1));

  return Array.from({ length: WEEKLY_WEEKS }, (_, i) => {
    const weekStart = new Date(startOfRange);
    weekStart.setDate(weekStart.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = dates.filter((d) => d >= weekStart && d < weekEnd).length;

    return {
      date: weekStart.toISOString().slice(0, 10),
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      count,
    };
  });
}

function buildMonthlyTrend(dates: Date[]): TrendPoint[] {
  const startOfRange = new Date();
  startOfRange.setHours(0, 0, 0, 0);
  startOfRange.setDate(1);
  startOfRange.setMonth(startOfRange.getMonth() - (MONTHLY_MONTHS - 1));

  return Array.from({ length: MONTHLY_MONTHS }, (_, i) => {
    const monthStart = new Date(startOfRange);
    monthStart.setMonth(monthStart.getMonth() + i);

    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const count = dates.filter((d) => d >= monthStart && d < monthEnd).length;

    return {
      date: monthStart.toISOString().slice(0, 10),
      label: `${monthStart.getMonth() + 1}月`,
      count,
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
  startOfTrend.setDate(1);
  startOfTrend.setMonth(startOfTrend.getMonth() - (MONTHLY_MONTHS - 1));

  const [total, thisMonth, recent, trendGenerations, monthlyCreditHistory] =
    await Promise.all([
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
      prisma.creditHistory.findMany({
        where: { userId: user.id, createdAt: { gte: startOfMonth } },
        select: { amount: true },
      }),
    ]);

  const trendDates = trendGenerations.map((g) => g.createdAt);
  const dailyTrend = buildDailyTrend(trendDates);
  const weeklyTrend = buildWeeklyTrend(trendDates);
  const monthlyTrend = buildMonthlyTrend(trendDates);

  const creditsConsumed = monthlyCreditHistory.reduce(
    (sum, entry) => (entry.amount < 0 ? sum + Math.abs(entry.amount) : sum),
    0,
  );

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
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageTrendPanel
            daily={dailyTrend}
            weekly={weeklyTrend}
            monthly={monthlyTrend}
          />
        </div>

        <CreditUsageCard
          consumed={creditsConsumed}
          remaining={user.credits}
          isPro={user.isPro}
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
