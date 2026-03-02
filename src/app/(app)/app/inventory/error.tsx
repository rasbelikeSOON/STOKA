'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function InventoryError({
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
            title="Inventory failed to load"
        />
    )
}
