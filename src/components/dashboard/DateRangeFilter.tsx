'use client'

import { Calendar } from 'lucide-react'

export function DateRangeFilter({
    days,
    setDays
}: {
    days: number,
    setDays: (n: number) => void
}) {
    return (
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
            <div className="px-2 hidden sm:flex text-gray-400 dark:text-gray-500">
                <Calendar className="w-4 h-4" />
            </div>
            {[7, 30, 90].map((num) => (
                <button
                    key={num}
                    onClick={() => setDays(num)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${days === num
                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    {num}D
                </button>
            ))}
        </div>
    )
}
