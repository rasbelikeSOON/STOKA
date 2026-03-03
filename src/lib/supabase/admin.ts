import { createClient } from '@supabase/supabase-js'

// Note: This client uses the SERVICE ROLE KEY. 
// It bypasses Row Level Security. NEVER use this on the client side.
// Only use it in secure server environments (API routes, server actions).
export function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error('Missing Supabase admin environment variables')
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
