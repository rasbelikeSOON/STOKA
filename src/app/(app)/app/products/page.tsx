'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { ProductTable } from '@/components/products/ProductTable'
import { ProductCard } from '@/components/products/ProductCard'
import { useAuthStore } from '@/stores/useAuthStore'
import { RoleGate } from '@/components/auth/RoleGate'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      const url = new URL('/api/products', window.location.origin)
      if (search) url.searchParams.set('q', search)
      if (!reset && cursor) url.searchParams.set('cursor', cursor)

      const res = await fetch(url)
      const data = await res.json()

      if (reset) {
        setProducts(data.data || [])
      } else {
        setProducts(prev => [...prev, ...(data.data || [])])
      }
      setCursor(data.next_cursor)
      setHasMore(!!data.next_cursor)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, cursor])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(true)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your catalog, variants, and stock levels</p>
        </div>

        <RoleGate allowed={['owner', 'manager']}>
          <Link
            href="/app/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </RoleGate>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#16191f] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#16191f] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ProductTable data={products} loading={loading} onDelete={handleDelete} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800">
            No products found.
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchProducts(false)}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
