import OpenAI from "openai"
import { NextResponse } from "next/server"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const prompt = `
    業種: ${body.business}
    ターゲット: ${body.target}
    雰囲気: ${body.atmosphere}

    この情報をもとに、
    LP構成を作成してください。

    以下のJSON形式のみで返してください。

    {
      "hero": "",
      "cta": "",
      "features": []
    }
    `

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.8,
      max_tokens: 500,

      messages: [
        {
          role: "system",
          content:
            "あなたはLPマーケティングに強いプロのコピーライターです。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    return NextResponse.json({
      result: response.choices[0].message.content,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    )
  }
}