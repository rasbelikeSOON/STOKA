import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { processTransactionEvent } from '@/lib/ai/intentHandlers'
import { AIResponseSchema } from '@/lib/ai/schemas'
import { rateLimit } from '@/lib/rateLimit'

// This endpoint is called when the user clicks 'Confirm' on a proposed AI transaction card
export async function POST(request: Request) {
    try {
        const { parsedData, messageId } = await request.json()
        if (!parsedData) return NextResponse.json({ error: 'Missing parsed AI response data' }, { status: 400 })

        // Validate structure coming back
        const validation = AIResponseSchema.safeParse(parsedData)
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid transaction data format', details: validation.error.format() }, { status: 400 })
        }

        const data = validation.data

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

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Apply Rate Limiting (10 confirmations per minute)
        const rateLimitResult = rateLimit(`confirm:${user.id}`, 10, 60 * 1000)
        if (!rateLimitResult.success) {
            return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 })
        }

        const { data: member } = await supabase
            .from('business_members')
            .select('business_id, role')
            .eq('user_id', user.id)
            .limit(1)
            .single()

        if (!member) return NextResponse.json({ error: 'No business found' }, { status: 403 })

        // Process it through intent handlers
        const result = await processTransactionEvent(member.business_id, user.id, data)

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        // Optionally update the original chat_messages row to link the transactionId
        if (messageId && result.transactionId) {
            // We use admin client here because updating another user's message might fail under strict RLS, though we should only update our own.
            const { adminAuthClient } = await import('@/lib/supabase/admin')
            await adminAuthClient
                .from('chat_messages')
                .update({ transaction_id: result.transactionId })
                .eq('id', messageId)
        }

        return NextResponse.json({ success: true, transactionId: result.transactionId })

    } catch (error: any) {
        console.error('Confirm Chat API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
