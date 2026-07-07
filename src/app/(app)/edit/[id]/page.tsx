import EditForm from "@/components/EditForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditPage({
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

  return (
    <main className="min-h-screen p-8 text-foreground">
      <h1 className="mb-8 text-4xl font-bold">LP編集</h1>

      <EditForm
        id={item.id}
        hero={item.hero}
        cta={item.cta}
        ctaUrl={item.ctaUrl}
        template={item.template}
        imageUrl={item.imageUrl}
        features={item.features as string[]}
        benefits={item.benefits as string[]}
        faq={
          item.faq as {
            question: string;
            answer: string;
          }[]
        }
        testimonials={
          item.testimonials as {
            name: string;
            comment: string;
          }[]
        }
      />
    </main>
  );
}
