'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function DashboardError({
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
            title="Dashboard failed to load"
            backHref="/app/dashboard"
            backLabel="Reload Dashboard"
        />
    )
}
