export type Result = {
  hero: string;
  cta: string;
  imageUrl?: string;

  features: string[];
  benefits: string[];

  testimonials: {
    name: string;
    comment: string;
  }[];

  faq: {
    question: string;
    answer: string;
  }[];
};