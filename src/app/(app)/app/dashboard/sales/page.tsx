'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { SalesBreakdownChart } from '@/components/dashboard/SalesBreakdownChart'
import { TopProductsTable } from '@/components/dashboard/TopProductsTable'
import { ExportButton } from '@/components/dashboard/ExportButton'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function SalesDashboard() {
  const { businessId } = useBusinessContext()
  const [days, setDays] = useState(30)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!businessId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/dashboard/sales?days=${days}`)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Breakdown of product performance</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter days={days} setDays={setDays} />
          {data?.topProducts && <ExportButton data={data.topProducts} filename="top_products" />}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sales by Category */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[420px]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Category</h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <SalesBreakdownChart data={data.salesByCategory || []} />
            </div>
          </div>

          {/* Top Products Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[420px] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Products</h2>
            </div>
            <TopProductsTable data={data.topProducts || []} />
          </div>

        </div>
      ) : (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Failed to load sales data.</p>
        </div>
      )}
    </div>
  )
}
