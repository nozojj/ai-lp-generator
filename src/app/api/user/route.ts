import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      const clerkUser = await currentUser();

      try {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            name: clerkUser?.fullName ?? null,
          },
        });
      } catch {
        // Another concurrent request created the row first — fetch it.
        user = await prisma.user.findUnique({ where: { clerkId: userId } });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({
      credits: user.credits,
      isPro: user.isPro,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
