'use client'

import { AlertCircle, AlertTriangle, TrendingUp, TrendingDown, Info, Package, Bell, CheckCircle2 } from 'lucide-react'

export function InsightCard({ insight, onRead, onDelete }: { insight: any, onRead: (id: string) => void, onDelete: (id: string) => void }) {
    const getIcon = () => {
        if (insight.type === 'low_stock' || insight.type === 'expiry_warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />
        if (insight.type === 'reorder') return <Package className="w-5 h-5 text-blue-500" />
        if (insight.type === 'revenue_milestone' || insight.type === 'top_performer') return <TrendingUp className="w-5 h-5 text-emerald-500" />
        if (insight.type === 'slow_mover') return <TrendingDown className="w-5 h-5 text-indigo-500" />
        return <Info className="w-5 h-5 text-gray-500" />
    }

    const getSeverityBg = () => {
        switch (insight.severity) {
            case 'critical': return 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30'
            case 'warning': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30'
            default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30'
        }
    }

    return (
        <div className={`p-4 rounded-xl border relative shadow-sm transition-all duration-300 ${getSeverityBg()} ${!insight.is_read ? 'opacity-100 ring-1 ring-blue-500/20' : 'opacity-70 grayscale-[0.2]'}`}>
            {!insight.is_read && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
            )}
            <div className="flex items-start gap-4">
                <div className="mt-1 bg-white dark:bg-[#16191f] p-2 flex-shrink-0 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white leading-tight">{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.message}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4">
                        {!insight.is_read && (
                            <button
                                onClick={() => onRead(insight.id)}
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Read
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(insight.id)}
                            className="text-xs font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
