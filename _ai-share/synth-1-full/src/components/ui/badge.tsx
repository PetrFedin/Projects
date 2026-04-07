import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0 h-4 text-[9px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
        destructive:
          "border-transparent bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
        outline: "text-slate-500 border-slate-200 bg-white shadow-sm",
        success: "border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm",
        warning: "border-amber-100 bg-amber-50 text-amber-600 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
