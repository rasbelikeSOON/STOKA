'use client'

import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export default function ChatError({
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
            title="Chat failed to load"
            backHref="/app/chat"
            backLabel="Reload Chat"
        />
    )
}
