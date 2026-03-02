import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuthClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        // Verify user is logged in
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
                    }
                }
            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Find invitation
        const { data: invite, error: inviteError } = await adminAuthClient
            .from('invitations')
            .select('*')
            .eq('token', token)
            .is('accepted_at', null)
            .single()

        if (inviteError || !invite) return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 })

        // Check if invitation expired
        if (new Date(invite.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Invitation expired' }, { status: 400 })
        }

        // Add to business_members
        const { error: memberError } = await adminAuthClient
            .from('business_members')
            .insert({
                business_id: invite.business_id,
                user_id: user.id,
                role: invite.role
            })

        if (memberError && memberError.code !== '23505') {
            throw memberError
        }

        // Mark as accepted
        await adminAuthClient
            .from('invitations')
            .update({ accepted_at: new Date().toISOString() })
            .eq('id', invite.id)

        return NextResponse.json({ success: true, businessId: invite.business_id })
    } catch (error: any) {
        console.error('Accept Invite Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
