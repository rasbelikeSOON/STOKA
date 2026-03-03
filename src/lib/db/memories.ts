import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// In the future, we can back these with a real 'business_memories' vector DB table or JSONB column on 'businesses'.
// For now, we will return an empty array until we scaffold that table.

export async function getRecentMemories(businessId: string, userMessage: string) {
    // Scaffold for Phase 9: AI Memories
    // This would search a hypothetical embeddings table for relevant context
    return [];
}

export async function saveMemoryCandidates(businessId: string, candidates: any[]) {
    if (!candidates || candidates.length === 0) return;
    console.log(`[Memory] Learned patterns for business ${businessId}:`, candidates);
    // TODO: Write these to a persistence layer
}
