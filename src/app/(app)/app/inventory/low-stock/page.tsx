'use client'

import { useEffect, useState } from 'react'
import { StockTable } from '@/components/inventory/StockTable'
import { LowStockAlert } from '@/components/inventory/LowStockAlert'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LowStockPage() {
  const [stock, setStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await fetch('/api/inventory?filter=low-stock')
        const data = await res.json()
        setStock(data.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchLowStock()
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Low Stock Needs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Items that have fallen below their configured reorder thresholds.</p>
      </div>

      {!loading && <LowStockAlert count={stock.length} />}

      <StockTable data={stock} loading={loading} />
    </div>
  )
}
