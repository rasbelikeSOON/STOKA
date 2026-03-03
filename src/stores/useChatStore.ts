import { create } from 'zustand'
import { MessageItem } from '@/components/chat/types'

interface ChatState {
    messages: MessageItem[];
    isStreaming: boolean;
    addMessage: (msg: MessageItem) => void;
    updateStreamingMessage: (content: string) => void;
    updateMessageMetadata: (id: string, metadata: any) => void;
    setStreaming: (is: boolean) => void;
    setMessages: (msgs: MessageItem[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isStreaming: false,
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    updateStreamingMessage: (content) => set((state) => {
        const msgs = [...state.messages]
        const last = msgs[msgs.length - 1]
        if (last && last.role === 'assistant' && last.isStreaming) {
            last.content = content
        }
        return { messages: msgs }
    }),
    updateMessageMetadata: (id, metadata) => set((state) => ({
        messages: state.messages.map(m => m.id === id ? { ...m, metadata } : m)
    })),
    setStreaming: (isStreaming) => set((state) => {
        const msgs = [...state.messages]
        const last = msgs[msgs.length - 1]
        if (last && last.role === 'assistant' && !isStreaming) {
            last.isStreaming = false
        }
        return { isStreaming, messages: msgs }
    }),
    setMessages: (messages) => set({ messages }),
}))
