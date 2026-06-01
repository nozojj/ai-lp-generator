import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

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

  const item = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-zinc-400 mb-2">{item.business}</p>

          <h1 className="text-4xl font-bold">{item.hero}</h1>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">CTA</h2>

          <p className="text-lg leading-8">{item.cta}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Features</h2>

          <div className="space-y-3">
            {Array.isArray(item.features) &&
              item.features.map((feature, index) => (
                <div
                  key={index}
                  className="
                  bg-zinc-800
                  rounded-lg
                  p-4
                "
                >
                  {String(feature)}
                </div>
              ))}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Benefits</h2>

          <div className="space-y-3">
            {Array.isArray(item.benefits) &&
              item.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="
                  bg-zinc-800
                  rounded-lg
                  p-4
                "
                >
                  {String(benefit)}
                </div>
              ))}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">FAQ</h2>

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
                  className="
                  bg-zinc-800
                  rounded-lg
                  p-4
                "
                >
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
