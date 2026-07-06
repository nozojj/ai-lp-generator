import PageHeader from "@/components/common/PageHeader";
import HistoryList from "@/components/HistoryList";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "History | AI LP Generator",
  description: "生成履歴を確認できます。",
};

const PAGE_SIZE = 20;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="text-foreground min-h-screen p-8">
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
      <main className="text-foreground min-h-screen p-8">
        ユーザーが存在しません
      </main>
    );
  }

  const [data, total] = await Promise.all([
    prisma.generation.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.generation.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="text-foreground min-h-screen p-8">
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

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href={`/history?page=${page - 1}`}
            aria-disabled={page <= 1}
            className={
              page <= 1
                ? "pointer-events-none text-muted-foreground opacity-50"
                : "text-primary hover:underline"
            }
          >
            ← 前へ
          </Link>

          <span className="text-muted-foreground text-sm">
            {page} / {totalPages}
          </span>

          <Link
            href={`/history?page=${page + 1}`}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages
                ? "pointer-events-none text-muted-foreground opacity-50"
                : "text-primary hover:underline"
            }
          >
            次へ →
          </Link>
        </div>
      )}
    </main>
  );
}
