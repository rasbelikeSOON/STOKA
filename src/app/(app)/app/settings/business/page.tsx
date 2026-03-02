'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/useAuthStore'

const businessSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  timezone: z.string().optional(),
  tax_rate: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().min(0).max(100).optional())
})

type BusinessFormValues = z.infer<typeof businessSchema>

export default function BusinessSettingsPage() {
  const role = useAuthStore(req => req.role)
  const isOwner = role === 'owner'
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema) as any,
    defaultValues: {
      name: '', currency: 'NGN', timezone: 'Africa/Lagos', tax_rate: 0
    }
  })

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch('/api/settings/business')
        if (res.ok) {
          const data = await res.json()
          form.reset({
            name: data.name || '',
            currency: data.currency || 'NGN',
            timezone: data.timezone || 'Africa/Lagos',
            tax_rate: data.tax_rate || 0
          })
        }
      } catch (e) {
        toast.error("Failed to load business details")
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [form])

  const onSubmit = async (values: BusinessFormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/settings/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error("Failed to update business")
      toast.success("Business settings saved")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-gray-500">Loading business details...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Identity</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your company's core information and defaults.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
          <input
            {...form.register('name')}
            disabled={!isOwner}
            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
          />
          {form.formState.errors.name && <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency Code</label>
            <input
              {...form.register('currency')}
              placeholder="e.g. NGN, USD"
              disabled={!isOwner}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
            <input
              {...form.register('timezone')}
              disabled={!isOwner}
              className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {isOwner && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
