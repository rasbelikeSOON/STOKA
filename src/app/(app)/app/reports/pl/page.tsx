'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    TrendingUp,
    ArrowUpRight,
    ChevronLeft,
    Download,
    DollarSign,
    PieChart as PieChartIcon,
    AlertCircle,
    Info
} from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { ProfitMarginChart } from '@/components/dashboard/ProfitMarginChart'
import { Button } from '@/components/ui/Button'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function PLReportPage() {
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
                    <h1 className="text-4xl font-black text-[--text-primary] tracking-tight">Financial Health (P&L)</h1>
                    <p className="mt-1 text-[--text-muted] font-medium">Net earnings, cost of goods, and margin analysis</p>
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
                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Calculating Financials...</p>
                </div>
            ) : data ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Gross Revenue"
                            value={`₦${(data.totalRevenue || 0).toLocaleString()}`}
                            subValue="Total sales income"
                            icon={DollarSign}
                            color="primary"
                        />
                        <StatCard
                            label="Cost of Goods (COGS)"
                            value={`₦${((data.totalRevenue || 0) - (data.grossProfit || 0)).toLocaleString()}`}
                            subValue="Inventory value used"
                            icon={PieChartIcon}
                            color="warning"
                        />
                        <StatCard
                            label="Gross Profit"
                            value={`₦${(data.grossProfit || 0).toLocaleString()}`}
                            subValue={`${(data.profitMargin || 0).toFixed(1)}% Avg. Margin`}
                            icon={TrendingUp}
                            color="success"
                        />
                        <StatCard
                            label="Net Operating Profit"
                            value={`₦${(data.grossProfit * 0.9 || 0).toLocaleString()}`}
                            subValue="Est. after overhead"
                            icon={ArrowUpRight}
                            color="success"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            {/* Margin Analysis */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Margin by Product</h3>
                                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Efficiency across top catalog items</p>
                                    </div>
                                    <PieChartIcon className="w-5 h-5 text-[--brand-primary]" />
                                </div>
                                <ProfitMarginChart data={[
                                    { name: 'Leather Wallet', marginPct: 64 },
                                    { name: 'Classic T-Shirt', marginPct: 42 },
                                    { name: 'Canvas Tote', marginPct: 35 },
                                    { name: 'Cotton Socks', marginPct: 18 },
                                ]} />
                            </div>

                            {/* Breakdown Table */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm">
                                <h3 className="text-xl font-black text-[--text-primary] tracking-tight mb-8">P&L Breakdown</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-4 border-b border-[--border]">
                                        <span className="font-bold text-[--text-secondary]">Total Revenue</span>
                                        <span className="font-black text-[--text-primary] tracking-tight">₦{(data.totalRevenue || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-4 border-b border-[--border] text-red-600 bg-red-50/30 px-3 rounded-lg">
                                        <span className="font-bold">Total Cost of Goods</span>
                                        <span className="font-black tracking-tight">-₦{((data.totalRevenue || 0) - (data.grossProfit || 0)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-6 px-3">
                                        <span className="text-xl font-black text-[--text-primary]">Gross Profit</span>
                                        <span className="text-2xl font-black text-[--brand-primary] tracking-tighter">₦{(data.grossProfit || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Financial Tips */}
                            <div className="bg-[--text-primary] text-white rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Info className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight">Financial Insight</h3>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-white/80">
                                    Your average profit margin is sitting at <span className="text-white font-black">{(data.profitMargin || 0).toFixed(1)}%</span>. To optimize for growth, focus on items with margins above 40%.
                                </p>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Recommendation</p>
                                    <p className="text-xs font-bold">Review supplier pricing for 'Cotton Socks' to improve overall net performance.</p>
                                </div>
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
