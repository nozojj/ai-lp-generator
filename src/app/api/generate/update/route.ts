import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const generation = await prisma.generation.update({
      where: {
        id: body.id,
      },
      data: {
        hero: body.hero,
        cta: body.cta,
      },
    });

    return NextResponse.json(generation);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "更新に失敗しました" },
      { status: 500 }
    );
  }
}