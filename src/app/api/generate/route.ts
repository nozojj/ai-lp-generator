import OpenAI from "openai";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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
      user = await prisma.user.create({
        data: {
          clerkId: userId,
        },
      });
    }

    if (user.credits <= 0) {
      return NextResponse.json({ error: "クレジット不足" }, { status: 400 });
    }

    const body = await req.json();

    const prompt = `
業種: ${body.business}
ターゲット: ${body.target}
雰囲気: ${body.atmosphere}

この情報をもとに、
LP構成を作成してください。

benefitsは3個作成してください。
faqにはユーザーが気になりそうな質問と回答を3個作成してください。

以下のJSON形式のみで返してください。

{
  "hero": "",
  "cta": "",
  "features": [],
  "benefits": [],
  "faq": [
  {
    "question": "...",
    "answer": "..."
  }
]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.8,
      max_tokens: 500,

      messages: [
        {
          role: "system",
          content: "あなたはLPマーケティングに強いプロのコピーライターです。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;

    const parsed = JSON.parse(result!);

    console.log(parsed);

    await prisma.generation.create({
      data: {
        userId: user.id,

        business: body.business,
        target: body.target,
        atmosphere: body.atmosphere,

        hero: parsed.hero,
        cta: parsed.cta,

        features: parsed.features,
        benefits: parsed.benefits,
        faq: parsed.faq,
      },
    });

    await prisma.user.update({
      where: {
        clerkId: userId,
      },

      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      result: parsed,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
