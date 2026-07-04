import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        blue: "border-blue-500/30 bg-blue-500/20 text-blue-300",
        purple: "border-purple-500/30 bg-purple-500/20 text-purple-300",
        amber: "border-amber-500/30 bg-amber-500/20 text-amber-300",
        slate: "border-slate-500/30 bg-slate-700/30 text-slate-200",
        gray: "border-gray-400/30 bg-gray-500/20 text-gray-300",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
