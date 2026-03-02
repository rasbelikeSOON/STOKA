'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function PurchaseCostChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No purchase data found.</p>
            </div>
        )
    }

    // Take top 7 suppliers
    const chartData = [...data].slice(0, 7)

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700 md:opacity-50" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `₦${(value / 1000)}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Spent']}
                        labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                        cursor={{ fill: '#F3F4F6', opacity: 0.1 }}
                    />
                    <Bar dataKey="total_spent" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
