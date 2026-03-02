'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface RouteErrorBoundaryProps {
    error: Error & { digest?: string }
    reset: () => void
    title?: string
    backHref?: string
    backLabel?: string
}

export function RouteErrorBoundary({
    error,
    reset,
    title = 'Something went wrong',
    backHref = '/app/dashboard',
    backLabel = 'Back to Dashboard',
}: RouteErrorBoundaryProps) {
    useEffect(() => {
        console.error(`[Stoka Error]: ${error.message}`, error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-400/20 dark:bg-red-500/10 rounded-full blur-xl scale-150" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-sm border border-red-200 dark:border-red-800/50">
                    <AlertCircle className="w-8 h-8" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-2 text-sm">
                An unexpected error occurred. Our team has been notified.
            </p>
            {error.digest && (
                <p className="text-xs text-gray-400 dark:text-gray-600 font-mono mb-6">
                    Error ID: {error.digest}
                </p>
            )}

            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                </button>
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#16191f] text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm"
                >
                    <Home className="w-4 h-4" />
                    {backLabel}
                </Link>
            </div>
        </div>
    )
}
