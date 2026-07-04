import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function getTemplateBadgeVariant(template: string): BadgeVariant {
  switch (template) {
    case "luxury":
      return "amber";
    case "minimal":
      return "gray";
    case "corporate":
      return "slate";
    default:
      return "blue";
  }
}
