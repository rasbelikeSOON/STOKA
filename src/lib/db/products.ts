import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getRelevantProducts(businessId: string) {
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

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id, name, category,
            product_variants (
                id, size, color, scent, flavor, selling_price, cost_price,
                stock_levels ( quantity, location_id )
            )
        `)
        .eq('business_id', businessId)

    if (error || !products) return []

    // Map and flatten for the AI
    return products.map(p => {
        let currentStock = 0
        const variants = p.product_variants.map((v: any) => {
            const variantStock = v.stock_levels.reduce((sum: number, sl: any) => sum + sl.quantity, 0)
            currentStock += variantStock
            return {
                id: v.id,
                size: v.size, color: v.color, scent: v.scent, flavor: v.flavor,
                sellingPrice: v.selling_price, costPrice: v.cost_price,
                currentStock: variantStock
            }
        })

        return {
            id: p.id,
            name: p.name,
            category: p.category,
            currentStock,
            variants
        }
    })
}
