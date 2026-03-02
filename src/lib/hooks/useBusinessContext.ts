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
                if (authError || !user) throw authError || new Error('No user found')

                setUser(user)

                const { data: members, error: memberError } = await supabase
                    .from('business_members')
                    .select('business_id, role')
                    .eq('user_id', user.id)
                    .limit(1)

                if (memberError) throw memberError

                if (members && members.length > 0) {
                    setBusiness(members[0].business_id, members[0].role)
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
