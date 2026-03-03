import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function StatCard({
    label,
    value,
    subValue,
    icon: Icon,
    color = 'primary'
}: {
    label: string,
    value: string | number,
    subValue?: string,
    icon: LucideIcon,
    color?: 'primary' | 'success' | 'warning' | 'error'
}) {
    const colorClasses = {
        primary: 'text-[--brand-primary] bg-[--surface-muted]',
        success: 'text-emerald-600 bg-emerald-50',
        warning: 'text-amber-600 bg-amber-50',
        error: 'text-rose-600 bg-rose-50'
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-[--border] shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all duration-300">
            <div className={cn("p-4 rounded-xl group-hover:scale-110 transition-transform duration-300", colorClasses[color])}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[--text-muted] mb-0.5">{label}</p>
                <h4 className="text-2xl font-black text-[--text-primary] tracking-tight">{value}</h4>
                {subValue && (
                    <p className="text-[10px] font-bold text-[--text-muted] mt-0.5">{subValue}</p>
                )}
            </div>
        </div>
    )
}
