import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const businessSchema = z.object({
    name: z.string().min(2, "Business name is required"),
    currency: z.string().length(3).optional(),
    timezone: z.string().optional(),
    tax_rate: z.coerce.number().min(0).max(100).optional()
})

export async function GET(request: Request) {
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

        const { data: member } = await supabase.from('business_members').select('business_id').eq('user_id', user.id).single()
        if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', member.business_id)
            .single()

        if (error) throw new Error(error.message)

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const json = await request.json()
        const validated = businessSchema.parse(json)

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
        if (!member || member.role !== 'owner') return NextResponse.json({ error: 'Forbidden - Only owners can update business settings' }, { status: 403 })

        const { error } = await supabase
            .from('businesses')
            .update({
                name: validated.name,
                currency: validated.currency,
                timezone: validated.timezone,
                tax_rate: validated.tax_rate
            })
            .eq('id', member.business_id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
