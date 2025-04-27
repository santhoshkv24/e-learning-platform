import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-white shadow-xs hover:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-primary text-white shadow-xs hover:bg-primary/90",
        accent: "bg-accent text-white shadow-xs hover:bg-accent/90",
        success: "bg-success text-white shadow-xs hover:bg-success/90",
        warning: "bg-warning text-white shadow-xs hover:bg-warning/90",
        error: "bg-error text-white shadow-xs hover:bg-error/90",
        info: "bg-info text-white shadow-xs hover:bg-info/90",
        "outline-primary": "border border-primary bg-transparent text-primary shadow-xs hover:bg-primary/10",
        "outline-secondary": "border border-secondary bg-transparent text-secondary shadow-xs hover:bg-secondary/10",
        "outline-accent": "border border-accent bg-transparent text-accent shadow-xs hover:bg-accent/10",
        "outline-success": "border border-success bg-transparent text-success shadow-xs hover:bg-success/10",
        "outline-warning": "border border-warning bg-transparent text-warning shadow-xs hover:bg-warning/10",
        "outline-error": "border border-error bg-transparent text-error shadow-xs hover:bg-error/10",
        "outline-info": "border border-info bg-transparent text-info shadow-xs hover:bg-info/10",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
