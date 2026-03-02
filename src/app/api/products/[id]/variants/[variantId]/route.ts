import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { variantSchema } from '@/lib/validations/product'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, variantId: string }> }) {
    const { id, variantId } = await params;
    try {
        const json = await request.json()
        const validated = variantSchema.parse(json)

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

        const { data: member } = await supabase.from('business_members').select('role').eq('user_id', user.id).single()
        if (member?.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { error } = await supabase
            .from('product_variants')
            .update({
                sku: validated.sku,
                barcode: validated.barcode,
                attributes: validated.attributes || {},
                cost_price: validated.cost_price,
                selling_price: validated.selling_price,
                reorder_threshold: validated.reorder_threshold,
                expiry_date: validated.expiry_date || null
            })
            .eq('id', variantId)
            // Extra auth check: ensure it belongs to the product
            .eq('product_id', id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Variant Detail PUT Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, variantId: string }> }) {
    const { id, variantId } = await params;
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

        const { data: member } = await supabase.from('business_members').select('role').eq('user_id', user.id).single()
        if (!member || member.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', variantId)
            .eq('product_id', id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Variant Detail DELETE Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
