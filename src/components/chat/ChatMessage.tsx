'use client'

import { MessageItem } from './types'
import { ConfirmationCard } from './ConfirmationCard'
import ReactMarkdown from 'react-markdown'
import { Bot, User } from 'lucide-react'

export function ChatMessage({ message, onConfirm }: { message: MessageItem, onConfirm?: () => void }) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>

                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-emerald-400'
                    }`}>
                    {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                <div className="flex flex-col gap-1 w-full relative">
                    {message.content && (
                        <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed relative ${isUser
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                            }`}>
                            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-gray'}`}>
                                <ReactMarkdown
                                    components={{
                                        p({ node, children, ...props }: any) { return <p className="mb-2 last:mb-0 text-inherit" {...props}>{children}</p> },
                                        strong({ node, children, ...props }: any) { return <strong className={isUser ? "text-white opacity-90" : "font-semibold text-gray-900"} {...props}>{children}</strong> },
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            {message.isStreaming && (
                                <span className="inline-block w-1 h-[1em] ml-1 align-top bg-current animate-pulse" />
                            )}
                        </div>
                    )}

                    {/* If there's parsed AI data, show the structured card format instead/below */}
                    {message.metadata?.transaction && (
                        <div className="mt-1 w-full max-w-sm">
                            <ConfirmationCard
                                data={message.metadata}
                                messageId={message.id}
                                onConfirm={onConfirm}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
