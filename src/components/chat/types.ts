import { AIResponse } from '@/lib/ai/schemas'

export interface MessageItem {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    isStreaming?: boolean;
    messageType?: 'text' | 'confirmation_card' | 'insight_card';
    metadata?: any; // The raw JSON payload for the corresponding message type
}
