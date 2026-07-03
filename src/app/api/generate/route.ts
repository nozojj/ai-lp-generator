import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { canAccessOwnerGatedFeature } from "@/lib/access";
import { generateSchema, aiGenerationSchema } from "@/lib/validation";
import { supabase } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OWNER_ID = process.env.OWNER_CLERK_ID;

async function refundCredit(userDbId: string) {
  await prisma.user
    .update({
      where: { id: userDbId },
      data: { credits: { increment: 1 } },
    })
    .catch((error) => console.error("Failed to refund credit:", error));
}

export async function POST(req: Request) {
  let reservedUserDbId: string | null = null;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`generate:${userId}`, 5, 60_000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくしてから再度お試しください。" },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
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
            credits: userId === OWNER_ID ? 9999 : 0,
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

    if (userId === OWNER_ID && user.credits < 9999) {
      user = await prisma.user.update({
        where: {
          clerkId: userId,
        },
        data: {
          credits: 9999,
        },
      });
    }

    if (!canAccessOwnerGatedFeature(userId)) {
      return NextResponse.json(
        { error: "現在はベータ版のためオーナーのみ利用可能です" },
        { status: 403 },
      );
    }

    const parsedBody = generateSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "入力内容が不足しています" },
        { status: 400 },
      );
    }

    const body = parsedBody.data;

    // Atomically reserve one credit before doing any paid API work, so two
    // concurrent requests can't both pass a stale credits > 0 check and
    // drive the balance negative.
    if (!user.isPro) {
      const reserved = await prisma.user.updateMany({
        where: {
          id: user.id,
          credits: { gt: 0 },
        },
        data: {
          credits: { decrement: 1 },
        },
      });

      if (reserved.count === 0) {
        return NextResponse.json({ error: "クレジット不足" }, { status: 402 });
      }

      reservedUserDbId = user.id;
    }

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
      const validated = aiGenerationSchema.parse(JSON.parse(cleaned!));

      parsed = validated;
    } catch (error) {
      console.error("AI response validation failed:", error, cleaned);

      if (reservedUserDbId) {
        await refundCredit(reservedUserDbId);
      }

      return NextResponse.json(
        { error: "AIが正しいJSONを返しませんでした。" },
        { status: 500 },
      );
    }

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

    let imageUrl: string | null = null;

    if (imageResponse.status === 200) {
      const fileName = `${user.id}-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("lp-images")
        .upload(`public/${fileName}`, Buffer.from(imageResponse.data), {
          contentType: "image/png",
        });

      if (uploadError) {
        console.error("Hero image upload failed:", uploadError);
      } else {
        const { data } = supabase.storage
          .from("lp-images")
          .getPublicUrl(`public/${fileName}`);

        imageUrl = data.publicUrl;
      }
    } else {
      console.error("Stability AI request failed:", imageResponse.status);
    }

    let generation;

    if (!user.isPro) {
      const result = await prisma.$transaction(async (tx) => {
        const generation = await tx.generation.create({
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

        await tx.creditHistory.create({
          data: {
            userId: user.id,
            amount: -1,
            reason: "LP生成",
          },
        });

        return generation;
      });

      generation = result;
    } else {
      generation = await prisma.generation.create({
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

      await prisma.creditHistory.create({
        data: {
          userId: user.id,
          amount: 0,
          reason: "ProプランでLP生成",
        },
      });
    }

    return NextResponse.json({
      id: generation.id,
      result: parsed,
    });
  } catch (error) {
    console.error(error);

    if (reservedUserDbId) {
      await refundCredit(reservedUserDbId);
    }

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
