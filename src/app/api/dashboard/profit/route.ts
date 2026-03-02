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

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: member } = await supabase
            .from('business_members')
            .select('business_id, role')
            .eq('user_id', user.id)
            .single()

        // Profit page restricted to owners only for tighter security
        if (!member || member.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)

        // Gather sales items with variant cost_price
        const { data: items, error } = await supabase
            .from('transaction_items')
            .select(`
        quantity,
        unit_price,
        product_variants (
          cost_price,
          products (name)
        ),
        transactions!inner (type, status, created_at, business_id)
      `)
            .eq('transactions.business_id', member.business_id)
            .eq('transactions.type', 'sale')
            .eq('transactions.status', 'confirmed')
            .gte('transactions.created_at', startDate.toISOString())
            .lte('transactions.created_at', endDate.toISOString())

        if (error) throw new Error(error.message)

        const productMargins: Record<string, { revenue: number, cost: number, count: number }> = {}

        items?.forEach((i: any) => {
            const prodName = i.product_variants?.products?.name || 'Unknown Item'
            const qty = Number(i.quantity)
            const rev = qty * Number(i.unit_price)
            const cost = qty * Number(i.product_variants?.cost_price || 0)

            if (!productMargins[prodName]) {
                productMargins[prodName] = { revenue: 0, cost: 0, count: 0 }
            }
            productMargins[prodName].revenue += rev
            productMargins[prodName].cost += cost
            productMargins[prodName].count += qty
        })

        const marginBreakdown = Object.entries(productMargins).map(([name, stats]) => {
            const grossProfit = stats.revenue - stats.cost
            const marginPct = stats.revenue > 0 ? (grossProfit / stats.revenue) * 100 : 0
            return {
                name,
                revenue: stats.revenue,
                cost: stats.cost,
                grossProfit,
                marginPct,
                unitsSold: stats.count
            }
        }).sort((a, b) => b.grossProfit - a.grossProfit)

        return NextResponse.json({ marginBreakdown })

    } catch (error: any) {
        console.error('Dashboard Profit API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
