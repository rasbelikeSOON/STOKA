import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getBusinessContext(businessId: string) {
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

    // Parallel fetch Business Details, User Details, and Active Location
    const [businessData, memberData, locationData] = await Promise.all([
        supabase.from('businesses').select('name, currency').eq('id', businessId).single(),
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return null;
            const { data } = await supabase.from('business_members').select('role, user_id').eq('business_id', businessId).eq('user_id', user.id).single()
            return { email: user.email, role: data?.role || 'staff' }
        }),
        supabase.from('locations').select('name').eq('business_id', businessId).eq('is_default', true).limit(1).maybeSingle()
    ])

    return {
        businessName: businessData.data?.name || 'Stoka Business',
        currency: businessData.data?.currency || 'NGN',
        userEmail: memberData?.email || 'User',
        userRole: memberData?.role || 'Staff Member',
        locationName: locationData.data?.name || 'Main Store'
    }
}
