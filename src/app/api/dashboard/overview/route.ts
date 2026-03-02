import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDashboardOverview } from '@/lib/queries/dashboard'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30', 10)

        // Auth & context
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

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: member } = await supabase
            .from('business_members')
            .select('business_id, role')
            .eq('user_id', user.id)
            .single()

        if (!member) return NextResponse.json({ error: 'No business found' }, { status: 403 })

        // Only owners and managers can view the dashboard
        if (member.role === 'staff') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)
        startDate.setHours(0, 0, 0, 0)

        const data = await getDashboardOverview(supabase, member.business_id, startDate, endDate)

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Dashboard Overview API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
