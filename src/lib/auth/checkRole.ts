import { SupabaseClient } from '@supabase/supabase-js'

export async function checkRole(
    supabase: SupabaseClient,
    businessId: string,
    requiredRoles: ('owner' | 'manager' | 'staff')[]
) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { authorized: false, role: null }

    const { data: member } = await supabase
        .from('business_members')
        .select('role')
        .eq('business_id', businessId)
        .eq('user_id', user.id)
        .single()

    if (!member || !requiredRoles.includes(member.role)) {
        return { authorized: false, role: member?.role || null }
    }

    return { authorized: true, role: member.role }
}
