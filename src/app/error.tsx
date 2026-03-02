'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong!</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                An unexpected error occurred deeply within the application.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
            >
                Try again
            </button>
        </div>
    )
}
