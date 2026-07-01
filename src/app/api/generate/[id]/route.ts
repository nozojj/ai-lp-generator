import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // ログイン確認
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // URLのid取得
  const { id } = await params;

  // LP取得
  const generation = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!generation) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  // ログインユーザー取得
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  // 本人確認
  if (!user || generation.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 削除
  await prisma.generation.delete({
    where: {
      id,
    },
  });

  // 成功
  return NextResponse.json({
    success: true,
  });
}
