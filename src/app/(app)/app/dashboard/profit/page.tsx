'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ProfitMarginChart } from '@/components/dashboard/ProfitMarginChart'
import { ExportButton } from '@/components/dashboard/ExportButton'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export default function ProfitDashboard() {
  const { businessId, user } = useBusinessContext()
  const [days, setDays] = useState(30)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [errorMSG, setErrorMSG] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!businessId) return
      setLoading(true)
      setErrorMSG(null)
      try {
        const res = await fetch(`/api/dashboard/profit?days=${days}`)
        const json = await res.json()
        if (res.ok) {
          setData(json)
        } else {
          setErrorMSG(json.error)
        }
      } catch (err: any) {
        console.error(err)
        setErrorMSG('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [businessId, days])

  if (errorMSG === 'Forbidden') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          The Profit Margin report contains sensitive financial data and is restricted to Business Owners only.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profit Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gross margins normalized by product</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter days={days} setDays={setDays} />
          {data?.marginBreakdown && <ExportButton data={data.marginBreakdown} filename="profit_margins" />}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
      ) : errorMSG ? (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-red-500">{errorMSG}</p>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-6">

          {/* Top Margins Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gross Margin by Product (Top 10)</h2>
            </div>
            <ProfitMarginChart data={data.marginBreakdown || []} />
          </div>

          {/* Full Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Margin Report</h2>
            </div>
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Product Name</th>
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Units Sold</th>
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Total Revenue</th>
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Total Cost (COGS)</th>
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Gross Profit</th>
                    <th className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.marginBreakdown.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{row.name}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{row.unitsSold}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">₦{row.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">₦{row.cost.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">₦{row.grossProfit.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.marginPct > 40 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            row.marginPct > 20 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {row.marginPct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.marginBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No sales data found to calculate profit margins for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  )
}
