import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30', 10)

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

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: member } = await supabase
            .from('business_members')
            .select('business_id, role')
            .eq('user_id', user.id)
            .single()

        if (!member || member.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)
        startDate.setHours(0, 0, 0, 0)

        // 1. Fetch Top Products by revenue
        const { data: items, error } = await supabase
            .from('transaction_items')
            .select(`
        quantity,
        total_price,
        product_variants (
          products (name, category)
        ),
        transactions!inner (type, status, created_at, business_id)
      `)
            .eq('transactions.business_id', member.business_id)
            .eq('transactions.type', 'sale')
            .eq('transactions.status', 'confirmed')
            .gte('transactions.created_at', startDate.toISOString())
            .lte('transactions.created_at', endDate.toISOString())

        if (error) throw new Error(error.message)

        const productSales: Record<string, { name: string, category: string, revenue: number, quantity: number }> = {}
        const categorySales: Record<string, number> = {}

        items?.forEach((i: any) => {
            const prod = i.product_variants?.products;
            if (!prod) return

            const name = prod.name
            const cat = prod.category || 'Uncategorized'
            const rev = Number(i.total_price)
            const qty = Number(i.quantity)

            if (!productSales[name]) {
                productSales[name] = { name, category: cat, revenue: 0, quantity: 0 }
            }
            productSales[name].revenue += rev
            productSales[name].quantity += qty

            if (!categorySales[cat]) {
                categorySales[cat] = 0
            }
            categorySales[cat] += rev
        })

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)

        const salesByCategory = Object.entries(categorySales).map(([name, value]) => ({ name, value }))

        return NextResponse.json({ topProducts, salesByCategory })

    } catch (error: any) {
        console.error('Dashboard Sales API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
