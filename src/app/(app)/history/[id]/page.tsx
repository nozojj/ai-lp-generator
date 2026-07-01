import PageHeader from "@/components/common/PageHeader";
import { CopyButton } from "@/components/copy-button";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="bg-background text-foreground min-h-screen p-8">
      <Link
        href="/history"
        className="text-muted-foreground hover:text-foreground mb-8 inline-block transition"
      >
        ← 履歴一覧へ戻る
      </Link>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-2xl flex-1">
            <PageHeader
              label="History"
              title={item.hero}
              description={new Date(item.createdAt).toLocaleString("ja-JP")}
            />

            <p className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-sm">
              {item.business}
            </p>
          </div>

          <div className="flex w-48 flex-col gap-3">
            <CopyButton text={copyText} />

            <DownloadHtmlButton id={item.id} />

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href={`/preview/${item.id}`}>LPプレビュー</Link>
            </Button>

            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600">
              <Link href={`/edit/${item.id}`}>編集</Link>
            </Button>
          </div>
        </div>

        <div className="bg-card border-border rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">CTA</h2>

          <p className="text-lg leading-8">{item.cta}</p>
        </div>

        <div className="bg-card border-border rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">Features</h2>

          <div className="space-y-3">
            {Array.isArray(item.features) &&
              item.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-muted text-muted-foreground rounded-lg p-4"
                >
                  {String(feature)}
                </div>
              ))}
          </div>
        </div>
        <div className="bg-card border-border rounded-xl border p-6">
          <h2 className="mb-4 text-xl font-bold">Benefits</h2>

          <div className="space-y-3">
            {Array.isArray(item.benefits) &&
              item.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-muted text-muted-foreground rounded-lg p-4"
                >
                  {String(benefit)}
                </div>
              ))}
          </div>
        </div>
        <div className="bg-card border-border rounded-xl border p-6">
          <h2 className="mb-4 text-xl font-bold">FAQ</h2>

          <div className="space-y-3">
            {Array.isArray(item.faq) &&
              (
                item.faq as {
                  question: string;
                  answer: string;
                }[]
              ).map((faq, index) => (
                <div
                  key={index}
                  className="bg-muted text-muted-foreground rounded-lg p-4"
                >
                  <p className="font-bold">Q. {faq.question}</p>

                  <p className="text-muted-foreground mt-2">A. {faq.answer}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
