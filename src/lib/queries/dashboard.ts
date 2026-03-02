import { SupabaseClient } from '@supabase/supabase-js'

export async function getDashboardOverview(supabase: SupabaseClient, businessId: string, startDate: Date, endDate: Date) {
    // Fetch transactions for revenue and purchases
    const { data: transactions, error: tErr } = await supabase
        .from('transactions')
        .select('id, type, total_amount')
        .eq('business_id', businessId)
        .eq('status', 'confirmed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

    if (tErr) throw new Error(tErr.message)

    let totalRevenue = 0
    let totalPurchases = 0

    transactions?.forEach(t => {
        if (t.type === 'sale') totalRevenue += Number(t.total_amount)
        if (t.type === 'purchase') totalPurchases += Number(t.total_amount)
    })

    // Fetch low stock items
    // Since we need to join stock_levels and product_variants, we can do it via nested select
    const { data: stockData, error: sErr } = await supabase
        .from('stock_levels')
        .select(`
      quantity,
      product_variants!inner (
        id,
        reorder_threshold
      )
    `)
        .eq('business_id', businessId)

    if (sErr) throw new Error(sErr.message)

    let lowStockCount = 0
    stockData?.forEach((sd: any) => {
        // If threshold is null, default to 5 for example, or omit
        const threshold = sd.product_variants?.reorder_threshold ?? 5
        if (sd.quantity <= threshold) {
            lowStockCount++
        }
    })

    // To calculate gross profit exactly, we need transaction_items attached to sales, joined with variant cost_price
    const { data: salesItems, error: siErr } = await supabase
        .from('transaction_items')
        .select(`
      quantity,
      unit_price,
      transactions!inner (
        id,
        type,
        status,
        created_at,
        business_id
      ),
      product_variants!inner (
        cost_price
      )
    `)
        .eq('transactions.business_id', businessId)
        .eq('transactions.type', 'sale')
        .eq('transactions.status', 'confirmed')
        .gte('transactions.created_at', startDate.toISOString())
        .lte('transactions.created_at', endDate.toISOString())

    if (siErr) throw new Error(siErr.message)

    let grossProfit = 0
    salesItems?.forEach((item: any) => {
        const revenueFromItem = Number(item.quantity) * Number(item.unit_price)
        // If cost_price is null, assume 0
        const costOfItem = Number(item.quantity) * Number(item.product_variants?.cost_price || 0)
        grossProfit += (revenueFromItem - costOfItem)
    })

    // Group revenue by day for charts (e.g. past 7 days)
    const revenueByDate: Record<string, number> = {}

    // Initialize dates to 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        revenueByDate[d.toISOString().split('T')[0]] = 0
    }

    const { data: chartSales } = await supabase
        .from('transactions')
        .select('created_at, total_amount')
        .eq('business_id', businessId)
        .eq('type', 'sale')
        .eq('status', 'confirmed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

    chartSales?.forEach(t => {
        const dateStr = new Date(t.created_at).toISOString().split('T')[0]
        if (revenueByDate[dateStr] !== undefined) {
            revenueByDate[dateStr] += Number(t.total_amount)
        }
    })

    const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => a.date.localeCompare(b.date))

    // Profit Margin percentage
    let profitMargin = 0;
    if (totalRevenue > 0) {
        profitMargin = (grossProfit / totalRevenue) * 100;
    }

    return {
        totalRevenue,
        totalPurchases,
        grossProfit,
        profitMargin,
        lowStockCount,
        revenueChartData
    }
}
