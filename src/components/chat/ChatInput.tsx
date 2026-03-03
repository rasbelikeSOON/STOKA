'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Paperclip, Mic } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ChatInput({
    onSendMessage,
    disabled = false
}: {
    onSendMessage: (msg: string) => void,
    disabled?: boolean
}) {
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false) // Local sync or props? useChatStore is better
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [input])

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || disabled) return
        onSendMessage(input)
        setInput('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const placeholder = disabled ? "Neural link establishing..." : "Say something like 'Sold 2 Shampoos'..."

    return (
        <form
            onSubmit={handleSubmit}
            className="relative group animate-in slide-in-from-bottom-4 duration-700"
        >
            <div className="relative flex items-end gap-2 p-2 bg-white border border-[--border] rounded-[24px] shadow-xl shadow-blue-500/5 focus-within:border-[#1D4ED8] focus-within:ring-4 focus-within:ring-[#1D4ED8]/5 transition-all duration-300">
                <button
                    type="button"
                    className="p-3 text-[--text-muted] hover:text-[#1D4ED8] hover:bg-blue-50 rounded-2xl transition-all"
                >
                    <Paperclip className="h-5 w-5" />
                </button>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-bold text-[--text-primary] py-3 px-2 resize-none max-h-40 placeholder:text-[--text-muted] placeholder:font-medium"
                />
                <button
                    type="button"
                    className="p-3 text-[--text-muted] hover:text-[#1D4ED8] hover:bg-blue-50 rounded-2xl transition-all"
                >
                    <Mic className="h-5 w-5" />
                </button>
                <button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    className={cn(
                        "p-3 rounded-2xl transition-all duration-300 shadow-lg",
                        input.trim() && !disabled
                            ? "bg-[#1D4ED8] text-white shadow-blue-500/30 scale-100 hover:scale-105"
                            : "bg-gray-100 text-gray-400 scale-95 opacity-50"
                    )}
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </form>
    )
}
