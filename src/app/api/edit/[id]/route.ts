import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updated = await prisma.generation.update({
      where: {
        id,
      },
      data: {
        hero: body.hero,
        cta: body.cta,
        features: body.features,
        benefits: body.benefits,
        faq: body.faq,
        testimonials: body.testimonials,

        ...(body.imageUrl && {
          imageUrl: body.imageUrl,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}
