import type { Result } from "@/types/result";

export const previewResult: Result = {
  hero: "AIが作る高品質なランディングページ",
  cta: "今すぐ無料で始める",
  imageUrl: "/hero-ai.jpg",

  benefits: ["AIが最適な構成を提案", "画像も自動生成", "SEOにも対応"],

  features: [
    "LP構成を自動生成",
    "コピーライティング生成",
    "ヒーロー画像生成",
    "HTMLエクスポート",
  ],

  testimonials: [
    {
      name: "山田 太郎",
      comment: "数分でLPが完成して驚きました！",
    },
    {
      name: "佐藤 花子",
      comment: "デザインも綺麗でそのまま使えました。",
    },
    {
      name: "鈴木 一郎",
      comment: "制作時間が大幅に短縮できました。",
    },
  ],

  faq: [
    {
      question: "生成にはどれくらい時間がかかりますか？",
      answer: "通常10秒程度です。",
    },
    {
      question: "無料で使えますか？",
      answer: "無料クレジットで試せます。",
    },
  ],
};
