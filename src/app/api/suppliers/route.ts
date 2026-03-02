import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations/contact'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
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

        const { data: member } = await supabase.from('business_members').select('business_id').eq('user_id', user.id).single()
        if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        let query = supabase
            .from('suppliers')
            .select('*')
            .eq('business_id', member.business_id)
            .order('name', { ascending: true })

        if (q) {
            query = query.ilike('name', `%${q}%`)
        }

        const { data, error } = await query
        if (error) throw new Error(error.message)

        return NextResponse.json({ data })

    } catch (error: any) {
        console.error('Suppliers GET API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const validated = contactSchema.parse(json)

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
        if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        if (member.role === 'staff') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { data, error } = await supabase
            .from('suppliers')
            .insert({ ...validated, business_id: member.business_id })
            .select('id').single()

        if (error) throw new Error(error.message)

        return NextResponse.json({ id: data.id })

    } catch (error: any) {
        console.error('Suppliers POST API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
