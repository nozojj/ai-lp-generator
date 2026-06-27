import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

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