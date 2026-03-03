import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

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
    icon: LucideIcon,
    className?: string
}) {
    return (
        <div className={cn(
            "bg-white rounded-2xl p-6 border border-[--border] shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-[--brand-primary]/5",
            className
        )}>
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[--surface-muted] rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-[--surface-muted] text-[--brand-primary] rounded-xl group-hover:bg-[--brand-primary] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border",
                            trendDirection === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                trendDirection === 'down' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                    "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                            {trend}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black text-[--text-primary] tracking-tight">
                        {value}
                    </h3>
                </div>
            </div>
        </div>
    )
}
