import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Webhook hit");

  const body = await req.text();

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    console.log("No signature");

    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    console.log("Event type:", event.type);
  } catch (error) {
    console.log("Webhook Error:", error);

    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout completed");

    const session = event.data.object;

    console.log("Metadata:", session.metadata);

    const clerkId = session.metadata?.clerkId;

    console.log("Clerk ID:", clerkId);

    if (clerkId) {
      await prisma.user.update({
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

      console.log("Credits added");
    }
  }

  return NextResponse.json({
    received: true,
  });
}
