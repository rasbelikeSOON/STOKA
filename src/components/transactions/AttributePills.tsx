export function AttributePills({ attributes }: { attributes: Record<string, string> }) {
    if (!attributes || Object.keys(attributes).length === 0) return null

    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {Object.entries(attributes).map(([key, val]) => (
                <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 uppercase tracking-widest">
                    {key}: {val}
                </span>
            ))}
        </div>
    )
}
