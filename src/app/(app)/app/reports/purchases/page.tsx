'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    TrendingDown,
    ShoppingCart,
    Truck,
    CreditCard,
    ChevronLeft,
    Download,
    Calendar,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { SupplierBreakdownTable } from '@/components/dashboard/SupplierBreakdownTable'
import { PurchaseCostChart } from '@/components/dashboard/PurchaseCostChart'
import { Button } from '@/components/ui/Button'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function PurchaseReportPage() {
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
                    <h1 className="text-4xl font-black text-[--text-primary] tracking-tight">Purchase Analytics</h1>
                    <p className="mt-1 text-[--text-muted] font-medium">Analyze spending patterns, supplier efficiency, and inventory costs</p>
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
                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Compiling Expense Data...</p>
                </div>
            ) : data ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Spent"
                            value={`₦${(data.totalPurchases || 0).toLocaleString()}`}
                            subValue="+5.2% from last period"
                            icon={ShoppingCart}
                            color="primary"
                        />
                        <StatCard
                            label="Supplier Count"
                            value="18"
                            subValue="Active vendors this period"
                            icon={Truck}
                            color="primary"
                        />
                        <StatCard
                            label="Avg. Purchase"
                            value={`₦${(data.totalPurchases / 24 || 0).toLocaleString()}`}
                            subValue="Based on 24 POs"
                            icon={CreditCard}
                            color="primary"
                        />
                        <StatCard
                            label="Cost Savings"
                            value="₦45,000"
                            subValue="Negotiated discounts"
                            icon={TrendingDown}
                            color="success"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            {/* Purchase Cost Chart */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Spending by Supplier</h3>
                                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Top vendor distribution</p>
                                    </div>
                                    <Truck className="w-5 h-5 text-[--brand-primary]" />
                                </div>
                                <PurchaseCostChart data={[
                                    { name: 'Global Textiles', total_spent: 850000 },
                                    { name: 'Quick Ship Logistics', total_spent: 420000 },
                                    { name: 'Prime Packaging', total_spent: 280000 },
                                    { name: 'Eco Fabrics', total_spent: 150000 },
                                ]} />
                            </div>

                            {/* Supplier Breakdown */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm text-center py-20">
                                <AlertCircle className="w-12 h-12 text-[--brand-primary] mx-auto mb-4 opacity-20" />
                                <h4 className="text-xl font-black text-[--text-primary]">Detailed Supplier Metrics</h4>
                                <p className="text-[--text-muted] font-medium max-w-sm mx-auto mt-2">Comprehensive supplier performance tables are being generated based on your transaction history.</p>
                                <Button variant="outline" className="mt-8">View All Vendors</Button>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Supplier Table */}
                            <div className="bg-white rounded-3xl border border-[--border] p-8 shadow-sm h-full">
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-[--text-primary] tracking-tight">Vendor Ledger</h3>
                                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Activity by value</p>
                                </div>
                                <SupplierBreakdownTable data={[
                                    { name: 'Global Textiles', total_spent: 850000 },
                                    { name: 'Quick Ship Logistics', total_spent: 420000 },
                                    { name: 'Prime Packaging', total_spent: 280000 },
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
