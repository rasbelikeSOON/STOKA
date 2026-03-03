import { createClient } from '@/lib/supabase/client'

export function subscribeToChatMessages(businessId: string, onMessage: (payload: any) => void) {
    const supabase = createClient()

    return supabase
        .channel(`chat_messages:business_id=eq.${businessId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `business_id=eq.${businessId}`
            },
            (payload: any) => {
                onMessage(payload.new)
            }
        )
        .subscribe()
}
