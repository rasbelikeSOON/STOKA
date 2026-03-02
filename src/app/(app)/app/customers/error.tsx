'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function CustomersError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <RouteErrorBoundary
            error={error}
            reset={reset}
            title="Customers failed to load"
        />
    )
}
