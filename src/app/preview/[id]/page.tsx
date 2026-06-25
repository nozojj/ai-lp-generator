import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Compass,
  ShieldCheck,
  Mountain,
  Sparkles,
  CheckCircle,
  HeartHandshake,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const icons = [Compass, ShieldCheck, Mountain];

  const benefitIcons = [Sparkles, CheckCircle, HeartHandshake];

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
          <h1 className="mb-6 text-3xl leading-tight font-bold md:text-5xl">
            {item.hero}
          </h1>

          <p className="mb-8 text-lg text-slate-200 md:text-xl">{item.cta}</p>

          <a
            href={item.ctaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-xl bg-blue-600 px-8 py-4 font-bold shadow-lg">
              {item.cta}
            </Button>
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-slate-300">
            <div>
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm">Users</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm">Satisfaction</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-white">24h</p>
              <p className="text-sm">Support</p>
            </div>
          </div>
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
          {(item.features as string[]).map((feature, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-700 bg-slate-800 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
              >
                <Icon className="mb-4 text-blue-400" size={36} />

                <h3 className="mb-3 text-xl font-bold">{String(feature)}</h3>

                <p className="text-slate-400">
                  AIが生成したおすすめポイントです。
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">Benefits</h2>

        <div className="space-y-4">
          {item.benefits &&
            (item.benefits as string[]).map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-700 bg-slate-800 p-8 transition duration-300 hover:-translate-y-2 hover:border-cyan-500"
                >
                  <Icon size={34} className="mb-4 text-cyan-400" />

                  <h3 className="mb-3 text-xl font-bold">{String(benefit)}</h3>

                  <p className="text-slate-400">
                    AIが分析したおすすめポイントです。
                  </p>
                </div>
              );
            })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">FAQ</h2>

        <Accordion type="single" collapsible className="w-full">
          {item.faq &&
            (
              item.faq as {
                question: string;
                answer: string;
              }[]
            ).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-slate-700 bg-slate-800 px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="leading-7 text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-5xl p-12 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-12">
          <h2 className="text-4xl font-bold text-white">{item.hero}</h2>

          <a
            href={item.ctaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="mt-8 h-14 rounded-2xl bg-white px-10 text-lg font-bold text-blue-600 shadow-xl transition hover:scale-105 hover:bg-slate-100">
              {item.cta}
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
