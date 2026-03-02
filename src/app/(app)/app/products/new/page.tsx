'use client'

import { ProductForm } from '@/components/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RoleGate } from '@/components/auth/RoleGate'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'

export default function NewProductPage() {
  const role = useAuthStore(req => req.role)

  useEffect(() => {
    if (role === 'staff') {
      redirect('/app/products')
    }
  }, [role])

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link
        href="/app/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create a new product with an initial variant and opening stock.
        </p>
      </div>

      <ProductForm />
    </div>
  )
}
