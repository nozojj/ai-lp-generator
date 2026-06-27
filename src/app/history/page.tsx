import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
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
                  <div className="cursor-pointer overflow-hidden rounded-xl bg-zinc-900 transition duration-200 hover:scale-[1.01] hover:bg-zinc-800">
                    {item.imageUrl && (
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.business}
                          className="h-56 w-full object-cover object-center"
                        />
                        <div className="absolute top-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <p className="mb-2 text-zinc-400">{item.business}</p>

                      <h2 className="mb-4 line-clamp-2 text-xl font-bold">
                        {item.hero}
                      </h2>

                      <p className="mb-4 text-sm text-zinc-400">{item.cta}</p>

                      <div className="space-y-2">
                        {Array.isArray(item.features) &&
                          item.features.slice(0, 2).map((feature, index) => (
                            <div
                              key={index}
                              className="rounded-lg bg-zinc-800 p-3"
                            >
                              {String(feature)}
                            </div>
                          ))}
                      </div>
                      {Array.isArray(item.features) &&
                        item.features.length > 2 && (
                          <p className="text-sm text-zinc-500">
                            +{item.features.length - 2}件
                          </p>
                        )}
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex gap-3">
                  <Link href={`/preview/${item.id}`} target="_blank">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      LPプレビュー
                    </Button>
                  </Link>

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
