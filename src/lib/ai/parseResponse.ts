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

        const rawData = JSON.parse(jsonStr)
        const data = AIResponseSchema.parse(rawData)

        return { success: true, data }
    } catch (error) {
        console.error('Failed to parse Claude response:', error, 'Raw content:', content)
        return { success: false, error }
    }
}
