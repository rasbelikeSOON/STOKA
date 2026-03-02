import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { productSchema } from '@/lib/validations/product'

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

        // Verify access implicitly via RLS
        const { data: product, error } = await supabase
            .from('products')
            .select(`
        *,
        suppliers (id, name),
        product_variants (
           *,
           stock_levels ( location_id, quantity, locations(name) )
        )
      `)
            .eq('id', id)
            .single()

        if (error) throw new Error(error.message)
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        return NextResponse.json(product)

    } catch (error: any) {
        console.error('Product Detail GET Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
    try {
        const json = await request.json()
        const product = productSchema.parse(json)

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

        // Check member role before updating
        const { data: member } = await supabase.from('business_members').select('role').eq('user_id', user.id).single()
        if (member?.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { error } = await supabase
            .from('products')
            .update({
                name: product.name,
                description: product.description,
                category: product.category,
                supplier_id: product.supplier_id || null
            })
            .eq('id', id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Product Detail PUT Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        // Only owners can delete products
        const { data: member } = await supabase.from('business_members').select('role').eq('user_id', user.id).single()
        if (!member || member.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Product Detail DELETE Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
