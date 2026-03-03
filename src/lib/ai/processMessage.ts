import Groq from 'groq-sdk'
import { getBusinessContext } from '../db/business'
import { getRelevantProducts } from '../db/products'
import { getRecentMemories } from '../db/memories'
import { buildSystemPrompt } from './systemPrompt'
import { AIResponseSchema, AIResponse } from './schemas'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function processMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    businessId: string,
    userId: string
): Promise<AIResponse> {

    // 1. Gather Context
    const [context, products, memories] = await Promise.all([
        getBusinessContext(businessId),
        getRelevantProducts(businessId),
        getRecentMemories(businessId, userMessage)
    ])

    // Wait for context to resolve, fallback to basic if business context fails
    const safeContext = context || {
        businessName: 'Your Business',
        currency: 'NGN',
        userRole: 'Staff',
        locationName: 'Store'
    }

    // 2. Build Intelligent System Prompt
    const systemPrompt = buildSystemPrompt(safeContext, products, memories)

    // 3. Let Groq do all the interpretation
    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        temperature: 0.1, // Keep it deterministic for business logic
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10), // Give previous context but limit window
            { role: 'user', content: userMessage }
        ]
    })

    const rawContent = completion.choices[0]?.message?.content || '{}'
    let rawJson: any = {}

    try {
        rawJson = JSON.parse(rawContent)
    } catch (e) {
        console.error('Failed to parse Groq response as JSON:', rawContent)
        throw new Error('AI returned invalid format.')
    }

    // 4. Validate and strictly type the AI's decision
    const parsed = AIResponseSchema.safeParse(rawJson)

    if (!parsed.success) {
        console.error('LLM Output Schema Validation Failed:', parsed.error)

        // Return a graceful fallback clarification
        return {
            understood: false,
            intent_summary: 'Parsing Error',
            action: { type: null, items: [], transaction_metadata: { transaction_date: new Date().toISOString() } as any },
            query: { type: null } as any,
            confirmation_card: { show: false, title: '', summary_lines: [], confirm_button_label: '', cancel_button_label: '' },
            response_message: "I'm sorry, I encountered an error translating that. Could you please rephrase?",
            needs_clarification: true,
            clarification_question: "Could you rephrase your last message?",
            clarification_context: "Schema validation failure",
            proactive_insight: { show: false, type: null, message: null },
            memory_candidates: []
        } as unknown as AIResponse
    }

    return parsed.data
}
