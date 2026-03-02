'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function ProductsError({
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
            title="Products failed to load"
        />
    )
}
