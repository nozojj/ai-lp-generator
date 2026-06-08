import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    notFound();
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/lp/${item.id}`;

  return (
    <main className="bg-slate-950 text-white">
      <section
        className="relative flex min-h-[70vh] items-center justify-center text-center"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="mb-6 text-3xl font-bold md:text-5xl leading-tight">{item.hero}</h1>

          <p className="mb-8 text-lg text-slate-200 md:text-xl">{item.cta}</p>

          <Button className="rounded-xl bg-blue-600 px-8 py-4 font-bold shadow-lg">
            今すぐ申し込む
          </Button>
        </div>
      </section>

      <div className="mx-auto mt-6 flex max-w-5xl gap-3 px-6">
        <Link
          href={`/lp/${item.id}`}
          target="_blank"
          className="rounded-lg bg-green-600 px-4 py-2 text-white"
        >
          公開ページ
        </Link>

        <CopyButton text={publicUrl} />
      </div>

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">Features</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.isArray(item.features) &&
            item.features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6 transition hover:border-blue-500"
              >
                {String(feature)}
              </div>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">Benefits</h2>

        <div className="space-y-4">
          {Array.isArray(item.benefits) &&
            item.benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6"
              >
                {String(benefit)}
              </div>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">FAQ</h2>

        <div className="space-y-4">
          {Array.isArray(item.faq) &&
            (
              item.faq as {
                question: string;
                answer: string;
              }[]
            ).map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6"
              >
                <h3 className="font-bold">{faq.question}</h3>

                <p className="mt-2 text-slate-300">{faq.answer}</p>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
