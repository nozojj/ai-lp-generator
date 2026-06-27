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

  const benefits = (item.benefits as string[])
    .map(
      (benefit) => `
      <div class="card">
        <h3>${benefit}</h3>
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

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${item.hero}</title>
<style>
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#0f172a;
  color:white;
}
.hero{
  position:relative;
  padding:120px 20px;
  text-align:center;
  background:
    linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),
    url('${item.imageUrl}') center/cover;
}
.hero h1{
  font-size:48px;
}
.hero p{
  font-size:20px;
}
.button{
  display:inline-block;
  margin-top:30px;
  padding:14px 28px;
  background:#2563eb;
  color:white;
  text-decoration:none;
  border-radius:10px;
}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:20px;
  margin-top:40px;
}
.card{
  background:white;
  color:#111827;
  border-radius:16px;
  padding:24px;
  box-shadow:0 10px 25px rgba(0,0,0,.15);
}
  h2{
  font-size:32px;
  margin-bottom:20px;
}
</style>
</head>
<body>

<section class="hero">
  <h1>${item.hero}</h1>
  <p>${item.cta}</p>

  <a
    class="button"
    href="${item.ctaUrl ?? "#"}"
  >
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

</body>
</html>
`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="${id}.html"`,
    },
  });
}
