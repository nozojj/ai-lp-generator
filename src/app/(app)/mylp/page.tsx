import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My LP | AI LP Generator",
  description: "生成したLPの一覧を検索・並び替えできます。",
};

const PAGE_SIZE = 20;

export default async function MyLpPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

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

  const [generations, total] = await Promise.all([
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
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="text-foreground min-h-screen p-10">
      <PageHeader
        label="My LP"
        title="マイLP一覧"
        description="生成したLPを検索・並び替えして管理できます。"
      />

      {generations.length === 0 ? (
        <EmptyState
          title="まだLPがありません"
          description="最初のLPを生成してみましょう。"
        />
      ) : (
        <div className="space-y-6">
          <DashboardContent generations={generations} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Link
                href={`/mylp?page=${page - 1}`}
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
                href={`/mylp?page=${page + 1}`}
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
        </div>
      )}
    </main>
  );
}
