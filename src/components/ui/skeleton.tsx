import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-apple-gray-200 dark:bg-apple-gray-700", className)}
      {...props}
    />
  )
}

export { Skeleton }