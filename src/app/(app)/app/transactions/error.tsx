'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function TransactionsError({
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
            title="Transactions failed to load"
        />
    )
}
