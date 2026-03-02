export function StockBadge({ quantity, threshold = 5 }: { quantity: number, threshold?: number }) {
    if (quantity <= 0) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Out of Stock
            </span>
        )
    }

    if (quantity <= threshold) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Low Stock
            </span>
        )
    }

    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            In Stock
        </span>
    )
}
