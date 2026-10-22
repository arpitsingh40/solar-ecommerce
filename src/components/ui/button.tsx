import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-200 ease-apple-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-apple-blue-600 text-white hover:bg-apple-blue-500 active:bg-apple-blue-700",
        destructive:
          "bg-apple-red-500 text-white hover:bg-apple-red-600 active:bg-apple-red-700",
        outline:
          "border border-apple-gray-200 bg-white text-apple-gray-900 hover:bg-apple-gray-50 dark:border-apple-gray-700 dark:bg-transparent dark:text-apple-gray-100 dark:hover:bg-apple-gray-800",
        secondary:
          "bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200 dark:bg-apple-gray-800 dark:text-apple-gray-100 dark:hover:bg-apple-gray-700",
        ghost:
          "bg-transparent text-apple-gray-900 hover:bg-apple-gray-100 dark:text-apple-gray-100 dark:hover:bg-apple-gray-800",
        link: "text-apple-blue-600 underline-offset-4 hover:underline dark:text-apple-blue-400",
        solar:
          "bg-apple-yellow-500 text-apple-gray-900 hover:bg-apple-yellow-600 active:bg-apple-yellow-700",
        success:
          "bg-apple-green-500 text-white hover:bg-apple-green-600 active:bg-apple-green-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
      loading: {
        true: "relative pr-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const content = asChild ? (
      children
    ) : (
      <>
        {loading && (
          <svg
            className="mr-1 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </>
    )

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }