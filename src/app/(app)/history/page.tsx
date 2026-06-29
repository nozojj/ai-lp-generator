import HistoryList from "@/components/HistoryList";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
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
      <main className="min-h-screen bg-black p-8 text-white">
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
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">生成履歴</h1>

        {data.length === 0 && (
          <div className="rounded-xl bg-zinc-900 p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">履歴がありません</h2>
            <p className="text-zinc-400">LPを生成するとここに表示されます</p>
          </div>
        )}

        {data.length > 0 && <HistoryList data={data} />}
      </div>
    </main>
  );
}
