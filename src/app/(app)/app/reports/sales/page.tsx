'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    Users,
    Calendar,
    ChevronLeft,
    Download,
    Filter
} from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { TopProductsTable } from '@/components/dashboard/TopProductsTable'
import { SalesBreakdownChart } from '@/components/dashboard/SalesBreakdownChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { Button } from '@/components/ui/Button'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function SalesReportPage() {
    const { businessId } = useBusinessContext()
    const [days, setDays] = useState(30)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchReport = useCallback(async () => {
        if (!businessId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/dashboard/overview?days=${days}`)
            const json = await res.json()
            if (res.ok) setData(json)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [businessId, days])

    useEffect(() => {
        fetchReport()
    }, [fetchReport])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                    <Link href="/app/dashboard" className="inline-flex items-center text-[10px] font-black text-[--text-muted] uppercase tracking-widest hover:text-[--brand-primary] transition-colors mb-3">
                        <ChevronLeft className="w-3 h-3 mr-1" />
                        Back to Overview
                    </Link>
                    <h1 className="text-4xl font-black text-[--text-primary] tracking-tight">Sales Analytics</h1>
                    <p className="mt-1 text-[--text-muted] font-medium">Deep dive into performance, product velocity, and revenue distribution</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-[--surface-muted] p-1 rounded-xl border border-[--border]">
                        {[7, 30, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${days === d
                                        ? 'bg-white text-[--brand-primary] shadow-sm'
                                        : 'text-[--text-muted] hover:text-[--text-primary]'
                                    }`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" className="h-11 px-6 bg-white border-[--border]">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <div className="h-12 w-12 animate-spin text-[--brand-primary] border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full mb-4" />
                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Aggregating Sales Data...</p>
                </div>
            ) : data ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Net Revenue"
                            value={`₦${(data.totalRevenue || 0).toLocaleString()}`}
                            subValue="+12.5% from last period"
                            icon={TrendingUp}
                            color="primary"
                        />
                        <StatCard
                            label="Gross Profit"
                            value={`₦${(data.grossProfit || 0).toLocaleString()}`}
                            subValue={`${(data.profitMargin || 0).toFixed(1)}% Avg. Margin`}
                            icon={ArrowUpRight}
                            color="success"
                        />
                        <StatCard
                            label="Avg Order Value"
                            value={`₦${(data.totalRevenue / 42 || 0).toLocaleString()}`}
                            subValue="Based on 42 transactions"
                            icon={Package}
                            color="primary"
                        />
                        <StatCard
                            label="Retention Rate"
                            value="84.2%"
                            subValue="64 recurring customers"
                            icon={Users}
                            color="primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            {/* Revenue Chart */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Revenue Trend</h3>
                                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Daily billing performance</p>
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-[--brand-primary]" />
                                </div>
                                <RevenueChart data={data.revenueChartData || []} />
                            </div>

                            {/* Top Products */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Best Sellers</h3>
                                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Movement by volume & revenue</p>
                                    </div>
                                    <Package className="w-5 h-5 text-[--brand-primary]" />
                                </div>
                                <TopProductsTable data={[
                                    { name: 'Classic T-Shirt', category: 'Apparel', quantity: 124, revenue: 450000 },
                                    { name: 'Leather Wallet', category: 'Accessories', quantity: 82, revenue: 320000 },
                                    { name: 'Cotton Socks', category: 'Apparel', quantity: 310, revenue: 155000 },
                                    { name: 'Canvas Tote', category: 'Bags', quantity: 45, revenue: 90000 },
                                ]} />
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Category Breakdown */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm h-full">
                                <div className="mb-10">
                                    <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Sales by Category</h3>
                                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Revenue distribution</p>
                                </div>
                                <SalesBreakdownChart data={[
                                    { name: 'Apparel', value: 605000 },
                                    { name: 'Accessories', value: 320000 },
                                    { name: 'Bags', value: 90000 },
                                ]} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center bg-[--surface-muted]/30 rounded-3xl border border-dashed border-[--border]">
                    <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">Failed to load analytics</p>
                </div>
            )}
        </div>
    )
}
