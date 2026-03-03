'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[--text-primary] text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{label}</p>
                <p className="text-lg font-black tracking-tight">
                    Spent: ₦{Number(payload[0].value).toLocaleString()}
                </p>
            </div>
        )
    }
    return null
}

export function PurchaseCostChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-[--surface-muted]/30 rounded-2xl border border-dashed border-[--border]">
                <p className="text-[10px] text-[--text-muted] uppercase tracking-widest font-black">No Purchase Data</p>
            </div>
        )
    }

    // Take top 7 suppliers
    const chartData = [...data].slice(0, 7)

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--border)" className="opacity-50" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                        dy={15}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `₦${(value / 1000)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-muted)', opacity: 0.4 }} />
                    <Bar
                        dataKey="total_spent"
                        fill="var(--brand-primary)"
                        radius={[10, 10, 0, 0]}
                        maxBarSize={45}
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.1)} fill="var(--brand-primary)" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
