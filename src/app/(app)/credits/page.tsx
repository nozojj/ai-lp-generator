import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Crown, ArrowDownCircle, ArrowUpCircle, Coins } from "lucide-react";

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
    return <div>ユーザーが存在しません</div>;
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
      <p className="mb-2 text-sm tracking-widest text-slate-400 uppercase">
        Credits
      </p>

      <h1 className="mb-8 text-4xl font-bold">クレジット履歴</h1>

      <div className="mb-8 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-slate-900 p-6 shadow-lg">
        <div>
          <p className="text-sm tracking-wider text-slate-400 uppercase">
            CURRENT CREDITS
          </p>

          <h2 className="mt-2 text-6xl font-black text-emerald-400">
            {user.credits}
          </h2>
        </div>

        <Coins className="h-16 w-16 text-emerald-400 opacity-60" />
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-10 text-center">
          <h2 className="text-2xl font-bold">まだ履歴がありません</h2>

          <p className="mt-2 text-slate-400">
            LPを生成するとここに履歴が表示されます。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-800 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                {item.amount === 0 ? (
                  <Crown className="h-6 w-6 text-yellow-400" />
                ) : item.amount < 0 ? (
                  <ArrowDownCircle className="h-6 w-6 text-red-400" />
                ) : (
                  <ArrowUpCircle className="h-6 w-6 text-green-400" />
                )}

                <div>
                  <h2 className="font-bold">{item.reason}</h2>

                  <p className="text-sm text-slate-400">
                    {new Date(item.createdAt).toLocaleString("ja-JP")}
                  </p>

                  <p className="mt-1 text-xs tracking-wider text-slate-500 uppercase">
                    CREDIT HISTORY
                  </p>
                </div>
              </div>

              <div className="text-xl font-bold">
                {item.amount === 0 ? (
                  <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black">
                    PRO
                  </span>
                ) : (
                  <span
                    className={
                      item.amount > 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
