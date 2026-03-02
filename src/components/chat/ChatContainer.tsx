'use client'

import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { useChatStore } from '@/stores/useChatStore'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'
import { useChatSubscription } from '@/lib/hooks/useChatSubscription'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { MessageItem } from './types'

export function ChatContainer() {
    const { messages, addMessage, updateStreamingMessage, setStreaming, setMessages, isStreaming } = useChatStore()
    const { businessId, user } = useBusinessContext()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Enable realtime updates from other team members
    useChatSubscription()

    // Load initial history
    useEffect(() => {
        if (!businessId) return

        const loadHistory = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('business_id', businessId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (!error && data) {
                setMessages(data.reverse().map(d => ({
                    id: d.id,
                    role: d.role as 'user' | 'assistant' | 'system',
                    content: d.content,
                    metadata: d.metadata
                })))
                scrollToBottom()
            }
        }
        loadHistory()
    }, [businessId, supabase, setMessages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isStreaming])

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isStreaming || !businessId) return

        const userMsg: MessageItem = { id: uuidv4(), role: 'user', content: text }
        addMessage(userMsg)

        // Add speculative assistant message
        const astMsg: MessageItem = { id: uuidv4(), role: 'assistant', content: '', isStreaming: true }
        addMessage(astMsg)
        setStreaming(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            })

            if (!response.ok || !response.body) throw new Error('API Error')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let streamBuffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const textChunk = decoder.decode(value, { stream: true })
                streamBuffer += textChunk

                updateStreamingMessage(streamBuffer)
            }

            setStreaming(false)

            // Reload history to get the actual finalized row + metadata from DB
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('business_id', businessId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (!error && data) {
                setMessages(data.reverse().map(d => ({
                    id: d.id,
                    role: d.role as 'user' | 'assistant' | 'system',
                    content: d.content,
                    metadata: d.metadata
                })))
            }

        } catch (error) {
            console.error(error)
            toast.error('Connection failed')
            setStreaming(false)
            updateStreamingMessage('Sorry, I lost connection to the server.')
        }
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">How can I help you today?</h3>
                        <p className="text-sm text-gray-500">Log a sale, record newly purchased stock, check inventory levels, or ask for insights.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <ChatMessage key={msg.id || i} message={msg} />
                    ))
                )}

                {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <div className="flex w-full justify-start">
                        <TypingIndicator />
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    )
}
