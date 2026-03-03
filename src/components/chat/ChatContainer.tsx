'use client'

import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Loader2, Bot } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { useChatStore } from '@/stores/useChatStore'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { MessageItem } from './types'
import { AIResponse } from '@/lib/ai/schemas'

export function ChatContainer() {
    const {
        messages,
        addMessage,
        setStreaming,
        setMessages,
        isStreaming
    } = useChatStore()

    const { businessId, user, isLoading, error: contextError } = useBusinessContext()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Scroll to bottom on updates
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isStreaming])

    // Load initial history
    useEffect(() => {
        if (!businessId) return

        async function loadHistory() {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('business_id', businessId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (!error && data) {
                setMessages(data.reverse().map((d: any) => ({
                    id: d.id,
                    role: d.role as any,
                    content: d.content,
                    messageType: d.message_type as any,
                    metadata: d.metadata as any
                })))
            }
        }
        loadHistory()
    }, [businessId, supabase, setMessages])

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isStreaming) return

        if (!businessId) {
            toast.error('Initialization error. Please try refreshing.')
            return
        }

        const userMsgId = uuidv4()
        const userMsg: MessageItem = { id: userMsgId, role: 'user', content: text }
        addMessage(userMsg)

        setStreaming(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, businessId, conversationHistory: messages.map(m => ({ role: m.role, content: m.content })) }),
            })

            const aiResponse = await response.json()

            // If it's a standard text response, just add it.
            if (aiResponse.type === 'error' || aiResponse.type === 'general' || aiResponse.type === 'clarification') {
                addMessage({
                    id: uuidv4(), role: 'assistant', content: aiResponse.message, messageType: 'text'
                })
            }
            else if (aiResponse.type === 'query_response') {
                addMessage({
                    id: uuidv4(), role: 'assistant', content: aiResponse.message, messageType: 'text',
                    metadata: { data: aiResponse.data, format: aiResponse.response_format } // Could render tables here later
                })
            }
            else if (aiResponse.type === 'confirmation_required') {
                addMessage({
                    id: uuidv4(), role: 'assistant', content: aiResponse.message, messageType: 'confirmation_card',
                    metadata: aiResponse // Contains confirmation_card, pending_action, memory_candidates, proactive_insight
                })
            }

            setStreaming(false)
        } catch (error) {
            console.error(error)
            toast.error('AI is offline. Please try again later.')
            setStreaming(false)
        }
    }

    const handleConfirmAction = async (aiMetadata: any) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessId,
                    confirmed: true,
                    pendingAction: aiMetadata.pending_action
                }),
            })

            const data = await response.json()

            if (!response.ok || data.type === 'error') {
                console.error('Confirm error details:', data)
                throw new Error(data.message || 'Confirmation failed')
            }

            toast.success('Done! Action confirmed. 🔥')

            // Optionally append the success message & proactive insight
            addMessage({
                id: uuidv4(), role: 'assistant', content: data.message, messageType: 'text'
            })

            if (data.proactive_insight?.show) {
                addMessage({
                    id: uuidv4(), role: 'assistant', content: data.proactive_insight.message, messageType: 'insight_card'
                })
            }

        } catch (error: any) {
            console.error('Confirm action error:', error)
            toast.error(error.message || 'Failed to confirm action.')
            throw error
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-[#F8FAFC] items-center justify-center p-8 text-center">
                <div className="h-20 w-20 bg-white rounded-[32px] shadow-xl border border-[--border] flex items-center justify-center mb-8 animate-bounce">
                    <Bot className="h-10 w-10 text-[#1D4ED8]" />
                </div>
                <h3 className="text-xl font-black text-[--text-primary] tracking-tight mb-2">Connecting...</h3>
                <p className="text-[--text-muted] font-bold max-w-xs mx-auto text-sm animate-pulse">Establishing neural link to inventory...</p>
            </div>
        )
    }

    if (contextError) {
        return (
            <div className="flex flex-col h-full bg-[#F8FAFC] items-center justify-center p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Access Restricted</h3>
                <p className="text-[--text-muted] max-w-xs mx-auto text-sm font-medium">{contextError.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="h-12 px-8 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC]">
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[--border] sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded-2xl flex items-center justify-center font-black">
                        AI
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[--text-primary] tracking-tight">Stoka Assistant</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest leading-none">Neural Engine Active</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-[--border] rounded-xl shadow-sm text-[10px] font-black text-[--text-muted] uppercase tracking-widest leading-none">
                    v2.1.0 Secured
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 scroll-smooth">
                <div className="max-w-4xl mx-auto w-full">
                    {messages.length === 0 && !isStreaming && (
                        <div className="py-20 text-center animate-in fade-in duration-1000">
                            <div className="h-20 w-20 bg-white rounded-[32px] shadow-xl border border-[--border] flex items-center justify-center mx-auto mb-8 rotate-3 transition-transform hover:rotate-0">
                                <Bot className="h-10 w-10 text-[#1D4ED8]" />
                            </div>
                            <h3 className="text-3xl font-black text-[--text-primary] tracking-tight mb-3">What&apos;s on your mind?</h3>
                            <p className="text-[--text-muted] font-bold max-w-sm mx-auto text-sm leading-relaxed">
                                I can help you track sales, manage inventory, or analyze your stock levels.
                                Just say something like <span className="text-[#1D4ED8] underline decoration-blue-500/30 underline-offset-4 cursor-pointer" onClick={() => handleSendMessage("Sold 2 Shampoos")}>&ldquo;Sold 2 Shampoos&rdquo;</span>
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            onConfirm={handleConfirmAction}
                        />
                    ))}

                    {isStreaming && <TypingIndicator />}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent pt-10 sticky bottom-0">
                <div className="max-w-4xl mx-auto">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={isStreaming}
                    />
                    <div className="mt-4 text-center">
                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-[0.2em]">
                            Stoka AI Engine V2.1 • Secured with Supabase
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
