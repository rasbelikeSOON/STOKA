import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { transactionSchema } from '@/lib/validations/transaction'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const cursor = searchParams.get('cursor')
        const limit = parseInt(searchParams.get('limit') || '20', 10)

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
            .from('transactions')
            .select(`
        id, created_at, type, status, total_amount, source, notes,
        auth_users:created_by ( email ),
        locations ( name ),
        suppliers ( name ),
        customers ( name ),
        transaction_items (
           quantity, unit_price, total_price,
           product_variants ( sku, products (name) )
        )
      `)
            .eq('business_id', member.business_id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (cursor) {
            query = query.lt('created_at', cursor)
        }

        const { data: txs, error } = await query

        if (error) throw new Error(error.message)

        const next_cursor = txs && txs.length === limit ? txs[txs.length - 1].created_at : null

        return NextResponse.json({ data: txs, next_cursor })

    } catch (error: any) {
        console.error('Transactions List API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const validated = transactionSchema.parse(json)

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

        // Calculate total amount
        const totalAmount = validated.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

        // Call Supabase RPC to handle transaction creation + stock updates atomically
        // For manual creation without RPC, we'll do sequential operations here for now.
        // In a prod environment, an edge function or Postgres trigger is preferred for atomic updates.

        const { data: newTx, error: txError } = await supabase
            .from('transactions')
            .insert({
                business_id: member.business_id,
                location_id: validated.location_id,
                type: validated.type,
                status: validated.status,
                supplier_id: validated.supplier_id || null,
                customer_id: validated.customer_id || null,
                total_amount: totalAmount,
                notes: validated.notes || null,
                created_by: user.id,
                source: 'manual'
            })
            .select('id').single()

        if (txError) throw new Error(txError.message)

        const txItems = validated.items.map(item => ({
            transaction_id: newTx.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
        }))

        const { error: itemsError } = await supabase.from('transaction_items').insert(txItems)
        if (itemsError) throw new Error(itemsError.message)

        // If confirmed, update stock
        if (validated.status === 'confirmed') {
            for (const item of validated.items) {
                // fetch current stock
                const { data: currentStock } = await supabase
                    .from('stock_levels')
                    .select('quantity')
                    .eq('variant_id', item.variant_id)
                    .eq('location_id', validated.location_id)
                    .single()

                const currentQty = currentStock?.quantity || 0

                let qtyChange = 0
                if (validated.type === 'purchase' || validated.type === 'return') {
                    qtyChange = item.quantity
                } else if (validated.type === 'sale') {
                    qtyChange = -item.quantity
                } else if (validated.type === 'adjustment') {
                    // For strict manual adjustments, the user specifies the absolute or relative amount
                    // Let's assume the form supplies the relative difference
                    qtyChange = item.quantity
                } else if (validated.type === 'transfer') {
                    // To simplify, manual transfers might need a source and dest, but we'll treat it as outbound if positive
                    qtyChange = -item.quantity
                }

                if (currentStock) {
                    await supabase.from('stock_levels').update({ quantity: currentQty + qtyChange }).eq('variant_id', item.variant_id).eq('location_id', validated.location_id)
                } else {
                    await supabase.from('stock_levels').insert({
                        business_id: member.business_id,
                        variant_id: item.variant_id,
                        location_id: validated.location_id,
                        quantity: qtyChange
                    })
                }
            }
        }

        return NextResponse.json({ id: newTx.id })

    } catch (error: any) {
        console.error('Transactions POST API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
