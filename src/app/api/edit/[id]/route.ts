import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { editSchema } from "@/lib/validation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const generation = await prisma.generation.findUnique({
      where: {
        id,
      },
    });

    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (generation.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = editSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: "入力内容が不正です" }, { status: 400 });
    }

    const body = parsedBody.data;

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
