import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { processMessage } from '@/lib/ai/processMessage'
import { executeAction } from '@/lib/ai/executeAction'
import { executeQuery, formatQueryResponse } from '@/lib/ai/executeQuery'
import { saveMemoryCandidates } from '@/lib/db/memories'
import { saveChatMessage } from '@/lib/db/chat'

export async function POST(req: NextRequest) {
    try {
        const { message, conversationHistory = [], businessId, confirmed, pendingAction } = await req.json()

        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: { getAll() { return cookieStore.getAll() }, setAll() { } }
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Validate business access
        const { data: member } = await supabase.from('business_members').select('id').eq('business_id', businessId).eq('user_id', user.id).single()
        if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        // --- PATH A: User is confirming a pending action ---
        if (confirmed && pendingAction) {
            const result = await executeAction(pendingAction, businessId, user.id)

            // Save memory candidates from this confirmed transaction
            if (pendingAction.memory_candidates?.length > 0) {
                await saveMemoryCandidates(businessId, pendingAction.memory_candidates)
            }

            await saveChatMessage(businessId, user.id, 'assistant', result.successMessage, 'system')

            return NextResponse.json({
                type: 'action_complete',
                message: result.successMessage,
                proactive_insight: result.insight ?? null
            })
        }

        // --- PATH B: Processing a new user message ---

        // Save the user message first
        await saveChatMessage(businessId, user.id, 'user', message, 'text')

        // Process message through Groq LLM
        const aiResponse = await processMessage(message, conversationHistory, businessId, user.id)

        // Handle query intents — execute immediately, no confirmation needed
        if (aiResponse.action.type === 'ANSWER_QUERY' ||
            aiResponse.action.type === 'RUN_ANALYSIS' ||
            aiResponse.action.type === 'GENERATE_REPORT' ||
            (!aiResponse.action.type && aiResponse.query.type)) {

            const queryResult = await executeQuery(aiResponse.query, businessId)
            const fullResponse = formatQueryResponse(aiResponse.response_message, queryResult)

            await saveChatMessage(businessId, user.id, 'assistant', fullResponse.text, 'text', { data: queryResult.data })

            return NextResponse.json({
                type: 'query_response',
                message: fullResponse.text,
                data: queryResult.data,
                response_format: fullResponse.format // 'text' | 'table' | 'chart'
            })
        }

        // Handle clarification needed
        if (aiResponse.needs_clarification || aiResponse.action.type === 'CLARIFY') {
            const question = aiResponse.clarification_question || aiResponse.response_message || "Could you clarify that?"
            await saveChatMessage(businessId, user.id, 'assistant', question, 'text')
            return NextResponse.json({
                type: 'clarification',
                message: question,
            })
        }

        // Handle general chat (greetings, small talk)
        if (aiResponse.action.type === 'GENERAL_CHAT' || !aiResponse.action.type) {
            const text = aiResponse.response_message || "I'm Stoka! How can I help with your inventory today?"
            await saveChatMessage(businessId, user.id, 'assistant', text, 'text')
            return NextResponse.json({
                type: 'general',
                message: text,
            })
        }

        // Handle action intents — show confirmation card, wait for user to confirm
        await saveChatMessage(businessId, user.id, 'assistant', aiResponse.response_message, 'confirmation_card', {
            confirmation_card: aiResponse.confirmation_card,
            pending_action: aiResponse.action,
            memory_candidates: aiResponse.memory_candidates
        })

        return NextResponse.json({
            type: 'confirmation_required',
            message: aiResponse.response_message,
            intent_summary: aiResponse.intent_summary,
            confirmation_card: aiResponse.confirmation_card,
            pending_action: aiResponse.action,
            memory_candidates: aiResponse.memory_candidates,
            proactive_insight: aiResponse.proactive_insight?.show ? aiResponse.proactive_insight : null
        })

    } catch (error: any) {
        console.error('Chat API error:', error)
        // Return 200 so the frontend shows the error as a chat message gracefully
        return NextResponse.json({
            type: 'error',
            message: "I had a bit of trouble processing that just now. Could you try again?"
        })
    }
}
