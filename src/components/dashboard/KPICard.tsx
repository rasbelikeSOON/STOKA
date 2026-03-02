export function KPICard({
    title,
    value,
    trend,
    trendDirection,
    icon: Icon,
    className = ''
}: {
    title: string,
    value: string | number,
    trend?: string,
    trendDirection?: 'up' | 'down' | 'neutral',
    icon: any,
    className?: string
}) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-500">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                {trend && (
                    <span className={`text-sm font-medium ${trendDirection === 'up' ? 'text-green-600 dark:text-green-400' :
                            trendDirection === 'down' ? 'text-red-600 dark:text-red-400' :
                                'text-gray-500 dark:text-gray-400'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    )
}
