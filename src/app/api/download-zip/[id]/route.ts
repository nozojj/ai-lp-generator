import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const item = await prisma.generation.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const zip = new JSZip();

  const testimonials = (
    item.testimonials as {
      name: string;
      comment: string;
    }[]
  )
    .map(
      (review) => `
      <div class="card">
        <h3>${review.name}</h3>
        <p>${review.comment}</p>
      </div>
    `,
    )
    .join("");

  const faq = (
    item.faq as {
      question: string;
      answer: string;
    }[]
  )
    .map(
      (item) => `
      <div class="card">
        <h3>${item.question}</h3>
        <p>${item.answer}</p>
      </div>
    `,
    )
    .join("");

  const features = (item.features as string[])
    .map(
      (feature) => `
      <div class="card">
        <h3>${feature}</h3>
      </div>
    `,
    )
    .join("");

  const benefits = (item.benefits as string[])
    .map(
      (benefit) => `
      <div class="card">
        <h3>${benefit}</h3>
      </div>
    `,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${item.hero}</title>

<meta name="description" content="${item.cta}" />

<meta property="og:title" content="${item.hero}" />
<meta property="og:description" content="${item.cta}" />
<meta property="og:type" content="website" />

<link rel="stylesheet" href="style.css">
<link rel="icon" href="favicon.ico" />
</head>

<body>

<section class="hero">

<img src="logo.jpg" class="logo" alt="Logo">
  <h1>${item.hero}</h1>

  <p>${item.cta}</p>

  <a class="button" href="${item.ctaUrl ?? "#"}">
    無料体験はこちら
  </a>
</section>

<section style="padding:60px">

  <h2>Features</h2>

  <div class="grid">
    ${features}
  </div>

  <h2 style="margin-top:60px">
    Benefits
  </h2>

  <div class="grid">
    ${benefits}
  </div>

</section>

<section style="padding:60px">

  <h2>お客様の声</h2>

  <div class="grid">
    ${testimonials}
  </div>

  <h2 style="margin-top:60px">
    FAQ
  </h2>

  <div class="grid">
    ${faq}
  </div>

</section>

<section class="cta-section">

  <h2>まずは無料体験から始めませんか？</h2>

  <p>
    あなたの理想の身体づくりを、今日からスタートしましょう。
  </p>

  <a class="button" href="${item.ctaUrl ?? "#"}">
    無料体験はこちら
  </a>

</section>

<footer>

  <p>© 2026 AI LP Generator</p>

</footer>

</body>
</html>
`;

  zip.file("index.html", html);

  let hasHeroImage = false;

  try {
    const logoResponse = await fetch(new URL("/logo.jpg", request.url));

    if (logoResponse.ok) {
      const logoBuffer = await logoResponse.arrayBuffer();

      zip.file("logo.jpg", logoBuffer);
    }
  } catch (error) {
    console.error("Logo download failed:", error);
  }

  try {
    const faviconResponse = await fetch(new URL("/favicon.ico", request.url));

    if (faviconResponse.ok) {
      const faviconBuffer = await faviconResponse.arrayBuffer();

      zip.file("favicon.ico", faviconBuffer);
    }
  } catch (error) {
    console.error("Favicon download failed:", error);
  }

  if (item.imageUrl) {
    try {
      const imageResponse = await fetch(item.imageUrl);

      if (!imageResponse.ok) {
        console.error(`Failed to fetch hero image: ${imageResponse.status}`);
      } else {
        const imageBuffer = await imageResponse.arrayBuffer();

        zip.file("hero.jpg", imageBuffer);

        hasHeroImage = true;
      }
    } catch (error) {
      console.error("Hero image download failed:", error);
    }
  }

  const heroBackground = hasHeroImage
    ? `url("hero.jpg") center/cover no-repeat`
    : "#0f172a";

  let css = "";

  if (item.template === "modern") {
    css = `
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#0f172a;
  color:white;
  line-height:1.6;
}

.hero{
  padding:120px 20px;
  text-align:center;
  height:90vh;

  background:
    linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
    ${heroBackground};
}

.hero h1{
  font-size:48px;
  margin-bottom:20px;
}

.hero p{
  font-size:20px;
  max-width:700px;
  margin:0 auto 30px;
}

.button{
  display:inline-block;
  padding:14px 28px;
  background:#2563eb;
  color:white;
  text-decoration:none;
  border-radius:10px;
  font-weight:bold;
}

.button:hover{
  background:#1d4ed8;
}

section{
  max-width:1200px;
  margin:auto;
}

h2{
  font-size:32px;
  margin-bottom:24px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:24px;
}

.card{
  background:white;
  color:#111827;
  border-radius:16px;
  padding:24px;
  box-shadow:0 10px 25px rgba(0,0,0,.15);
}

.logo{
  width:80px;
  height:80px;
  margin-bottom:30px;
}

.cta-section{
  padding:100px 20px;
  text-align:center;
}

footer{
  margin-top:80px;
  padding:40px 20px;
  text-align:center;
  color:#94a3b8;
  border-top:1px solid rgba(255,255,255,.1);
}
`;
  }

  if (item.template === "luxury") {
    css = `
body{
  margin:0;
  font-family:Georgia, serif;
  background:#0b0b0b;
  color:#f8e7b0;
  line-height:1.6;
}

.hero{
  padding:120px 20px;
  text-align:center;
  height:90vh;

  background:
  linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)),
  ${heroBackground};
}

.hero h1{
  font-size:48px;
  margin-bottom:20px;
}

.hero p{
  font-size:20px;
  max-width:700px;
  margin:0 auto 30px;
}

.button{
  display:inline-block;
  padding:14px 28px;
  background:#d4af37;
  color:#000;
  text-decoration:none;
  border-radius:10px;
  font-weight:bold;
}

.button:hover{
  background:#f0c64f;
}

section{
  max-width:1200px;
  margin:auto;
}

h2{
  font-size:32px;
  margin-bottom:24px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:24px;
}

.card{
  background:#1b1b1b;
  color:#fff;
  border:1px solid #d4af37;
  border-radius:16px;
  padding:24px;
  box-shadow:0 10px 25px rgba(0,0,0,.35);
}

.logo{
  width:80px;
  height:80px;
  margin-bottom:30px;
}

.cta-section{
  padding:100px 20px;
  text-align:center;
}

footer{
  margin-top:80px;
  padding:40px 20px;
  text-align:center;
  color:#d4af37;
  border-top:1px solid rgba(212,175,55,.3);
}
`;
  }

  zip.file("style.css", css);

  const readme = `
AI LP Generator

このLPはAI LP Generatorで生成されました。

==========================
■ ファイル構成
==========================

index.html ・・・ LP本体
style.css ・・・ デザイン
hero.jpg ・・・ メイン画像
logo.jpg ・・・ ロゴ画像

==========================
■ 使い方
==========================

1. ZIPを解凍します。
2. index.html をブラウザで開きます。
3. index.html・style.css・hero.jpg・logo.jpg を
   同じフォルダに置いてください。

==========================
■ 公開方法
==========================

GitHub Pages
Vercel
Netlify

などにアップロードすると公開できます。

Generated by AI LP Generator

Generated:
${new Date().toLocaleString("ja-JP")}
`;

  zip.file("README.txt", readme);

  const content = await zip.generateAsync({
    type: "uint8array",
  });

  const arrayBuffer = content.buffer.slice(
    content.byteOffset,
    content.byteOffset + content.byteLength,
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="lp-${id}.zip"`,
    },
  });
}
