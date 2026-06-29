import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import CreditBalanceCard from "@/components/credits/CreditBalanceCard";
import CreditHistoryItem from "@/components/credits/CreditHistoryItem";
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
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          label="Credits"
          title="クレジット履歴"
          description="クレジットの利用履歴を確認できます。"
        />

        <CreditBalanceCard credits={user.credits} />

        {history.length === 0 ? (
          <EmptyState
            title="まだ履歴がありません"
            description="LPを生成するとここに履歴が表示されます。"
          />
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <CreditHistoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
