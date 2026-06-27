import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const OWNER_ID = process.env.OWNER_CLERK_ID;
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
          credits: userId === OWNER_ID ? 9999 : 0,
        },
      });
    }

    if (userId === OWNER_ID && user && user.credits < 9999) {
      await prisma.user.update({
        where: {
          clerkId: userId,
        },
        data: {
          credits: 9999,
        },
      });

      user.credits = 9999;
    }

    if (userId !== OWNER_ID) {
      return NextResponse.json(
        { error: "現在決済は停止中です" },
        { status: 403 },
      );
    }
    console.log("credits:", user.credits);
    console.log("isPro:", user.isPro);
    console.log("credits:", user.credits);
    console.log("clerkId:", user.clerkId);

    if (!user.isPro && user.credits <= 0) {
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

testimonialsを3件作成してください。

faqにはユーザーが気になりそうな質問と回答を3個作成してください。

以下のJSON形式のみで返してください。

{
  "hero": "",
  "cta": "",
  "features": [],
  "benefits": [],
  "testimonials": [
    {
      "name": "",
      "comment": ""
    }
  ],
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.8,
      max_tokens: 1200,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
                あなたはLPマーケティングに強いプロのコピーライターです。

                必ず有効なJSONのみを返してください。

                JSON以外の文章は一切書かないでください。

                文章は日本語で、成約率の高いLPになるように作成してください。
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;

    const cleaned = result
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned!);
    } catch (error) {
      console.error("JSON Parse Error:", cleaned);

      return NextResponse.json(
        { error: "AIが正しいJSONを返しませんでした。" },
        { status: 500 },
      );
    }

    console.log(parsed);

    const imagePromptResponse = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Create only a detailed English prompt for a professional landing page hero image. No text, no logo, photorealistic, advertising photography.",
        },
        {
          role: "user",
          content: `
        Business: ${body.business}
        Target: ${body.target}
        Atmosphere: ${body.atmosphere}

        Generate an English prompt.
        `,
        },
      ],
    });

    const imagePrompt = imagePromptResponse.choices[0].message.content || "";

    console.log("imagePrompt:", imagePrompt);

    const imageResponse = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        prompt: imagePrompt,
        output_format: "png",
      },
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      },
    );

    console.log("status:", imageResponse.status);

    console.log("image length:", imageResponse.data.length);

    const imageBase64 = Buffer.from(imageResponse.data).toString("base64");

    const imageUrl = `data:image/png;base64,${imageBase64}`;

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,

        business: body.business,
        target: body.target,
        atmosphere: body.atmosphere,

        template: body.template,

        hero: parsed.hero,
        cta: parsed.cta,
        ctaUrl: "https://example.com",

        features: parsed.features,
        benefits: parsed.benefits,
        faq: parsed.faq,
        imageUrl,
        testimonials: parsed.testimonials,
      },
    });

    if (!user.isPro) {
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
    }

    return NextResponse.json({
      id: generation.id,
      result: parsed,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
