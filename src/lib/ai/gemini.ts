import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY // fallback so it doesn't instantly crash if env is badly named
})

export default ai
