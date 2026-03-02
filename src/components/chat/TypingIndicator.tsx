import { Loader2 } from 'lucide-react'

export function TypingIndicator() {
    return (
        <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-900 border border-gray-200">
            <div className="flex space-x-1.5 items-center justify-center py-2 h-6">
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}
