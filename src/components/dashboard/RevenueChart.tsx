'use client'

import { format } from 'date-fns'
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[--text-primary] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{label}</p>
                <p className="text-lg font-black tracking-tight">
                    ₦{Number(payload[0].value).toLocaleString()}
                </p>
            </div>
        )
    }
    return null
}

export function RevenueChart({ data }: { data: any[] }) {

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-[--surface-muted]/30 rounded-2xl border border-dashed border-[--border]">
                <div className="text-[--brand-primary] mb-3 opacity-20">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <p className="text-sm font-bold text-[--text-muted]">Data Link Pending</p>
                <p className="text-[10px] text-[--text-muted] uppercase tracking-widest mt-1">Not enough data to generate graph</p>
            </div>
        )
    }

    // Format date for display
    const formattedData = data.map(d => ({
        ...d,
        displayDate: format(new Date(d.date), 'MMM d')
    }))

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--border)" className="opacity-50" />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                        dy={15}
                        minTickGap={30}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `₦${(value / 1000)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--brand-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="var(--brand-primary)"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--brand-primary)' }}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
