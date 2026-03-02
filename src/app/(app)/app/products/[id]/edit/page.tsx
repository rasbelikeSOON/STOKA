'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormValues } from '@/lib/validations/product'
import { toast } from 'sonner'
import { RoleGate } from '@/components/auth/RoleGate'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const role = useAuthStore(req => req.role)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [suppliers, setSuppliers] = useState<any[]>([])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: { name: '', description: '', category: '', supplier_id: '' }
  })

  useEffect(() => {
    if (role === 'staff') redirect(`/app/products/${id}`)
  }, [role, id])

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, supRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/suppliers')
        ])

        if (prodRes.ok) {
          const data = await prodRes.json()
          form.reset({
            name: data.name,
            description: data.description || '',
            category: data.category || '',
            supplier_id: data.supplier_id || ''
          })
        }
        if (supRes.ok) {
          const data = await supRes.json()
          setSuppliers(data.data || [])
        }
      } catch (e) {
        toast.error("Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, form])

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!res.ok) throw new Error('Failed to update product')

      toast.success('Product updated')
      router.push(`/app/products/${id}`)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link
        href={`/app/products/${id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Product
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
            <input
              {...form.register('name')}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            {form.formState.errors.name && <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input
              {...form.register('category')}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
            <select
              {...form.register('supplier_id')}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              {...form.register('description')}
              rows={4}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
