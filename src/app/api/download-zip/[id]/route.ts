import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const item = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const zip = new JSZip();

  // ここにHTMLを追加していく

  return NextResponse.json({
    success: true,
  });
}