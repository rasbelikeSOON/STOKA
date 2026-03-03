import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AIResponse, ActionItem } from './schemas'

export async function executeAction(action: AIResponse['action'], businessId: string, userId: string) {
    if (!action.type || action.items.length === 0) {
        return { success: false, successMessage: "No action to execute." }
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { getAll() { return cookieStore.getAll() }, setAll() { } }
        }
    )

    // 1. Get/Create Location
    let locationId = null
    const { data: defaultLoc } = await supabase
        .from('locations')
        .select('id')
        .eq('business_id', businessId)
        .eq('is_default', true)
        .single()

    if (defaultLoc) locationId = defaultLoc.id
    else {
        // Fallback or create Main Store
        const { data: newLoc } = await supabase.from('locations').insert({ business_id: businessId, name: 'Main Store', is_default: true }).select('id').single()
        locationId = newLoc?.id
    }

    if (!locationId) throw new Error("Could not resolve location.")

    // Map Action Type to DB Transaction Type
    const typeMapping: Record<string, string> = {
        'RECORD_PURCHASE': 'purchase',
        'RECORD_SALE': 'sale',
        'RECORD_ADJUSTMENT': 'adjustment',
        'RECORD_RETURN_IN': 'return',
        'RECORD_RETURN_OUT': 'return',
        'RECORD_TRANSFER': 'transfer'
    }

    const dbTxType = typeMapping[action.type] || 'adjustment'
    const modifier = (dbTxType === 'purchase' || action.type === 'RECORD_RETURN_IN') ? 1 : -1

    try {
        // Compute total amount
        const totalAmount = action.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0)

        // 2. Create Transaction Header
        const { data: tx, error: txErr } = await supabase.from('transactions').insert({
            business_id: businessId,
            location_id: locationId,
            type: dbTxType,
            status: 'confirmed',
            created_by: userId,
            total_amount: totalAmount,
            notes: action.transaction_metadata.notes || action.transaction_metadata.adjustment_reason || null,
            source: 'chat'
        }).select().single()

        if (txErr) throw txErr

        // 3. Process Each Item
        for (const item of action.items) {
            const variantId = await resolveVariantId(supabase, item, businessId)
            const qty = item.quantity || 0

            // Insert TX Item
            const { error: iErr } = await supabase.from('transaction_items').insert({
                transaction_id: tx.id,
                variant_id: variantId,
                quantity: qty,
                unit_price: item.unit_price || 0,
                total_price: qty * (item.unit_price || 0)
            })
            if (iErr) throw iErr

            // Update Stock Level
            const qtyChange = qty * modifier
            const { data: currentStock } = await supabase.from('stock_levels').select('quantity').eq('variant_id', variantId).eq('location_id', locationId).maybeSingle()

            if (currentStock) {
                await supabase.from('stock_levels').update({ quantity: Math.max(0, currentStock.quantity + qtyChange), updated_at: new Date().toISOString() })
                    .eq('variant_id', variantId).eq('location_id', locationId)
            } else {
                await supabase.from('stock_levels').insert({
                    variant_id: variantId, location_id: locationId, business_id: businessId,
                    quantity: Math.max(0, qtyChange), updated_at: new Date().toISOString()
                })
            }
        }

        // Logic for proactive insight generation
        const insight = action.type === 'RECORD_SALE' ? {
            show: true,
            type: 'milestone',
            message: `Awesome! You recorded ${action.items.length} item(s) sold. Keep closing those deals!`
        } : null

        return {
            success: true,
            successMessage: "Done! Your inventory has been updated.",
            insight
        }

    } catch (error: any) {
        console.error("Execution error:", error)
        throw new Error(error.message)
    }
}

async function resolveVariantId(supabase: any, item: ActionItem, businessId: string) {
    if (item.matched_variant_id) return item.matched_variant_id

    // Auto-create new product + variant seamlessly
    const { data: prod } = await supabase.from('products').insert({
        business_id: businessId,
        name: item.product_name,
        category: 'Uncategorized'
    }).select().single()

    const { data: variant } = await supabase.from('product_variants').insert({
        business_id: businessId,
        product_id: prod.id,
        size: item.variant_attributes?.size,
        color: item.variant_attributes?.color,
        scent: item.variant_attributes?.scent,
        flavor: item.variant_attributes?.flavor,
        cost_price: item.unit_price || 0,
        selling_price: (item.unit_price || 0) * 1.2
    }).select().single()

    return variant.id
}
