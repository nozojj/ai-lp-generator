import DeleteButton from "@/components/delete-button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import Link from "next/link";


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
        {data.length > 0 && (
          <div className="space-y-6">
            {data.map((item) => (
              <div key={item.id}>
                <Link href={`/history/${item.id}`}>
                  <div className="cursor-pointer rounded-xl bg-zinc-900 p-6 transition hover:bg-zinc-800">
                    <p className="mb-2 text-zinc-400">{item.business}</p>
                    <p className="mt-2 text-sm text-zinc-500">
                      {new Date(item.createdAt).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <h2 className="mb-4 text-xl font-bold">{item.hero}</h2>

                    <p className="mb-4 text-zinc-300">{item.cta}</p>

                    <div className="space-y-2">
                      {Array.isArray(item.features) &&
                        item.features.map((feature, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-zinc-800 p-3"
                          >
                            {String(feature)}
                          </div>
                        ))}
                    </div>
                  </div>
                </Link>

                <div className="mt-3">
                  <DeleteButton id={item.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
