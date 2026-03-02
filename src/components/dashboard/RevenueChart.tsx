'use client'

import { format } from 'date-fns'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Not enough data to graph.</p>
            </div>
        )
    }

    // Format date for display
    const formattedData = data.map(d => ({
        ...d,
        displayDate: format(new Date(d.date), 'MMM d')
    }))

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700 md:opacity-50" />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `₦${(value / 1000)}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Revenue']}
                        labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                        itemStyle={{ color: '#E0E7FF' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
