import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    type={type}
                    className={cn(
                        "flex w-full rounded-xl border border-[--border] bg-white px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--text-muted] focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-[--brand-danger] focus:ring-[--brand-danger]",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-[--brand-danger] font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
