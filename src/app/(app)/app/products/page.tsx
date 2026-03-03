'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { ProductTable } from '@/components/products/ProductTable'
import { ProductCard } from '@/components/products/ProductCard'
import { RoleGate } from '@/components/auth/RoleGate'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[--text-primary] tracking-tight">Products</h1>
          <p className="mt-1 text-[--text-muted] font-medium">Manage your catalog, variants, and stock levels</p>
        </div>

        <RoleGate allowed={['owner', 'manager']}>
          <Link href="/app/products/new">
            <Button className="h-11 px-6 shadow-lg shadow-[--brand-primary]/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </RoleGate>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <Button variant="outline" className="h-12 px-6 bg-white border-[--border]">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
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
          <div className="p-12 text-center text-[--text-muted] bg-white rounded-2xl border border-[--border] shadow-sm">
            <div className="h-12 w-12 bg-[--surface-muted] text-[--brand-primary] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold text-lg text-[--text-primary]">No products found</p>
            <p className="text-sm">Start by adding a new product to your inventory.</p>
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => fetchProducts(false)}
            className="text-[--brand-primary] font-bold"
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}
