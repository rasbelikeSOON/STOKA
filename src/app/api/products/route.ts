import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createProductWithFirstVariantSchema } from '@/lib/validations/product'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const cursor = searchParams.get('cursor')
        const limit = parseInt(searchParams.get('limit') || '20', 10)
        const q = searchParams.get('q')

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
            .select('business_id')
            .eq('user_id', user.id)
            .single()

        if (!member) return NextResponse.json({ error: 'No business found' }, { status: 403 })

        let query = supabase
            .from('products')
            .select(`
        id, name, category, created_at,
        product_variants (
          id, sku, selling_price,
          stock_levels ( quantity )
        )
      `)
            .eq('business_id', member.business_id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (cursor) {
            query = query.lt('created_at', cursor)
        }

        if (q) {
            query = query.ilike('name', `%${q}%`)
        }

        const { data: products, error } = await query

        if (error) throw new Error(error.message)

        const next_cursor = products && products.length === limit ? products[products.length - 1].created_at : null

        // Compute total stock manually for each product to make the table easier to render
        const mapped = products?.map((p: any) => {
            let totalStock = 0;
            let minPrice = Infinity;
            let maxPrice = 0;

            p.product_variants?.forEach((v: any) => {
                const price = Number(v.selling_price)
                if (price < minPrice) minPrice = price
                if (price > maxPrice) maxPrice = price
                v.stock_levels?.forEach((sl: any) => {
                    totalStock += Number(sl.quantity)
                })
            })

            return {
                ...p,
                totalStock,
                priceRange: minPrice === maxPrice && minPrice < Infinity ? `₦${minPrice.toLocaleString()}` : minPrice < Infinity ? `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}` : 'N/A',
                variantCount: p.product_variants?.length || 0
            }
        })

        return NextResponse.json({ data: mapped, next_cursor })

    } catch (error: any) {
        console.error('Products List API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const { product, variant, initial_quantity, location_id } = createProductWithFirstVariantSchema.parse(json)

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

        if (!member) return NextResponse.json({ error: 'No business found' }, { status: 403 })
        if (member.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        // Use a Supabase RPC or do it sequentially (sequential is fine for V1 since RLS protects cross-tenant)
        // 1. Insert Product
        const { data: newProd, error: pErr } = await supabase
            .from('products')
            .insert({
                business_id: member.business_id,
                name: product.name,
                description: product.description,
                category: product.category,
                supplier_id: product.supplier_id || null
            })
            .select('id').single()

        if (pErr) throw new Error(pErr.message)

        // 2. Insert Variant
        const { data: newVar, error: vErr } = await supabase
            .from('product_variants')
            .insert({
                product_id: newProd.id,
                sku: variant.sku,
                barcode: variant.barcode,
                attributes: variant.attributes || {},
                cost_price: variant.cost_price,
                selling_price: variant.selling_price,
                reorder_threshold: variant.reorder_threshold,
                expiry_date: variant.expiry_date || null
            })
            .select('id').single()

        if (vErr) throw new Error(vErr.message)

        // 3. Insert Initial Stock Level
        if (location_id) {
            const { error: sErr } = await supabase
                .from('stock_levels')
                .insert({
                    variant_id: newVar.id,
                    location_id: location_id,
                    business_id: member.business_id,
                    quantity: initial_quantity
                })
            if (sErr) throw new Error(sErr.message)

            // 4. Log adjustment if > 0
            if (initial_quantity > 0) {
                const { data: tx, error: txErr } = await supabase.from('transactions').insert({
                    business_id: member.business_id,
                    location_id: location_id,
                    type: 'adjustment',
                    status: 'confirmed',
                    total_amount: initial_quantity * (variant.selling_price || 0),
                    notes: 'Initial stock intake',
                    created_by: user.id,
                    source: 'manual'
                }).select('id').single()

                if (!txErr) {
                    await supabase.from('transaction_items').insert({
                        transaction_id: tx.id,
                        variant_id: newVar.id,
                        quantity: initial_quantity,
                        unit_price: variant.selling_price || 0,
                        total_price: initial_quantity * (variant.selling_price || 0)
                    })
                }
            }
        }

        return NextResponse.json({ id: newProd.id })

    } catch (error: any) {
        console.error('Products List API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
