'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, MapPin, Box, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StockTable } from '@/components/inventory/StockTable'

export default function InventoryPage() {
  const [stock, setStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchStock = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/inventory', window.location.origin)
      if (search) url.searchParams.set('q', search)

      const res = await fetch(url)
      const data = await res.json()
      setStock(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStock()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [search, fetchStock])

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View real-time stock levels across all locations</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/app/inventory/low-stock"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium transition whitespace-nowrap"
          >
            <Box className="w-4 h-4" />
            Low Stock
          </Link>
          <Link
            href="/app/inventory/adjustments"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#16191f] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition whitespace-nowrap"
          >
            Adjustments
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#16191f] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <StockTable data={stock} loading={loading} />
    </div>
  )
}
