import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/utils";
import { renderCardList, renderTestimonials, renderFaq } from "@/lib/lp-html";

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

  const benefits = renderCardList(item.benefits as string[]);
  const features = renderCardList(item.features as string[]);
  const testimonials = renderTestimonials(
    item.testimonials as { name: string; comment: string }[],
  );
  const faq = renderFaq(item.faq as { question: string; answer: string }[]);

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(item.hero)}</title>
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
    url('${(item.imageUrl ?? "").replace(/'/g, "%27")}') center/cover;
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
  <h1>${escapeHtml(item.hero)}</h1>
  <p>${escapeHtml(item.cta)}</p>

  <a
    class="button"
    href="${escapeHtml(item.ctaUrl ?? "#")}"
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
