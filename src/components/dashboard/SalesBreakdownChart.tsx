'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1']

export function SalesBreakdownChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No category sales data.</p>
            </div>
        )
    }

    const chartData = data.sort((a, b) => b.value - a.value)

    return (
        <div className="w-full h-72 pb-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                        itemStyle={{ color: '#E0E7FF' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
