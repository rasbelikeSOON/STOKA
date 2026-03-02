import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const locationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    address: z.string().optional()
})

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const validated = locationSchema.parse(json)

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
        if (!member || member.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { data, error } = await supabase
            .from('locations')
            .insert({ ...validated, business_id: member.business_id })
            .select('id').single()

        if (error) throw new Error(error.message)

        return NextResponse.json({ id: data.id })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
