'use client'

import { AlertTriangle, TrendingUp, TrendingDown, Info, Package, CheckCircle2, X } from 'lucide-react'

export function InsightCard({ insight, onRead, onDelete }: { insight: any, onRead: (id: string) => void, onDelete: (id: string) => void }) {
    const getIcon = () => {
        if (insight.type === 'low_stock' || insight.type === 'expiry_warning') return <AlertTriangle className="w-5 h-5" />
        if (insight.type === 'reorder') return <Package className="w-5 h-5" />
        if (insight.type === 'revenue_milestone' || insight.type === 'top_performer') return <TrendingUp className="w-5 h-5" />
        if (insight.type === 'slow_mover') return <TrendingDown className="w-5 h-5" />
        return <Info className="w-5 h-5" />
    }

    const getSeverityStyles = () => {
        switch (insight.severity) {
            case 'critical': return {
                card: 'border-rose-200 bg-gradient-to-br from-white to-rose-50',
                icon: 'bg-rose-100 text-rose-600',
                badge: 'bg-rose-100 text-rose-700',
                label: 'Critical'
            }
            case 'warning': return {
                card: 'border-amber-200 bg-gradient-to-br from-white to-amber-50',
                icon: 'bg-amber-100 text-amber-600',
                badge: 'bg-amber-100 text-amber-700',
                label: 'Warning'
            }
            default: return {
                card: 'border-[--border] bg-gradient-to-br from-white to-blue-50/30',
                icon: 'bg-[--brand-primary]/10 text-[--brand-primary]',
                badge: 'bg-blue-100 text-blue-700',
                label: 'Info'
            }
        }
    }

    const styles = getSeverityStyles()

    return (
        <div className={`p-6 rounded-3xl border relative shadow-sm transition-all duration-300 hover:shadow-md group ${styles.card} ${!insight.is_read ? 'ring-1 ring-[--brand-primary]/10' : 'opacity-70'}`}>
            {!insight.is_read && (
                <span className="absolute top-5 right-5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[--brand-primary] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[--brand-primary]"></span>
                </span>
            )}
            <div className="flex items-start gap-5">
                <div className={`p-3 rounded-2xl ${styles.icon} shrink-0`}>
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${styles.badge}`}>{styles.label}</span>
                    </div>
                    <h4 className="font-black text-[--text-primary] tracking-tight leading-snug">{insight.title}</h4>
                    <p className="text-[13px] font-medium text-[--text-muted] mt-1.5 leading-relaxed">{insight.message}</p>

                    <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[--border]/50">
                        {!insight.is_read && (
                            <button
                                onClick={() => onRead(insight.id)}
                                className="text-[11px] font-black uppercase tracking-widest text-[--brand-primary] hover:text-[--brand-primary-hover] flex items-center gap-1.5 transition-colors"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Read
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(insight.id)}
                            className="text-[11px] font-black uppercase tracking-widest text-[--text-muted] hover:text-rose-600 flex items-center gap-1.5 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
