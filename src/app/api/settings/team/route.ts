import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

        // Use the auth_users view or relation if available for joined email
        const { data: members, error } = await supabase
            .from('business_members')
            .select('id, user_id, role, created_at, auth_users:user_id(email)')
            .eq('business_id', member.business_id)

        if (error) throw new Error(error.message)

        return NextResponse.json({ data: members })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
