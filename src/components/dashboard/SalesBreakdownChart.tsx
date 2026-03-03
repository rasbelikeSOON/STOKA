'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = [
    'var(--brand-primary)',
    '#10B981', // emerald
    '#F59E0B', // amber
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
]

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[--text-primary] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{payload[0].name}</p>
                <p className="text-lg font-black tracking-tight">
                    ₦{Number(payload[0].value).toLocaleString()}
                </p>
            </div>
        )
    }
    return null
}

export function SalesBreakdownChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-[--surface-muted]/30 rounded-2xl border border-dashed border-[--border]">
                <p className="text-[10px] text-[--text-muted] uppercase tracking-widest font-black">Limited Data Points</p>
            </div>
        )
    }

    const chartData = data.sort((a, b) => b.value - a.value)

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-[11px] font-bold text-[--text-secondary] uppercase tracking-widest ml-1">{value}</span>
                        )}
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
