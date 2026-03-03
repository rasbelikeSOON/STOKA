import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'primary' | 'ghost' | 'danger' | 'outline'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variants = {
            primary: "bg-[--brand-primary] text-white hover:bg-[--brand-primary-hover] hover:scale-[1.02]",
            ghost: "border border-[--border] text-[--text-primary] hover:bg-[--surface-hover]",
            danger: "bg-[--brand-danger] text-white hover:opacity-90",
            outline: "border border-[--brand-primary] text-[--brand-primary] hover:bg-[--brand-primary] hover:text-white"
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
