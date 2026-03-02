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
/**
 * Identifies products with high stock but no sales in the last 21 days.
 */
export async function slowMoverEvaluator(supabase: SupabaseClient, businessId: string): Promise<number> {
    const twentyOneDaysAgo = new Date()
    twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21)

    // 1. Get all variant IDs with sales in the last 21 days
    const { data: recentSales } = await supabase
        .from('transaction_items')
        .select('variant_id, transactions!inner(business_id, type)')
        .eq('transactions.business_id', businessId)
        .eq('transactions.type', 'sale')
        .gte('transactions.created_at', twentyOneDaysAgo.toISOString())

    const soldVariantIds = new Set((recentSales || []).map(s => s.variant_id))

    // 2. Get stock levels for variants NOT in that set with quantity > 10
    const { data: potentialSlowMovers } = await supabase
        .from('stock_levels')
        .select(`
            quantity, 
            variant_id, 
            product_variants(id, name, products(name))
        `)
        .eq('business_id', businessId)
        .gt('quantity', 10)

    const slowMovers = (potentialSlowMovers || []).filter(s => !soldVariantIds.has(s.variant_id))

    let created = 0
    for (const mover of slowMovers) {
        const pv = mover.product_variants as any
        const p = Array.isArray(pv?.products) ? pv.products[0] : pv?.products
        const productName = p?.name
        const variantName = pv?.name
        const title = `Slow Mover: ${productName} (${variantName})`
        const message = `This item has over ${mover.quantity} units in stock but hasn't recorded a sale in 21 days. Consider a promotion or adjusting inventory.`

        // Check for existing unread
        const { data: existing } = await supabase
            .from('insights_log')
            .select('id')
            .eq('business_id', businessId)
            .eq('type', 'slow_mover')
            .eq('related_variant_id', mover.variant_id)
            .eq('is_read', false)
            .single()

        if (!existing) {
            await supabase.from('insights_log').insert({
                business_id: businessId,
                type: 'slow_mover',
                title,
                message,
                severity: 'info',
                related_variant_id: mover.variant_id,
                data: { quantity: mover.quantity }
            })
            created++
        }
    }
    return created
}

/**
 * Flags items set to expire within the next 14 days.
 */
export async function expiryWarningEvaluator(supabase: SupabaseClient, businessId: string): Promise<number> {
    const fourteenDaysFromNow = new Date()
    fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14)

    const { data: expiringSoon } = await supabase
        .from('product_variants')
        .select('id, name, expiry_date, products(name)')
        .eq('business_id', businessId)
        .lte('expiry_date', fourteenDaysFromNow.toISOString())
        .gte('expiry_date', new Date().toISOString())

    let created = 0
    for (const item of (expiringSoon || [])) {
        const productName = Array.isArray(item.products) ? item.products[0]?.name : (item.products as any)?.name
        const title = `Expiry Warning: ${productName} (${item.name})`
        const message = `This product is set to expire on ${new Date(item.expiry_date!).toLocaleDateString()}. Move to front of shelf or discount.`

        const { data: existing } = await supabase
            .from('insights_log')
            .select('id')
            .eq('business_id', businessId)
            .eq('type', 'expiry_warning')
            .eq('related_variant_id', item.id)
            .eq('is_read', false)
            .single()

        if (!existing) {
            await supabase.from('insights_log').insert({
                business_id: businessId,
                type: 'expiry_warning',
                title,
                message,
                severity: 'critical',
                related_variant_id: item.id,
                data: { expiry_date: item.expiry_date }
            })
            created++
        }
    }
    return created
}

/**
 * Identifies the top 3 selling products of the week.
 */
export async function topPerformerEvaluator(supabase: SupabaseClient, businessId: string): Promise<number> {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: sales } = await supabase
        .from('transaction_items')
        .select('variant_id, total_price, transactions!inner(business_id, type)')
        .eq('transactions.business_id', businessId)
        .eq('transactions.type', 'sale')
        .gte('transactions.created_at', sevenDaysAgo.toISOString())

    if (!sales || sales.length === 0) return 0

    const revenueByVariant: Record<string, number> = {}
    sales.forEach(s => {
        revenueByVariant[s.variant_id] = (revenueByVariant[s.variant_id] || 0) + s.total_price
    })

    const top3 = Object.entries(revenueByVariant)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    let created = 0
    if (top3.length > 0) {
        // We only create one 'summary' insight for the weekly top performers
        const { data: existingWeekly } = await supabase
            .from('insights_log')
            .select('id')
            .eq('business_id', businessId)
            .eq('type', 'top_performer')
            .gte('created_at', sevenDaysAgo.toISOString())
            .single()

        if (!existingWeekly) {
            const variantDetails = await Promise.all(top3.map(async ([vid, rev]) => {
                const { data } = await supabase.from('product_variants').select('name, products(name)').eq('id', vid).single()
                const productName = Array.isArray(data?.products) ? data?.products[0]?.name : (data?.products as any)?.name
                return `${productName} (${data?.name}): ₦${rev.toLocaleString()}`
            }))

            await supabase.from('insights_log').insert({
                business_id: businessId,
                type: 'top_performer',
                title: 'Weekly Top Performers 🏆',
                message: `Your best selling items this week are:\n\n${variantDetails.join('\n')}`,
                severity: 'info',
                data: { top_list: top3 }
            })
            created = 1
        }
    }

    return created
}
