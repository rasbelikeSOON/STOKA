export function StatusBadge({ status }: { status: string }) {
    if (status === 'confirmed') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Confirmed
            </span>
        )
    }

    if (status === 'cancelled') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Cancelled
            </span>
        )
    }

    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Pending
        </span>
    )
}

export function TypeBadge({ type }: { type: string }) {
    const colors: Record<string, string> = {
        purchase: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        sale: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        adjustment: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        return: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    }

    const colorClass = colors[type] || colors.adjustment

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${colorClass}`}>
            {type}
        </span>
    )
}
