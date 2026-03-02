import { createClient } from '@supabase/supabase-js'

// Note: This client uses the SERVICE ROLE KEY. 
// It bypasses Row Level Security. NEVER use this on the client side.
// Only use it in secure server environments (API routes, server actions).
export const adminAuthClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)
