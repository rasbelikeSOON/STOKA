'use client'

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
            <div className="h-12 bg-gray-50 dark:bg-[#0f1115] border-b border-gray-200 dark:border-gray-800 w-full" />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6 ml-auto" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg ml-4 shrink-0" />
                </div>
            ))}
        </div>
    )
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#16191f] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-32 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
            ))}
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-56" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40 mt-2" />
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-36" />
            </div>
            {/* KPI Cards */}
            <CardGridSkeleton count={4} />
            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-36 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-56 mb-6" />
                <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
            </div>
        </div>
    )
}

export function ChatSkeleton() {
    return (
        <div className="h-full bg-white relative animate-pulse">
            {/* Header */}
            <div className="h-14 bg-white/80 border-b border-gray-200 flex items-center px-4 sm:px-6">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="ml-3 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 bg-gray-200 rounded-full" />
                    <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
            </div>
            {/* Messages */}
            <div className="p-4 space-y-6">
                {/* Bot message */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1 max-w-md">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                </div>
                {/* User message */}
                <div className="flex gap-3 justify-end">
                    <div className="space-y-2 max-w-sm">
                        <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-full" />
                        <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-2/3 ml-auto" />
                    </div>
                </div>
                {/* Bot message */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1 max-w-lg">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
            </div>
            {/* Input */}
            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-gray-200 bg-white">
                <div className="h-12 bg-gray-100 rounded-xl" />
            </div>
        </div>
    )
}

export function InsightsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto pb-12 animate-pulse">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-36" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mt-2" />
                </div>
                <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-32" />
            </div>
            {/* Cards */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800" />
                ))}
            </div>
        </div>
    )
}

export function PageSkeleton() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-40" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mt-2" />
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-32" />
            </div>
            {/* Search bar */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
            {/* Table */}
            <TableSkeleton rows={6} />
        </div>
    )
}

export function SettingsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
            <div>
                <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-36" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-56 mt-2" />
            </div>
            {/* Tab bar */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-24" />
                ))}
            </div>
            {/* Form fields */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i}>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-2" />
                        <div className="h-10 bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
                    </div>
                ))}
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-28 mt-4" />
            </div>
        </div>
    )
}
