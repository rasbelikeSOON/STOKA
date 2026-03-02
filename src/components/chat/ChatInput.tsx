'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useChatStore } from '@/stores/useChatStore'

export function ChatInput({ onSendMessage }: { onSendMessage: (msg: string) => void }) {
    const [input, setInput] = useState('')
    const { isStreaming } = useChatStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isStreaming) return
        onSendMessage(input)
        setInput('')
    }

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4 pb-safe flex items-end relative">
            <div className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden flex shadow-sm items-end pr-2 transition-shadow">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message or describe a transaction..."
                    className="w-full max-h-32 min-h-[44px] py-3 px-4 bg-transparent border-none appearance-none resize-none focus:outline-none focus:ring-0 text-sm"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                        }
                    }}
                />
                <div className="py-2">
                    <button
                        type="submit"
                        disabled={!input.trim() || isStreaming}
                        className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                    >
                        {isStreaming ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 ml-[-2px] mt-[1px]" />
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
