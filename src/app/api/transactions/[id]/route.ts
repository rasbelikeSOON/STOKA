import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { updateTransactionStatusSchema } from '@/lib/validations/transaction'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
    try {
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

        const { data: tx, error } = await supabase
            .from('transactions')
            .select(`
        id, created_at, type, status, total_amount, source, notes,
        auth_users:created_by ( email ),
        locations ( id, name ),
        suppliers ( id, name ),
        customers ( id, name ),
        transaction_items (
           id, quantity, unit_price, total_price,
           product_variants ( id, sku, products (id, name, category) )
        )
      `)
            .eq('id', id)
            .single()

        if (error) throw new Error(error.message)
        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

        return NextResponse.json(tx)

    } catch (error: any) {
        console.error('Transaction Detail GET Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
    try {
        const json = await request.json()
        const { status } = updateTransactionStatusSchema.parse(json)

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

        // Need to check current status to prevent double-applying items
        // (If transitioning from pending -> confirmed)

        const { data: tx } = await supabase
            .from('transactions')
            .select('status, type, location_id, transaction_items(variant_id, quantity)')
            .eq('id', id)
            .single()

        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

        if (tx.status === 'pending' && status === 'confirmed') {
            // Apply stock changes
            const memberRes = await supabase.from('business_members').select('business_id').eq('user_id', user.id).single()
            const bId = memberRes.data?.business_id

            for (const item of tx.transaction_items) {
                const { data: currentStock } = await supabase
                    .from('stock_levels')
                    .select('quantity')
                    .eq('variant_id', item.variant_id)
                    .eq('location_id', tx.location_id)
                    .single()

                const currentQty = currentStock?.quantity || 0

                let qtyChange = 0
                if (tx.type === 'purchase' || tx.type === 'return') qtyChange = item.quantity
                else if (tx.type === 'sale') qtyChange = -item.quantity
                else if (tx.type === 'adjustment') qtyChange = item.quantity

                if (currentStock) {
                    await supabase.from('stock_levels').update({ quantity: currentQty + qtyChange }).eq('variant_id', item.variant_id).eq('location_id', tx.location_id)
                } else if (bId) {
                    await supabase.from('stock_levels').insert({
                        business_id: bId,
                        variant_id: item.variant_id,
                        location_id: tx.location_id,
                        quantity: qtyChange
                    })
                }
            }
        }

        const { error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Transaction Detail PUT Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
