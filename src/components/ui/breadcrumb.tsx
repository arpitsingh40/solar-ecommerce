import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  className?: string
  separator?: React.ReactNode
}

export function Breadcrumb({ items, className, separator = "/" }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center space-x-2">
            {index > 0 && (
              <span className="text-apple-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-apple-blue-600 dark:hover:text-apple-blue-400 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "font-medium text-apple-gray-900 dark:text-white",
                  item.current && "aria-current='page'"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}