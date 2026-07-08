import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center rounded-xl border p-12 text-center shadow-sm">
      {Icon && (
        <div className="bg-muted text-muted-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <Icon className="h-7 w-7" />
        </div>
      )}

      <h2 className="text-foreground text-2xl font-bold">{title}</h2>

      <p className="text-muted-foreground mt-2 max-w-sm">{description}</p>

      {actionLabel && actionHref && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
