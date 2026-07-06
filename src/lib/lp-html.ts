import { escapeHtml } from "@/lib/utils";

export function renderCardList(items: string[]): string {
  return items
    .map(
      (item) => `
      <div class="card">
        <h3>${escapeHtml(item)}</h3>
      </div>
    `,
    )
    .join("");
}

export function renderTestimonials(
  items: { name: string; comment: string }[],
): string {
  return items
    .map(
      (review) => `
      <div class="card">
        <h3>${escapeHtml(review.name)}</h3>
        <p>${escapeHtml(review.comment)}</p>
      </div>
    `,
    )
    .join("");
}

export function renderFaq(
  items: { question: string; answer: string }[],
): string {
  return items
    .map(
      (item) => `
      <div class="card">
        <h3>${escapeHtml(item.question)}</h3>
        <p>${escapeHtml(item.answer)}</p>
      </div>
    `,
    )
    .join("");
}
