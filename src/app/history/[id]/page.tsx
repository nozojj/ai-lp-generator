import { CopyButton } from "@/components/copy-button";
import DownloadHtmlButton from "@/components/download-html-button";
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
    return <main className="p-8 text-white">ログインしてください</main>;
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

  const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${item.hero}</title>

<style>
body {
  font-family: sans-serif;
  max-width: 1000px;
  margin: auto;
  padding: 40px;
  background: #0f172a;
  color: white;
}

.hero {
  text-align: center;
  padding: 100px 20px;
}

.hero p {
  color: #cbd5e1;
  font-size: 20px;
  margin-top: 20px;
}

section {
  background: #1e293b;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,.2);
}
  
h1 {
  font-size: 42px;
}

h2 {
  margin-bottom: 16px;
}

li {
  margin-bottom: 8px;
}

.faq-item {
  background: #334155;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.cta-button {
  display: inline-block;
  margin-top: 24px;
  padding: 14px 28px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
}
</style>

</head>
<body>

<div class="hero">
  <h1>${item.hero}</h1>
  <p>${item.cta}</p>
  <a class="cta-button" href="#">
  今すぐ申し込む
</a>
</div>

<section>
  <h2>Features</h2>
  <ul>
    ${
      Array.isArray(item.features)
        ? item.features.map((f) => `<li>${f}</li>`).join("")
        : ""
    }
  </ul>
</section>

<section>
  <h2>Benefits</h2>
  <ul>
    ${
      Array.isArray(item.benefits)
        ? item.benefits.map((b) => `<li>${b}</li>`).join("")
        : ""
    }
  </ul>
</section>

<section>
  <h2>FAQ</h2>

  ${
    Array.isArray(item.faq)
      ? (
          item.faq as {
            question: string;
            answer: string;
          }[]
        )
          .map(
            (faq) => `
<div class="faq-item">
  <h3>${faq.question}</h3>
  <p>${faq.answer}</p>
</div>
`,
          )
          .join("")
      : ""
  }
</section>

</body>
</html>
`;

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <Link
        href="/history"
        className="text-zinc-400 transition hover:text-white"
      >
        ← 履歴一覧へ戻る
      </Link>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">{item.hero}</h1>

            <p className="text-zinc-500">
              {new Date(item.createdAt).toLocaleString("ja-JP")}
            </p>

            <p className="mb-2 text-zinc-400">{item.business}</p>
          </div>

          <CopyButton text={copyText} />
          <DownloadHtmlButton html={htmlContent} />
          <Link
            href={`/preview/${item.id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            LPプレビュー
          </Link>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-2xl font-bold">CTA</h2>

          <p className="text-lg leading-8">{item.cta}</p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-2xl font-bold">Features</h2>

          <div className="space-y-3">
            {Array.isArray(item.features) &&
              item.features.map((feature, index) => (
                <div key={index} className="rounded-lg bg-zinc-800 p-4">
                  {String(feature)}
                </div>
              ))}
          </div>
        </div>
        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Benefits</h2>

          <div className="space-y-3">
            {Array.isArray(item.benefits) &&
              item.benefits.map((benefit, index) => (
                <div key={index} className="rounded-lg bg-zinc-800 p-4">
                  {String(benefit)}
                </div>
              ))}
          </div>
        </div>
        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">FAQ</h2>

          <div className="space-y-3">
            {Array.isArray(item.faq) &&
              (
                item.faq as {
                  question: string;
                  answer: string;
                }[]
              ).map((faq, index) => (
                <div key={index} className="rounded-lg bg-zinc-800 p-4">
                  <p className="font-bold">Q. {faq.question}</p>

                  <p className="mt-2 text-zinc-300">A. {faq.answer}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
