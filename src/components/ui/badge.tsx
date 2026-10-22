import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-apple-gray-100 text-apple-gray-900 dark:bg-apple-gray-800 dark:text-white",
        secondary:
          "bg-apple-gray-100 text-apple-gray-900 dark:bg-apple-gray-800 dark:text-white",
        destructive:
          "bg-apple-red-100 text-apple-red-700 dark:bg-apple-red-900/30 dark:text-apple-red-400",
        success:
          "bg-apple-green-100 text-apple-green-700 dark:bg-apple-green-900/30 dark:text-apple-green-400",
        warning:
          "bg-apple-yellow-100 text-apple-yellow-700 dark:bg-apple-yellow-900/30 dark:text-apple-yellow-400",
        info:
          "bg-apple-blue-100 text-apple-blue-700 dark:bg-apple-blue-900/30 dark:text-apple-blue-400",
        outline:
          "border border-apple-gray-300 text-apple-gray-700 dark:border-apple-gray-600 dark:text-apple-gray-300",
        solar:
          "bg-apple-gray-900 text-white dark:bg-white dark:text-apple-gray-900",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { Badge, badgeVariants }