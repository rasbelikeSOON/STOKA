import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/useAuthStore'

export function useBusinessContext() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const supabase = createClient()
    const { user, setUser, setBusiness, businessId } = useAuthStore()

    useEffect(() => {
        async function loadContext() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()
                if (authError || !user) {
                    setIsLoading(false)
                    return
                }

                setUser(user)

                const { data: members, error: memberError } = await supabase
                    .from('business_members')
                    .select('business_id, role')
                    .eq('user_id', user.id)
                    .limit(1)

                if (memberError) {
                    console.error('Error loading business members:', memberError)
                    setError(new Error('Failed to load business data. Please ensure your account is set up correctly.'))
                    setIsLoading(false)
                    return
                }

                if (members && members.length > 0) {
                    setBusiness(members[0].business_id, members[0].role)
                } else {
                    console.info('User has no business membership yet (likely onboarding)')
                    // We don't throw an error here because being without a business is a valid state 
                    // (it just means they need to go to /onboarding)
                }
            } catch (err: any) {
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }

        loadContext()
    }, [supabase, setUser, setBusiness])

    return { isLoading, error, user, businessId }
}
