import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { canAccessOwnerGatedFeature } from "@/lib/access";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canAccessOwnerGatedFeature(userId)) {
    return NextResponse.json(
      { error: "現在はベータ版のためオーナーのみ利用可能です" },
      { status: 403 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    metadata: {
      clerkId: userId,
    },
    line_items: [
      {
        price_data: {
          currency: "jpy",

          product_data: {
            name: "AI LP Generator Pro",
          },

          unit_amount: 980,
        },

        quantity: 1,
      },
    ],

    mode: "payment",

    success_url: `${appUrl}/success`,

    cancel_url: `${appUrl}/pricing`,
  });

  return NextResponse.json({
    url: session.url,
  });
}
