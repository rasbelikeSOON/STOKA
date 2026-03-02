import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { variantSchema } from '@/lib/validations/product'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
    try {
        const json = await request.json()
        // A variant form might send initial quantity and location when adding a variant
        const { variant, initial_quantity, location_id } = json

        const validated = variantSchema.parse(variant)

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

        const { data: member } = await supabase.from('business_members').select('business_id, role').eq('user_id', user.id).single()
        if (member?.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { data: newVar, error: vErr } = await supabase
            .from('product_variants')
            .insert({
                product_id: id,
                sku: validated.sku,
                barcode: validated.barcode,
                attributes: validated.attributes || {},
                cost_price: validated.cost_price,
                selling_price: validated.selling_price,
                reorder_threshold: validated.reorder_threshold,
                expiry_date: validated.expiry_date || null
            })
            .select('id').single()

        if (vErr) throw new Error(vErr.message)

        if (location_id) {
            const qty = parseInt(initial_quantity || '0', 10)
            const { error: sErr } = await supabase
                .from('stock_levels')
                .insert({
                    variant_id: newVar.id,
                    location_id: location_id,
                    business_id: member?.business_id,
                    quantity: qty
                })
            if (sErr) throw new Error(sErr.message)

            if (qty > 0) {
                const { data: tx, error: txErr } = await supabase.from('transactions').insert({
                    business_id: member?.business_id,
                    location_id: location_id,
                    type: 'adjustment',
                    status: 'confirmed',
                    total_amount: qty * (validated.selling_price || 0),
                    notes: 'Initial stock intake for new variant',
                    created_by: user.id,
                    source: 'manual'
                }).select('id').single()

                if (!txErr) {
                    await supabase.from('transaction_items').insert({
                        transaction_id: tx.id,
                        variant_id: newVar.id,
                        quantity: qty,
                        unit_price: validated.selling_price || 0,
                        total_price: qty * (validated.selling_price || 0)
                    })
                }
            }
        }

        return NextResponse.json({ id: newVar.id })

    } catch (error: any) {
        console.error('Products Variant POST API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
