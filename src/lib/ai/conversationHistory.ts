import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getConversationHistory(businessId: string, limit = 20) {
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

    const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error || !messages) return []

    // Reverse to get chronological order for Claude
    return messages.reverse().map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user', // Ensure strict typing for Anthropic API
        content: m.content
    }))
}

export async function saveMessage(businessId: string, userId: string, role: string, content: string, metadata: any = {}, transactionId: string | null = null) {
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

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            business_id: businessId,
            user_id: userId,
            role,
            content,
            metadata,
            transaction_id: transactionId
        })
        .select()
        .single()

    if (error) {
        console.error('Failed to save message:', error)
    }

    return data
}
