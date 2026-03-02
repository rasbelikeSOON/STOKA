import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const unreadOnly = searchParams.get('unread_only') === 'true'

        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll() { }
                }
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: member } = await supabase.from('business_members').select('business_id').eq('user_id', user.id).single()
        if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        let query = supabase
            .from('insights_log')
            .select('*, product:related_product_id(name), variant:related_variant_id(sku, name)')
            .eq('business_id', member.business_id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (unreadOnly) {
            query = query.eq('is_read', false)
        }

        const { data, error } = await query

        if (error) throw new Error(error.message)

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
