import { AIResponseSchema, type AIResponse } from './schemas'

export function parseClaudeResponse(content: string): { success: boolean, data?: AIResponse, error?: any } {
    try {
        // Claude might wrap the JSON in markdown code blocks like ```json ... ```
        let jsonStr = content.trim()
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '')
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '')
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.replace(/```$/, '')
        }

        // Find the first { and last } to extract just the JSON
        // Especially helpful if Claude includes conversational prefixes/suffixes despite instructions
        const firstBrace = jsonStr.indexOf('{')
        const lastBrace = jsonStr.lastIndexOf('}')

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error('No JSON object found in response')
        }

        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1)

        let rawData: any
        try {
            rawData = JSON.parse(jsonStr)
        } catch (e) {
            // Attempt to fix missing commas between fields (common AI error)
            const fixedStr = jsonStr
                .replace(/("|\d|true|false|null)\s*\n\s*"/g, '$1,\n  "') // Add missing commas
                .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas

            rawData = JSON.parse(fixedStr)
        }

        const data = AIResponseSchema.parse(rawData)
        return { success: true, data }
    } catch (error) {
        console.error('Failed to parse AI response:', error, 'Raw content:', content)

        // FINAL FALLBACK: REGEX EXTRACTION
        // If the JSON is scrambled but contains the messages we need, extract them!
        try {
            const intentMatch = content.match(/"intent"\s*:\s*"([^"]+)"/)
            const needsClarificationMatch = content.match(/"needs_clarification"\s*:\s*(true|false)/)
            const clarificationMatch = content.match(/"clarification_question"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/)
            const confirmationMatch = content.match(/"confirmation_message"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/)
            const customerMatch = content.match(/"customer_name"\s*:\s*"([^"]+)"/)
            const supplierMatch = content.match(/"supplier_name"\s*:\s*"([^"]+)"/)

            if (intentMatch) {
                const fallbackData: any = {
                    intent: intentMatch[1] as any,
                    needs_clarification: needsClarificationMatch?.[1] === 'true',
                    confirmation_message: confirmationMatch?.[1]?.replace(/\\"/g, '"').replace(/\\n/g, '\n') || "I've processed your update.",
                    clarification_question: clarificationMatch?.[1]?.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
                    confidence: 0.5,
                    transaction: (customerMatch || supplierMatch) ? {
                        customer_name: customerMatch?.[1],
                        supplier_name: supplierMatch?.[1]
                    } : null
                }

                return { success: true, data: fallbackData }
            }
        } catch (regexError) {
            console.error('Regex fallback also failed:', regexError)
        }

        return { success: false, error }
    }
}
