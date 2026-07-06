import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { improveSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`improve:${userId}`, 10, 60_000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくしてから再度お試しください。" },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const parsedBody = improveSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: "入力内容が不正です" }, { status: 400 });
    }

    const body = parsedBody.data;

    const prompt = `
以下のLPを改善してください。

改善内容:
${body.prompt}

現在のLP

Hero:
${body.hero}

CTA:
${body.cta}

Features:
${JSON.stringify(body.features)}

Benefits:
${JSON.stringify(body.benefits)}

FAQ:
${JSON.stringify(body.faq)}

Testimonials:
${JSON.stringify(body.testimonials)}

必ずJSONのみ返してください。

{
  "hero": "",
  "cta": "",
  "features": [],
  "benefits": [],
  "faq": [],
  "testimonials": []
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      response_format: {
        type: "json_object",
      },

      max_tokens: 1200,

      messages: [
        {
          role: "system",
          content:
            "あなたはLP改善のプロです。JSON以外は返さないでください。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;

    const parsed = JSON.parse(result!);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "改善に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}