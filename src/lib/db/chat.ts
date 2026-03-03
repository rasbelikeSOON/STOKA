import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function saveChatMessage(
    businessId: string,
    userId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    messageType: 'text' | 'confirmation_card' | 'insight_card' | 'system' = 'text',
    metadata: any = {}
) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            }
        }
    )

    const { error } = await supabase
        .from('chat_messages')
        .insert({
            business_id: businessId,
            user_id: userId,
            role,
            content,
            message_type: messageType, // Note: active schema might not have message_type, we'll fall back if needed
            metadata
        })

    if (error) {
        // Fallback for core schema which only has metadata, not message_type
        const { error: fallbackError } = await supabase
            .from('chat_messages')
            .insert({
                business_id: businessId,
                user_id: userId,
                role,
                content,
                metadata: { ...metadata, type: messageType }
            })

        if (fallbackError) {
            console.error('Failed to save chat message:', fallbackError)
        }
    }
}
