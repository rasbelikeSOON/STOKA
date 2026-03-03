export function TypingIndicator() {
    return (
        <div className="flex items-center gap-1.5 px-4 py-3 bg-[--surface-muted] rounded-2xl rounded-tl-none w-fit animate-in fade-in duration-300">
            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[--brand-primary] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[--brand-primary] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[--brand-primary] rounded-full animate-bounce" />
            </div>
        </div>
    )
}
