'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import { KPICard } from '@/components/dashboard/KPICard'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { InsightsSummaryCard } from '@/components/dashboard/InsightsSummaryCard'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Key metrics and revenue trends</p>
        </div>
        <DateRangeFilter days={days} setDays={setDays} />
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
      ) : data ? (
        <>
          <InsightsSummaryCard count={data.lowStockCount > 0 ? 1 : 0} />

          <KPIGrid>
            <KPICard
              title="Total Sales Revenue"
              value={`₦${(data.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
            />
            <KPICard
              title="Total Purchases"
              value={`₦${(data.totalPurchases || 0).toLocaleString()}`}
              icon={ShoppingCart}
            />
            <KPICard
              title="Gross Profit"
              value={`₦${(data.grossProfit || 0).toLocaleString()}`}
              trend={`${(data.profitMargin || 0).toFixed(1)}% margin`}
              trendDirection={data.profitMargin > 0 ? 'up' : 'neutral'}
              icon={TrendingUp}
            />
            <KPICard
              title="Low Stock Items"
              value={data.lowStockCount || 0}
              trend="Requires Action"
              trendDirection={data.lowStockCount > 0 ? 'down' : 'neutral'}
              icon={AlertTriangle}
            />
          </KPIGrid>

          {/* Charts */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sales velocity over the last {days} days</p>
            </div>
            <RevenueChart data={data.revenueChartData || []} />
          </div>
        </>
      ) : (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data.</p>
        </div>
      )}
    </div>
  )
}
