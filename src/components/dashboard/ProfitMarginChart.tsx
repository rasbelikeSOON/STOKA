'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function ProfitMarginChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No profit margin data.</p>
            </div>
        )
    }

    const chartData = [...data].slice(0, 10).map(d => ({
        name: d.name,
        margin: Math.round(d.marginPct)
    }))

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-gray-700 md:opacity-50" />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4B5563', fontSize: 12 }}
                        width={120}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                        formatter={(value: any) => [`${value}%`, 'Gross Margin']}
                        cursor={{ fill: '#F3F4F6', opacity: 0.1 }}
                    />
                    <Bar dataKey="margin" radius={[0, 4, 4, 0]} barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.margin > 40 ? '#10B981' : entry.margin > 20 ? '#F59E0B' : '#EF4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
