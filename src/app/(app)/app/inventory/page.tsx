'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, MapPin, Box, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StockTable } from '@/components/inventory/StockTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[--text-primary] tracking-tight">Stock Overiview</h1>
          <p className="mt-1 text-[--text-muted] font-medium">View real-time stock levels across all locations</p>
        </div>

        <div className="flex gap-3">
          <Link href="/app/inventory/low-stock">
            <Button variant="outline" className="h-11 px-6 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm">
              <Box className="w-4 h-4 mr-2" />
              Low Stock Alert
            </Button>
          </Link>
          <Link href="/app/inventory/adjustments">
            <Button variant="outline" className="h-11 px-6 bg-white border-[--border]">
              Manual Adjustments
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search inventory by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <StockTable data={stock} loading={loading} />

      {!loading && stock.length > 0 && (
        <p className="mt-6 text-center text-[11px] text-[--text-muted] font-bold uppercase tracking-widest">
          Inventory accurately compiled from all warehouses
        </p>
      )}
    </div>
  )
}
