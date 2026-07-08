import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import CreditBalanceCard from "@/components/credits/CreditBalanceCard";
import CreditStats from "@/components/credits/CreditStats";
import CreditHistoryTable from "@/components/credits/CreditHistoryTable";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";

export const metadata: Metadata = {
  title: "Credits | AI LP Generator",
  description: "クレジット履歴を確認できます。",
};

export default async function CreditsPage() {
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
    notFound();
  }

  const history = await prisma.creditHistory.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-10 text-foreground">
      <PageHeader
        label="Credits"
        title="クレジット履歴"
        description="クレジットの利用履歴を確認できます。"
      />

      <CreditBalanceCard credits={user.credits} />

      <CreditStats history={history} isPro={user.isPro} />

      {history.length === 0 ? (
        <EmptyState
          title="まだ履歴がありません"
          description="LPを生成するとここに履歴が表示されます。"
        />
      ) : (
        <CreditHistoryTable history={history} currentBalance={user.credits} />
      )}
    </main>
  );
}
