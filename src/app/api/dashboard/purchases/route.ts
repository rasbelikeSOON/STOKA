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

        if (!member || member.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)

        // Gather purchases joined with suppliers
        const { data: purchases, error } = await supabase
            .from('transactions')
            .select(`
        total_amount,
        created_at,
        suppliers (name)
      `)
            .eq('business_id', member.business_id)
            .eq('type', 'purchase')
            .eq('status', 'confirmed')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())

        if (error) throw new Error(error.message)

        const supplierSpend: Record<string, number> = {}
        let totalSpend = 0

        purchases?.forEach((p: any) => {
            const sName = p.suppliers?.name || 'Unknown Supplier'
            const amt = Number(p.total_amount)
            totalSpend += amt

            if (!supplierSpend[sName]) supplierSpend[sName] = 0
            supplierSpend[sName] += amt
        })

        const topSuppliers = Object.entries(supplierSpend)
            .map(([name, total_spent]) => ({ name, total_spent }))
            .sort((a, b) => b.total_spent - a.total_spent)

        return NextResponse.json({ totalSpend, topSuppliers })

    } catch (error: any) {
        console.error('Dashboard Purchases API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
