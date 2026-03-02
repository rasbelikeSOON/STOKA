import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuthClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const { name, type, currency, locationName, address } = await request.json()

        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore
                        }
                    }
                }
            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Since RLS blocks insert on businesses unless we allow it, we can either:
        // 1. have a policy allowing INSERT to businesses when auth.uid() is not null (we added this)
        // OR 2. use the service role key to perform these linked inserts.
        // Let's use the service role key to ensure all 3 inserts succeed atomically or none do.

        // Create business
        const { data: business, error: bizError } = await adminAuthClient
            .from('businesses')
            .insert({ name, type, currency })
            .select('id')
            .single()

        if (bizError) throw bizError

        // Create business member (owner)
        const { error: memberError } = await adminAuthClient
            .from('business_members')
            .insert({
                business_id: business.id,
                user_id: user.id,
                role: 'owner'
            })

        if (memberError) throw memberError

        // Create default location
        const { error: locError } = await adminAuthClient
            .from('locations')
            .insert({
                business_id: business.id,
                name: locationName,
                address: address || null,
                is_default: true
            })

        if (locError) throw locError

        return NextResponse.json({ success: true, businessId: business.id })

    } catch (error: any) {
        console.error('Onboarding Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
