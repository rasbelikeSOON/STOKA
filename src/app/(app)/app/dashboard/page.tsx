'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Loader2, Calendar } from 'lucide-react'
import { KPICard } from '@/components/dashboard/KPICard'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { InsightsSummaryCard } from '@/components/dashboard/InsightsSummaryCard'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'
import { Button } from '@/components/ui/Button'

export default function DashboardOverview() {
  const { businessId } = useBusinessContext()
  const [days, setDays] = useState(30)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!businessId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/dashboard/overview?days=${days}`)
        const json = await res.json()
        if (res.ok) setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [businessId, days])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[--text-primary] tracking-tight">Performance Overview</h1>
          <p className="mt-1 text-[--text-muted] font-medium">Real-time business metrics and financial health</p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangeFilter days={days} setDays={setDays} />
        </div>
      </div>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[--brand-primary] mb-4 opacity-70" />
          <p className="text-[--text-muted] font-bold uppercase tracking-widest text-[10px]">Syncing live metrics...</p>
        </div>
      ) : data ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <InsightsSummaryCard count={data.lowStockCount > 0 ? 1 : 0} />

          <KPIGrid>
            <KPICard
              title="Sales Revenue"
              value={`₦${(data.totalRevenue || 0).toLocaleString()}`}
              trend="Current Period"
              icon={DollarSign}
            />
            <KPICard
              title="Inventory Spend"
              value={`₦${(data.totalPurchases || 0).toLocaleString()}`}
              trend="Purchase Value"
              icon={ShoppingCart}
            />
            <KPICard
              title="Gross Profit"
              value={`₦${(data.grossProfit || 0).toLocaleString()}`}
              trend={`${(data.profitMargin || 0).toFixed(1)}% Margin`}
              trendDirection={data.profitMargin > 15 ? 'up' : 'neutral'}
              icon={TrendingUp}
            />
            <KPICard
              title="Stock Alerts"
              value={data.lowStockCount || 0}
              trend={data.lowStockCount > 0 ? "Action Required" : "Stock Healthy"}
              trendDirection={data.lowStockCount > 0 ? 'down' : 'up'}
              icon={AlertTriangle}
            />
          </KPIGrid>

          {/* Main Chart Section */}
          <div className="bg-white rounded-3xl border border-[--border] shadow-sm p-8 group hover:shadow-xl hover:shadow-[--brand-primary]/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-black text-[--text-primary] tracking-tight">Revenue Velocity</h2>
                <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Daily sales distribution • Last {days} days</p>
              </div>
              <div className="h-10 w-10 bg-[--surface-muted] text-[--brand-primary] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <RevenueChart data={data.revenueChartData || []} />
          </div>

          {/* Quick Actions / Reports Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-10 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">Available Reports:</p>
            <div className="flex gap-2">
              {['Sales', 'Purchases', 'Profit & Loss'].map(report => (
                <span key={report} className="px-3 py-1 bg-[--surface-muted] text-[--text-secondary] rounded-lg text-[10px] font-bold border border-[--border]">
                  {report}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-[--border] p-10 text-center">
          <div className="h-16 w-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[--text-primary]">Data Link Interrupted</h3>
          <p className="text-[--text-muted] max-w-xs mx-auto mt-2">We encountered an issue retrieving your dashboard metrics. Please check your connection and try again.</p>
          <Button variant="outline" className="mt-6 h-11 px-8" onClick={() => window.location.reload()}>Retry Sync</Button>
        </div>
      )}
    </div>
  )
}
