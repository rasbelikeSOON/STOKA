import { adminAuthClient } from '@/lib/supabase/admin'
import { AIResponse } from './schemas'

export async function processTransactionEvent(
    businessId: string,
    userId: string,
    response: AIResponse
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    const t = response.transaction
    if (!t) return { success: false, error: 'No transaction data found in AI response' }

    try {
        // 1. Resolve or Create Suppliers/Customers
        let supplierId = null
        let customerId = null

        if (t.supplier_name && (t.type === 'purchase' || t.type === 'return')) {
            // Find or create supplier
            const { data: existing } = await adminAuthClient
                .from('suppliers')
                .select('id')
                .eq('business_id', businessId)
                .ilike('name', t.supplier_name)
                .single()

            if (existing) supplierId = existing.id
            else {
                const { data: created } = await adminAuthClient
                    .from('suppliers')
                    .insert({ business_id: businessId, name: t.supplier_name })
                    .select('id')
                    .single()
                if (created) supplierId = created.id
            }
        }

        if (t.customer_name && (t.type === 'sale' || t.type === 'return')) {
            const { data: existing } = await adminAuthClient
                .from('customers')
                .select('id')
                .eq('business_id', businessId)
                .ilike('name', t.customer_name)
                .single()

            if (existing) customerId = existing.id
            else {
                const { data: created } = await adminAuthClient
                    .from('customers')
                    .insert({ business_id: businessId, name: t.customer_name })
                    .select('id')
                    .single()
                if (created) customerId = created.id
            }
        }

        // Resolve Location
        let locationId = null
        if (t.location_name) {
            const { data: existingLoc } = await adminAuthClient
                .from('locations')
                .select('id')
                .eq('business_id', businessId)
                .ilike('name', t.location_name)
                .single()
            if (existingLoc) locationId = existingLoc.id
        }

        // If no explicit location found, grab the default
        if (!locationId) {
            const { data: defaultLoc } = await adminAuthClient
                .from('locations')
                .select('id')
                .eq('business_id', businessId)
                .eq('is_default', true)
                .single()

            if (defaultLoc) locationId = defaultLoc.id
            else {
                // Absolute fallback: just grab the first location
                const { data: anyLoc } = await adminAuthClient
                    .from('locations')
                    .select('id')
                    .eq('business_id', businessId)
                    .limit(1)
                    .single()
                if (anyLoc) locationId = anyLoc.id
                else throw new Error("No location found for business")
            }
        }

        // 2. Resolve or Create Products/Variants
        const items = []

        for (const item of t.items) {
            let variantId = item.matched_variant_id
            let productId = item.matched_product_id

            if (item.is_new_product || (!productId && !variantId)) {
                // Create Product
                const { data: newProd, error: pErr } = await adminAuthClient
                    .from('products')
                    .insert({
                        business_id: businessId,
                        name: item.product_name,
                        category: 'Uncategorized' // Claude could guess this later
                    })
                    .select('id')
                    .single()

                if (pErr) throw new Error(`Failed to create product: ${pErr.message}`)
                productId = newProd.id

                // Format description
                const descWords = (item.variant_descriptor || '').toLowerCase().split(' ')
                const size = descWords.find(w => w.includes('small') || w.includes('large') || w.includes('medium') || w.match(/\d+(ml|g|kg|l|oz)/)) || null
                const color = descWords.find(w => ['red', 'blue', 'green', 'black', 'white', 'yellow'].includes(w)) || null

                // Create Variant
                const { data: newVar, error: vErr } = await adminAuthClient
                    .from('product_variants')
                    .insert({
                        product_id: productId,
                        business_id: businessId,
                        cost_price: t.type === 'purchase' ? item.unit_price : null,
                        selling_price: t.type === 'sale' ? item.unit_price : null,
                        size,
                        color
                    })
                    .select('id')
                    .single()

                if (vErr) throw new Error(`Failed to create variant: ${vErr.message}`)
                variantId = newVar.id

                // Init zero stock
                await adminAuthClient.from('stock_levels').insert({
                    variant_id: variantId,
                    location_id: locationId,
                    business_id: businessId,
                    quantity: 0
                })
            }

            items.push({
                variant_id: variantId,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price
            })
        }

        // 3. Create Transaction
        const { data: trx, error: tErr } = await adminAuthClient
            .from('transactions')
            .insert({
                business_id: businessId,
                location_id: locationId as string,
                type: t.type,
                status: 'confirmed',
                supplier_id: supplierId,
                customer_id: customerId,
                total_amount: t.total_amount,
                notes: t.notes || null,
                created_by: userId,
                source: 'chat'
            })
            .select('id')
            .single()

        if (tErr) throw new Error(`Failed to create transaction: ${tErr.message}`)

        // 4. Create Transaction Items
        const trxItems = items.map(i => ({
            transaction_id: trx.id,
            variant_id: i.variant_id as string,
            quantity: i.quantity,
            unit_price: i.unit_price,
            total_price: i.total_price
        }))

        const { error: iErr } = await adminAuthClient.from('transaction_items').insert(trxItems)
        if (iErr) throw new Error(`Failed to insert items: ${iErr.message}`)

        // 5. Update Stock Levels (Sequential to avoid race as much as possible, though Stored Proc is best)
        // Note: For a production app, use a PostgreSQL function / RPC to update stock safely.
        for (const item of items) {
            // First get current
            const { data: currentStock } = await adminAuthClient
                .from('stock_levels')
                .select('quantity, id')
                .eq('variant_id', item.variant_id)
                .eq('location_id', locationId)
                .single()

            if (currentStock) {
                let newQty = currentStock.quantity
                if (t.type === 'purchase' || t.type === 'return') newQty += item.quantity
                else if (t.type === 'sale') newQty -= item.quantity
                else if (t.type === 'adjustment') newQty = item.quantity // Absolute adjustment

                await adminAuthClient
                    .from('stock_levels')
                    .update({ quantity: newQty })
                    .eq('id', currentStock.id)
            } else {
                // Stock tracker row doesn't exist for this location yet
                let initQty = 0
                if (t.type === 'purchase' || t.type === 'return') initQty = item.quantity
                else if (t.type === 'sale') initQty = -item.quantity
                else if (t.type === 'adjustment') initQty = item.quantity

                await adminAuthClient
                    .from('stock_levels')
                    .insert({
                        variant_id: item.variant_id,
                        location_id: locationId,
                        business_id: businessId,
                        quantity: initQty
                    })
            }
        }

        return { success: true, transactionId: trx.id }

    } catch (err: any) {
        console.error('Transaction Processor Error:', err)
        return { success: false, error: err.message }
    }
}
