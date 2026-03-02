import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50', 10)

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

        const { data: adjustments, error } = await supabase
            .from('transactions')
            .select(`
        id, created_at, type, status, notes, total_amount, source,
        auth_users:created_by ( email ),
        locations ( name ),
        transaction_items (
           quantity, unit_price,
           product_variants ( sku, products (name) )
        )
      `)
            .eq('business_id', member.business_id)
            .eq('type', 'adjustment')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw new Error(error.message)

        return NextResponse.json({ data: adjustments })

    } catch (error: any) {
        console.error('Inventory Adjustments API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
