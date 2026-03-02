'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { ReactNode } from 'react'

export function RoleGate({
    allowed,
    children,
    fallback = null
}: {
    allowed: ('owner' | 'manager' | 'staff')[]
    children: ReactNode
    fallback?: ReactNode
}) {
    const role = useAuthStore(s => s.role)

    // If role is null, auth is likely not loaded yet.
    if (!role) return null

    if (!allowed.includes(role)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
