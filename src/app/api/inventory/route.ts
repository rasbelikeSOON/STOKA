import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') // 'low-stock' or 'all'
        const q = searchParams.get('q')

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
            .from('stock_levels')
            .select(`
        id, quantity, location_id,
        locations ( name ),
        product_variants!inner (
           id, sku, reorder_threshold, selling_price,
           products!inner ( id, name, category )
        )
      `)
            .eq('business_id', member.business_id)

        if (q) {
            query = query.ilike('product_variants.products.name', `%${q}%`)
        }

        const { data: stockLevels, error } = await query

        if (error) throw new Error(error.message)

        let mapped = stockLevels?.map((s: any) => ({
            id: s.id,
            product_name: s.product_variants.products.name,
            product_id: s.product_variants.products.id,
            category: s.product_variants.products.category,
            sku: s.product_variants.sku,
            price: s.product_variants.selling_price,
            location_name: s.locations?.name || 'Unknown',
            quantity: s.quantity,
            reorder_threshold: s.product_variants.reorder_threshold
        })) || []

        if (filter === 'low-stock') {
            mapped = mapped.filter(m => m.quantity <= m.reorder_threshold)
        }

        return NextResponse.json({ data: mapped })

    } catch (error: any) {
        console.error('Inventory API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
