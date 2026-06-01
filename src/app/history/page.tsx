import DeleteButton from "@/components/delete-button";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

import Link from "next/link";

const prisma = new PrismaClient();

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
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
      <main className="min-h-screen bg-black text-white p-8">
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
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">生成履歴</h1>
        {data.length === 0 && (
          <div
            className="
      bg-zinc-900
      rounded-xl
      p-10
      text-center
    "
          >
            <h2 className="text-2xl font-bold mb-3">履歴がありません</h2>

            <p className="text-zinc-400">LPを生成するとここに表示されます</p>
          </div>
        )}
        {data.length > 0 && (
          <div className="space-y-6">
            {data.map((item) => (
              <div key={item.id}>
                <Link href={`/history/${item.id}`}>
                  <div
                    className="
            bg-zinc-900
            rounded-xl
            p-6
            hover:bg-zinc-800
            transition
            cursor-pointer
          "
                  >
                    <p className="text-zinc-400 mb-2">{item.business}</p>

                    <h2 className="text-xl font-bold mb-4">{item.hero}</h2>

                    <p className="mb-4 text-zinc-300">{item.cta}</p>

                    <div className="space-y-2">
                      {Array.isArray(item.features) &&
                        item.features.map((feature, index) => (
                          <div
                            key={index}
                            className="
                    bg-zinc-800
                    p-3
                    rounded-lg
                  "
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
