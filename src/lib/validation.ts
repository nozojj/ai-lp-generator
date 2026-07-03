import { z } from "zod";

export const templateSchema = z.enum([
  "modern",
  "luxury",
  "minimal",
  "corporate",
]);

export const generateSchema = z.object({
  business: z.string().trim().min(1).max(200),
  target: z.string().trim().min(1).max(200),
  atmosphere: z.string().trim().min(1).max(200),
  template: templateSchema,
});

const contentFieldsSchema = {
  hero: z.string().max(500),
  cta: z.string().max(300),
  features: z.array(z.string().max(300)).max(20),
  benefits: z.array(z.string().max(300)).max(20),
  faq: z
    .array(
      z.object({
        question: z.string().max(500),
        answer: z.string().max(2000),
      }),
    )
    .max(20),
  testimonials: z
    .array(
      z.object({
        name: z.string().max(100),
        comment: z.string().max(1000),
      }),
    )
    .max(20),
};

export const aiGenerationSchema = z.object(contentFieldsSchema);

export const editSchema = z.object({
  ...contentFieldsSchema,
  imageUrl: z.string().max(2000).optional(),
});

export const improveSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  ...contentFieldsSchema,
});
