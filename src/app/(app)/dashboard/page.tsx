import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CopyPublicUrlButton from "@/components/CopyPublicUrlButton";
import DeleteButton from "@/components/DeleteButton";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";
import DownloadZipButton from "@/components/DownloadZipButton";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
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
  const generations = await prisma.generation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = generations.length;

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <p className="mb-2 text-sm tracking-widest text-slate-400 uppercase">
        Dashboard
      </p>
      <h1 className="mb-8 text-4xl font-bold">マイLP</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-6">
          <p className="text-slate-400">生成したLP</p>
          <h2 className="mt-2 text-3xl font-bold">{total}</h2>
        </div>

        <div className="rounded-xl bg-slate-900 p-6">
          <p className="text-slate-400">残りクレジット</p>
          <h2 className="mt-2 text-3xl font-bold">{user.credits}</h2>
        </div>

        <div className="rounded-xl bg-slate-900 p-6">
          <p className="text-slate-400">利用プラン</p>
          <h2 className="mt-2 text-3xl font-bold">
            {user.isPro ? "Pro" : "Free"}
          </h2>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">生成したLP一覧</h2>

      {generations.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-10 text-center">
          <h2 className="text-2xl font-bold">まだLPがありません</h2>

          <p className="mt-2 text-slate-400">AIで最初のLPを作成しましょう！</p>
        </div>
      ) : (
        <div className="space-y-6">
          {generations.map((item) => {
            const templateName =
              item.template.charAt(0).toUpperCase() + item.template.slice(1);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl"
              >
                {item.imageUrl && (
                  <div className="group relative h-56 w-full overflow-hidden">
                    <Link href={`/lp/${item.id}`} className="absolute inset-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.hero}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </Link>
                  </div>
                )}
                <div className="p-6">
                  <Link href={`/lp/${item.id}`}>
                    <h2 className="text-2xl font-bold transition hover:text-emerald-400">
                      {item.hero}
                    </h2>
                  </Link>

                  <p className="mt-2 text-sm text-slate-500">
                    作成日：
                    {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-slate-400">テンプレート</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.template === "luxury"
                          ? "bg-yellow-500 text-black"
                          : item.template === "minimal"
                            ? "bg-gray-200 text-black"
                            : item.template === "corporate"
                              ? "bg-slate-700 text-white"
                              : "bg-blue-600 text-white"
                      }`}
                    >
                      {templateName}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    業種：
                    <span className="font-semibold">{item.business}</span>
                  </p>

                  <p className="mt-2 line-clamp-2 text-slate-400">{item.cta}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                    <Link href={`/edit/${item.id}`}>
                      <Button className="h-11 w-full">編集</Button>
                    </Link>

                    <Link href={`/lp/${item.id}`}>
                      <Button className="h-11 w-full bg-emerald-600 hover:bg-emerald-500">
                        公開LP
                      </Button>
                    </Link>
                    <div className="flex-1">
                      <DownloadHtmlButton id={item.id} />
                    </div>

                    <div className="w-full">
                      <CopyPublicUrlButton id={item.id} />
                    </div>

                    <div className="flex-1">
                      <DeleteButton id={item.id} />
                    </div>

                    <div className="flex-1">
                      <DownloadZipButton id={item.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
