'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { PurchaseCostChart } from '@/components/dashboard/PurchaseCostChart'
import { SupplierBreakdownTable } from '@/components/dashboard/SupplierBreakdownTable'
import { ExportButton } from '@/components/dashboard/ExportButton'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function PurchasesDashboard() {
  const { businessId } = useBusinessContext()
  const [days, setDays] = useState(30)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!businessId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/dashboard/purchases?days=${days}`)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Cost Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Breakdown of supplier spending</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter days={days} setDays={setDays} />
          {data?.topSuppliers && <ExportButton data={data.topSuppliers} filename="supplier_spending" />}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Suppliers Chart */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[420px]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spend by Supplier (Top 7)</h2>
            </div>
            <div className="flex-1">
              <PurchaseCostChart data={data.topSuppliers || []} />
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[420px] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supplier Payments</h2>
            </div>
            <SupplierBreakdownTable data={data.topSuppliers || []} />
          </div>

        </div>
      ) : (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Failed to load purchase data.</p>
        </div>
      )}
    </div>
  )
}
