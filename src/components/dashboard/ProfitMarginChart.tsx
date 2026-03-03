'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[--text-primary] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{label}</p>
                <p className="text-lg font-black tracking-tight">
                    Margin: {payload[0].value}%
                </p>
            </div>
        )
    }
    return null
}

export function ProfitMarginChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-[--surface-muted]/30 rounded-2xl border border-dashed border-[--border]">
                <p className="text-[10px] text-[--text-muted] uppercase tracking-widest font-black">Limited Margin Data</p>
            </div>
        )
    }

    const chartData = [...data].slice(0, 8).map(d => ({
        name: d.name,
        margin: Math.round(d.marginPct)
    }))

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="6 6" horizontal={false} stroke="var(--border)" className="opacity-50" />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 900 }}
                        width={120}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-muted)', opacity: 0.4 }} />
                    <Bar dataKey="margin" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1500}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.margin > 40 ? '#10B981' : entry.margin > 20 ? 'var(--brand-primary)' : '#F59E0B'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
