import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CopyPublicUrlButton from "@/components/CopyPublicUrlButton";
import DeleteButton from "@/components/DeleteButton";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";

export default async function DashboardPage() {
  const generations = await prisma.generation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="mb-8 text-4xl font-bold">マイLP</h1>

      <div className="space-y-6">
        {generations.map((item) => {
          const templateName =
            item.template.charAt(0).toUpperCase() + item.template.slice(1);
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
            >
              {item.imageUrl && (
                <div className="relative h-56 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.hero}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold">{item.hero}</h2>

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

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/edit/${item.id}`} className="flex-1">
                    <Button className="w-full">編集</Button>
                  </Link>

                  <Link href={`/lp/${item.id}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500">
                      公開
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <DownloadHtmlButton id={item.id} />
                  </div>

                  <div className="flex-1">
                    <CopyPublicUrlButton id={item.id} />
                  </div>

                  <div className="flex-1">
                    <DeleteButton id={item.id} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
