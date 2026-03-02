import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Calculates a 14-day sales velocity and creates an insight
 * if current stock is less than 7 days of expected sales.
 */
export async function reorderSuggestion(supabase: SupabaseClient, businessId: string): Promise<number> {
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    // 1. Get transaction items from the last 14 days for this business (confirmed sales only)
    const { data: sales, error: salesError } = await supabase
        .from('transaction_items')
        .select(`
      variant_id,
      quantity,
      transactions!inner ( business_id, type, status, created_at )
    `)
        .eq('transactions.business_id', businessId)
        .eq('transactions.type', 'sale')
        .eq('transactions.status', 'confirmed')
        .gte('transactions.created_at', fourteenDaysAgo.toISOString())

    if (salesError || !sales) return 0;

    // Aggregate quantity sold by variant_id
    const variantSales: Record<string, number> = {}
    sales.forEach((item: any) => {
        variantSales[item.variant_id] = (variantSales[item.variant_id] || 0) + item.quantity
    })

    // Calculate daily velocity and 7-day expected need
    const variantsToReorder: { variant_id: string, expected_7_day: number }[] = []
    for (const [variantId, totalSold] of Object.entries(variantSales)) {
        const dailyVelocity = totalSold / 14
        const expected7Day = Math.ceil(dailyVelocity * 7)
        if (expected7Day > 0) {
            variantsToReorder.push({ variant_id: variantId, expected_7_day: expected7Day })
        }
    }

    if (variantsToReorder.length === 0) return 0;

    // 2. Get current stock levels
    const variantIds = variantsToReorder.map(v => v.variant_id)
    const { data: stockLevels, error: stockError } = await supabase
        .from('stock_levels')
        .select('variant_id, quantity')
        .eq('business_id', businessId)
        .in('variant_id', variantIds)

    if (stockError || !stockLevels) return 0;

    // Aggregate current stock by variant
    const currentStock: Record<string, number> = {}
    stockLevels.forEach((level: any) => {
        currentStock[level.variant_id] = (currentStock[level.variant_id] || 0) + level.quantity
    })

    let insightsCreated = 0;

    // 3. Compare and generate insights
    for (const check of variantsToReorder) {
        const stock = currentStock[check.variant_id] || 0
        if (stock < check.expected_7_day) {
            // Fetch variant info for a nice message (could optimize by storing in a Map earlier)
            const { data: variant } = await supabase
                .from('product_variants')
                .select('name, sku, product_id, products(name)')
                .eq('id', check.variant_id)
                .single()

            if (!variant) continue;

            const title = `Reorder Suggested: ${variant.products?.[0]?.name || 'Product'} - ${variant.name}`
            const message = `Based on sales over the last 14 days, you may run out of stock in less than a week. Current stock is ${stock}, but you need ~${check.expected_7_day} for the next 7 days.`

            // Check if an unread 'reorder' insight already exists for this variant
            const { data: existing } = await supabase
                .from('insights_log')
                .select('id')
                .eq('business_id', businessId)
                .eq('type', 'reorder')
                .eq('related_variant_id', check.variant_id)
                .eq('is_read', false)
                .single()

            if (!existing) {
                await supabase.from('insights_log').insert({
                    business_id: businessId,
                    type: 'reorder',
                    title,
                    message,
                    severity: 'warning',
                    related_product_id: variant.product_id,
                    related_variant_id: check.variant_id,
                    data: { current_stock: stock, expected_7_day: check.expected_7_day }
                })

                // Push to chat for proactive notification
                await supabase.from('chat_messages').insert({
                    business_id: businessId,
                    user_id: (await supabase.from('business_members').select('user_id').eq('business_id', businessId).limit(1).single()).data?.user_id, // Get first team member (owner usually)
                    role: 'system',
                    content: `**Insight:** ${title}\n\n${message}`
                })

                insightsCreated++;
            }
        }
    }

    return insightsCreated;
}
