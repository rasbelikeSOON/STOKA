'use client'

import { MessageItem } from './types'
import { ConfirmationCard } from './ConfirmationCard'
import { Bot, User, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ChatMessage({
    message,
    onConfirm
}: {
    message: MessageItem,
    onConfirm?: (data: any) => void
}) {
    const isUser = message.role === 'user'

    return (
        <div className={cn(
            "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "flex max-w-[85%] sm:max-w-[75%] gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border mt-1",
                    isUser
                        ? "bg-[--brand-primary] border-[--brand-primary] text-white"
                        : message.messageType === 'insight_card'
                            ? "bg-amber-100 border-amber-200 text-amber-600"
                            : "bg-white border-[--border] text-[--brand-primary]"
                )}>
                    {isUser ? <User className="h-4 w-4" /> : message.messageType === 'insight_card' ? <Lightbulb className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Content */}
                <div className={cn(
                    "flex flex-col gap-2",
                    isUser ? "items-end" : "items-start",
                    "w-full"
                )}>
                    {/* Text Bubble (Skip for pure confirmation cards if they have no text) */}
                    {message.content && (
                        <div className={cn(
                            "px-5 py-3.5 rounded-2xl text-[14px] font-bold leading-relaxed shadow-sm transition-all text-left",
                            isUser
                                ? "bg-[#1D4ED8] text-white rounded-tr-none shadow-blue-500/10"
                                : message.messageType === 'insight_card'
                                    ? "bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-none"
                                    : "bg-white border border-[--border] text-[--text-primary] rounded-tl-none"
                        )}>
                            <p>{message.content}</p>
                            {message.isStreaming && (
                                <span className="inline-block w-1.5 h-1.5 ml-1 bg-current rounded-full animate-bounce" />
                            )}
                        </div>
                    )}

                    {/* Action Confirmation Card */}
                    {message.messageType === 'confirmation_card' && message.metadata && (
                        <div className="w-full min-w-[300px] mt-1">
                            <ConfirmationCard
                                data={message.metadata}
                                onConfirm={(data) => onConfirm?.(data)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
