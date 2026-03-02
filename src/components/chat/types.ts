export interface MessageItem {
    id: string; // Used locally for mapping before saved
    role: 'user' | 'assistant' | 'system';
    content: string;
    isStreaming?: boolean;
    metadata?: any;
}
