import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-white rounded-2xl border border-[--border] shadow-sm p-6 overflow-hidden",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

export { Card }
