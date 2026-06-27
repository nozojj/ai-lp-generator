import { Generation } from "@prisma/client";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Compass,
  ShieldCheck,
  Mountain,
  Sparkles,
  CheckCircle,
  HeartHandshake,
} from "lucide-react";

type Props = {
  item: Generation;
};

export default function Template({ item }: Props) {
  const isLuxury = item.template === "luxury";
  const isMinimal = item.template === "minimal";
  const isCorporate = item.template === "corporate";

  const icons = [Compass, ShieldCheck, Mountain];

  const benefitIcons = [Sparkles, CheckCircle, HeartHandshake];

  const buttonClass = isLuxury
    ? "bg-yellow-500 text-black hover:bg-yellow-400"
    : isMinimal
      ? "bg-black text-white hover:bg-gray-800"
      : isCorporate
        ? "bg-slate-700 text-white hover:bg-slate-600"
        : "bg-blue-600 hover:bg-blue-500";

  const cardClass = isLuxury
    ? "rounded-2xl border border-yellow-500 bg-zinc-900"
    : isMinimal
      ? "rounded-2xl border border-gray-300 bg-white"
      : isCorporate
        ? "rounded-2xl border border-slate-300 bg-white"
        : "rounded-2xl border border-slate-700 bg-slate-800";

  const ctaClass = isLuxury
    ? "rounded-3xl bg-gradient-to-r from-yellow-500 to-amber-700 p-12"
    : isMinimal
      ? "rounded-3xl bg-gray-100 p-12"
      : isCorporate
        ? "rounded-3xl bg-slate-700 p-12"
        : "rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-12";

  const textClass = isMinimal ? "text-slate-700" : "text-slate-200";

  const ctaTitleClass = isMinimal ? "text-black" : "text-white";

  const ctaTextClass = isMinimal ? "text-slate-700" : "text-cyan-100";

  return (
    <main
      className={
        isLuxury
          ? "bg-black text-yellow-100"
          : isMinimal
            ? "bg-white text-black"
            : isCorporate
              ? "bg-slate-100 text-slate-900"
              : "bg-slate-950 text-white"
      }
    >
      <section
        className="relative flex min-h-[70vh] items-center justify-center text-center"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className={`absolute inset-0 ${
            isLuxury
              ? "bg-black/70"
              : isMinimal
                ? "bg-white/30"
                : isCorporate
                  ? "bg-slate-900/50"
                  : "bg-black/50"
          }`}
        />

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl">
            {item.hero}
          </h1>

          <p className={`mb-8 text-base sm:text-lg md:text-xl ${textClass}`}>
            {item.cta}
          </p>

          <a
            href={item.ctaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className={`rounded-xl px-6 py-3 font-bold shadow-lg sm:px-8 sm:py-4 ${buttonClass}`}
            >
              無料体験を予約する
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

      <section className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold">Features</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {(item.features as string[]).map((feature, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={index}
                className={`${cardClass} p-6 transition duration-300 hover:-translate-y-2 md:p-8`}
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
                  className={`${cardClass} p-6 transition duration-300 hover:-translate-y-2 md:p-8`}
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
        <h2 className="mb-6 text-3xl font-bold">お客様の声</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {item.testimonials &&
            (
              item.testimonials as {
                name: string;
                comment: string;
              }[]
            ).map((review, index) => (
              <div
                key={index}
                className={`${cardClass} p-6 transition duration-300 hover:-translate-y-2 md:p-8`}
              >
                <p className="mb-4 text-yellow-400">★★★★★</p>

                <p className="text-slate-300">「{review.comment}」</p>

                <p className="mt-4 font-bold">{review.name}</p>
              </div>
            ))}
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
                className={`${cardClass} p-6 md:p-8`}
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

      <section className="mx-auto max-w-5xl p-6 text-center md:p-12">
        <div className={ctaClass}>
          <h2 className={`text-4xl font-bold ${ctaTitleClass}`}>{item.hero}</h2>

          <p className={`mt-4 text-lg ${ctaTextClass}`}>{item.cta}</p>
          <a
            href={item.ctaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className={`mt-8 h-14 rounded-2xl px-10 text-lg font-bold transition hover:scale-105 ${buttonClass}`}
            >
              無料体験を予約する
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
