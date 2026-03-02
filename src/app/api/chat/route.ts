import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import anthropic from '@/lib/ai/anthropic'
import { buildSystemPrompt } from '@/lib/ai/systemPrompt'
import { getConversationHistory, saveMessage } from '@/lib/ai/conversationHistory'
import { parseClaudeResponse } from '@/lib/ai/parseResponse'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: Request) {
    try {
        const { message, transactionId } = await request.json()
        if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

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

        // Apply Rate Limiting (20 requests per minute)
        const rateLimitResult = rateLimit(user.id, 20, 60 * 1000)
        if (!rateLimitResult.success) {
            return new Response('Rate limit exceeded. Please try again in a minute.', { status: 429 })
        }

        const { data: member } = await supabase
            .from('business_members')
            .select('business_id, role')
            .eq('user_id', user.id)
            .limit(1)
            .single()

        if (!member) return NextResponse.json({ error: 'No business found' }, { status: 403 })
        const businessId = member.business_id

        // 1. Save user message
        await saveMessage(businessId, user.id, 'user', message, {}, transactionId)

        // 2. Fetch context & history
        const systemPrompt = await buildSystemPrompt(businessId)
        const history = await getConversationHistory(businessId, 20)

        // Append new message for Claude
        history.push({ role: 'user', content: message })

        // 3. Setup Streaming Response
        const encoder = new TextEncoder()
        const stream = new TransformStream()
        const writer = stream.writable.getWriter()

            // Pass request to background to stream
            ; (async () => {
                let fullResponse = ''

                try {
                    const responseStream = await anthropic.messages.stream({
                        model: 'claude-3-7-sonnet-20250219',
                        max_tokens: 1024,
                        system: systemPrompt,
                        messages: history as any, // TS alignment
                    })

                    for await (const chunk of responseStream) {
                        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                            const text = chunk.delta.text
                            fullResponse += text
                            await writer.write(encoder.encode(text))
                        }
                    }

                    // When done streaming, parse and save
                    const parsed = parseClaudeResponse(fullResponse)

                    // Save assistant message structure
                    if (parsed.success) {
                        await saveMessage(businessId, user.id, 'assistant', fullResponse, parsed.data)
                    } else {
                        // Provide fallback validation in metadata
                        await saveMessage(businessId, user.id, 'assistant', fullResponse, { error: 'Failed to parse JSON', raw: fullResponse })
                    }

                } catch (err) {
                    console.error('Streaming error:', err)
                    await writer.write(encoder.encode('\n\n[Error: Unable to connect to AI]'))
                } finally {
                    await writer.close()
                }
            })()

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
            },
        })
    } catch (error: any) {
        console.error('Chat API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
