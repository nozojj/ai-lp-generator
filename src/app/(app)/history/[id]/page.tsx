import PageHeader from "@/components/common/PageHeader";
import { CopyButton } from "@/components/copy-button";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Template from "@/components/templates/Template";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <main className="text-foreground p-8">ログインしてください</main>;
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    notFound();
  }

  const item = await prisma.generation.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!item) {
    notFound();
  }

  const copyText = `
Hero:
${item.hero}

CTA:
${item.cta}

Features:
${Array.isArray(item.features) ? item.features.join("\n") : ""}

Benefits:
${Array.isArray(item.benefits) ? item.benefits.join("\n") : ""}

FAQ:
${
  Array.isArray(item.faq)
    ? (
        item.faq as {
          question: string;
          answer: string;
        }[]
      )
        .map((faq) => `Q. ${faq.question}\nA. ${faq.answer}`)
        .join("\n\n")
    : ""
}
`;

  return (
    <main className="text-foreground min-h-screen p-8">
      <Link
        href="/history"
        className="text-muted-foreground hover:text-foreground mb-8 inline-block transition"
      >
        ← 履歴一覧へ戻る
      </Link>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-4xl flex-1">
            <PageHeader label="History" title={item.hero} />

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">
                <Clock />
                {new Date(item.createdAt).toLocaleString("ja-JP")}
              </Badge>

              <p className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-sm">
                {item.business}
              </p>
            </div>
          </div>

          <div className="flex w-56 flex-col gap-3">
            <CopyButton text={copyText} />

            <DownloadHtmlButton id={item.id} />

            <Button
              asChild
              className="h-11 w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link href={`/lp/${item.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                LPプレビュー
              </Link>
            </Button>

            <Button
              asChild
              className="h-11 w-full bg-amber-500 hover:bg-amber-600"
            >
              <Link href={`/edit/${item.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-border overflow-hidden rounded-2xl border shadow-lg">
          <div className="border-border bg-muted flex items-center gap-1.5 border-b px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>

          <div className="max-h-200 overflow-y-auto">
            <Template item={item} />
          </div>
        </div>
      </div>
    </main>
  );
}
