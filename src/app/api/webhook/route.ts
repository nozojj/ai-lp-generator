import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";


export async function POST(req: Request) {
  const body = await req.text();

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await prisma.webhookEvent.create({
        data: { stripeEventId: event.id },
      });
    } catch {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const clerkId = session.metadata?.clerkId;

    if (clerkId) {
      const user = await prisma.user.update({
        where: {
          clerkId,
        },
        data: {
          credits: {
            increment: 100,
          },
          isPro: true,
        },
      });

      await prisma.creditHistory.create({
        data: {
          userId: user.id,
          amount: 100,
          reason: "Pro加入",
        },
      });
    }
  }

  if (event.type === "charge.refunded") {
    try {
      await prisma.webhookEvent.create({
        data: { stripeEventId: event.id },
      });
    } catch {
      return NextResponse.json({ received: true });
    }

    const charge = event.data.object;
    const clerkId = charge.metadata?.clerkId;

    if (clerkId) {
      const existing = await prisma.user.findUnique({
        where: {
          clerkId,
        },
      });

      if (existing) {
        const user = await prisma.user.update({
          where: {
            clerkId,
          },
          data: {
            credits: Math.max(0, existing.credits - 100),
            isPro: false,
          },
        });

        await prisma.creditHistory.create({
          data: {
            userId: user.id,
            amount: -100,
            reason: "返金",
          },
        });
      }
    }
  }

  return NextResponse.json({
    received: true,
  });
}
