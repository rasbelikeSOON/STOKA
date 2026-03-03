'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/useAuthStore'
import { Input } from '@/components/ui/Input'

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

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="h-10 w-10 border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full animate-spin mx-auto" />
      <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Loading Business Profile...</p>
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">Business Identity</h2>
        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-2">
          Core company information & regional defaults
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-[--border] shadow-sm p-8 space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
            <Building2 className="w-3 h-3" /> Business Name
          </label>
          <Input
            {...form.register('name')}
            disabled={!isOwner}
            placeholder="e.g. Lagos Beauty Hub"
          />
          {form.formState.errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{form.formState.errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Currency Code</label>
            <Input
              {...form.register('currency')}
              placeholder="e.g. NGN, USD"
              disabled={!isOwner}
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Timezone</label>
            <Input
              {...form.register('timezone')}
              disabled={!isOwner}
            />
          </div>
        </div>

        {isOwner && (
          <div className="pt-6 border-t border-[--border] flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="h-12 px-10 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
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
