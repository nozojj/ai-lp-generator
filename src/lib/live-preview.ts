import type { Result } from "@/types/result";
import { previewResult } from "@/constants/preview-result";

export function buildLivePreview(
  business: string,
  target: string,
  atmosphere: string,
): Result {
  if (!business && !target && !atmosphere) {
    return previewResult;
  }

  const biz = business || "あなたのビジネス";
  const tgt = target || "お客様";
  const mood = atmosphere ? `${atmosphere}な` : "";

  return {
    ...previewResult,
    hero: `${tgt}に選ばれる、${mood}${biz}のLP`,
    cta: atmosphere ? `${atmosphere}な体験を今すぐ` : previewResult.cta,
  };
}
