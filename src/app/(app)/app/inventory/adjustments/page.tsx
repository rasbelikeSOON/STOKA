'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdj() {
      try {
        const res = await fetch('/api/inventory/adjustments')
        const data = await res.json()
        setAdjustments(data.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAdj()
  }, [])

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link
        href="/app/inventory"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Adjustments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">History of manual stock intakes, losses, and corrections.</p>
      </div>

      <div className="bg-white dark:bg-[#0f1115] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading adjustment history...</div>
        ) : adjustments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No manual adjustments found. (Normal sales/purchases appear in Transactions).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-[#16191f] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Items Affected</th>
                  <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Location</th>
                  <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Notes</th>
                  <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {format(new Date(adj.created_at), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-4 space-y-1">
                        {adj.transaction_items?.map((ti: any, i: number) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{ti.quantity > 0 ? '+' : ''}{ti.quantity}</span> x {ti.product_variants?.products?.name} <span className="text-gray-500 text-xs">({ti.product_variants?.sku})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {adj.locations?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {adj.notes || <span className="italic text-gray-400">None</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {adj.auth_users?.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
