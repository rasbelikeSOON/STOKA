'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Plus, Package, MapPin } from 'lucide-react'
import { StockBadge } from '@/components/products/StockBadge'
import { RoleGate } from '@/components/auth/RoleGate'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        } else {
          toast.error("Failed to load product")
          router.push('/app/products')
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-400">Loading product details...</div>
  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/app/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <RoleGate allowed={['owner', 'manager']}>
          <Link
            href={`/app/products/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Edit className="w-4 h-4" />
            Edit Product
          </Link>
        </RoleGate>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8 flex items-start gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            {product.category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                {product.category}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{product.description || 'No description provided.'}</p>
          {product.suppliers && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Supplier: <Link href={`/app/suppliers/${product.suppliers.id}`} className="text-blue-600 hover:underline">{product.suppliers.name}</Link>
            </p>
          )}
        </div>
      </div>

      {/* Variants Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Variants & Stock</h2>
          <RoleGate allowed={['owner', 'manager']}>
            <Link
              href={`/app/products/${id}/variants/new`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </Link>
          </RoleGate>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.product_variants?.map((v: any) => {
            const totalStock = v.stock_levels?.reduce((sum: number, sl: any) => sum + Number(sl.quantity), 0) || 0;
            return (
              <div key={v.id} className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-mono font-medium text-gray-900 dark:text-gray-100">{v.sku}</h3>
                  <StockBadge quantity={totalStock} threshold={v.reorder_threshold} />
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦{Number(v.selling_price).toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Locations</h4>
                  {v.stock_levels?.length > 0 ? (
                    v.stock_levels.map((sl: any) => (
                      <div key={sl.location_id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {sl.locations?.name || 'Unknown'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{sl.quantity} units</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-500">No stock recorded.</div>
                  )}
                </div>
              </div>
            )
          })}

          {(!product.product_variants || product.product_variants.length === 0) && (
            <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#16191f] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              No variants configured for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
