import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Template from "@/components/templates/Template";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const item = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    return {
      title: "LP Not Found",
    };
  }

  return {
    title: item.hero,
    description: item.cta,

    openGraph: {
      title: item.hero,
      description: item.cta,
      images: item.imageUrl ? [item.imageUrl] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: item.hero,
      description: item.cta,
      images: item.imageUrl ? [item.imageUrl] : [],
    },
  };
}

export default async function LpPage({
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

  return <Template item={item} />;
}
