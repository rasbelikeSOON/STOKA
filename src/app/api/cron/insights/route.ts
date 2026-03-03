import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import {
    reorderSuggestion,
    slowMoverEvaluator,
    expiryWarningEvaluator,
    topPerformerEvaluator
} from '@/lib/insights/evaluators'
import { rateLimit } from '@/lib/rateLimit'

// This endpoint is hit by Vercel Cron
export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization')

    // In development, we might not have a CRON_SECRET, so we allow bypass if not set
    // In production, MUST have a CRON_SECRET configured
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const supabaseAdmin = getAdminClient()

        // Get all active businesses (in a real app, page this)
        const { data: businesses, error: bizError } = await supabaseAdmin.from('businesses').select('id')
        if (bizError) throw bizError

        let insightsGenerated = 0;

        // Run evaluators for each business
        for (const biz of (businesses || [])) {
            // Run all evaluators in parallel for the business
            const results = await Promise.all([
                reorderSuggestion(supabaseAdmin, biz.id),
                slowMoverEvaluator(supabaseAdmin, biz.id),
                expiryWarningEvaluator(supabaseAdmin, biz.id),
                topPerformerEvaluator(supabaseAdmin, biz.id)
            ])
            insightsGenerated += results.reduce((a, b) => a + b, 0)
        }

        return NextResponse.json({ success: true, count: insightsGenerated })
    } catch (error: any) {
        console.error("Cron Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: Request) {
    // Rate limit the manual trigger (5 per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const cronRateLimit = rateLimit(`cron:${ip}`, 5, 60 * 1000)
    if (!cronRateLimit.success) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
    // Allow manual trigger for testing
    return POST(request)
}
