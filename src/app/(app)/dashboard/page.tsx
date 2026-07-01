import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import StatsCard from "@/components/dashboard/StatsCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";

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
  const generations = await prisma.generation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = generations.length;

  return (
    <main className="bg-background text-foreground min-h-screen p-10">
      <PageHeader
        label="Dashboard"
        title="マイLP"
        description="AIで生成したLPを管理できます。"
      />
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="生成したLP" value={total} />

        <StatsCard title="残りクレジット" value={user.credits} />

        <StatsCard title="利用プラン" value={user.isPro ? "Pro" : "Free"} />
      </div>

      <h2 className="text-foreground mb-4 text-2xl font-semibold">
        生成したLP一覧
      </h2>

      {generations.length === 0 ? (
        <EmptyState
          title="まだLPがありません"
          description="最初のLPを生成してみましょう。"
        />
      ) : (
        <div className="space-y-6">
          <DashboardContent generations={generations} />
        </div>
      )}
    </main>
  );
}
