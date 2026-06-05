import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

    success_url: "http://localhost:3000/success",

    cancel_url: "http://localhost:3000/pricing",
  });

  return NextResponse.json({
    url: session.url,
  });
}
