'use client'

import { useEffect } from 'react'
import { subscribeToChatMessages } from '@/lib/supabase/realtime'
import { useChatStore } from '@/stores/useChatStore'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export function useChatSubscription() {
    const { businessId, user } = useBusinessContext()
    const { addMessage, messages } = useChatStore()

    useEffect(() => {
        if (!businessId || !user) return

        const channel = subscribeToChatMessages(businessId, (newMessage) => {
            // Don't add messages we just sent ourselves
            // Usually, optimistic updates handle our own messages
            if (newMessage.user_id !== user.id) {

                // Ensure we don't duplicate (in case optimistic update logic needs adjusting)
                const exists = messages.some(m => m.id === newMessage.id)
                if (!exists) {
                    addMessage({
                        id: newMessage.id,
                        role: newMessage.role as any,
                        content: newMessage.content,
                        metadata: newMessage.metadata
                    })
                }
            }
        })

        return () => {
            channel.unsubscribe()
        }
    }, [businessId, user, addMessage, messages])
}
