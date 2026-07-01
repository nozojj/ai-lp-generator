import PageHeader from "@/components/common/PageHeader";
import HistoryList from "@/components/HistoryList";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History | AI LP Generator",
  description: "生成履歴を確認できます。",
};

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="bg-background text-foreground min-h-screen p-8">
        ログインしてください
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return (
      <main className="bg-background text-foreground min-h-screen p-8">
        ユーザーが存在しません
      </main>
    );
  }

  const data = await prisma.generation.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          label="History"
          title="生成履歴"
          description="生成したLPの履歴を確認できます。"
        />

        {data.length === 0 && (
          <div className="bg-card border-border rounded-xl border p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">履歴がありません</h2>
            <p className="text-muted-foreground">
              LPを生成するとここに表示されます
            </p>
          </div>
        )}

        {data.length > 0 && <HistoryList data={data} />}
      </div>
    </main>
  );
}
