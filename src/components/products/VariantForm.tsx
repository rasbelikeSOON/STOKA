'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { variantSchema, VariantFormValues } from '@/lib/validations/product'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function VariantForm({ productId, onSuccess }: { productId: string, onSuccess?: () => void }) {
    const router = useRouter()
    const [locations, setLocations] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<VariantFormValues & { initial_quantity?: number, location_id?: string }>({
        resolver: zodResolver(variantSchema) as any,
        defaultValues: {
            sku: '', barcode: '', selling_price: 0, cost_price: 0, reorder_threshold: 5, expiry_date: '',
            initial_quantity: 0, location_id: ''
        }
    })

    useEffect(() => {
        async function fetchLocs() {
            try {
                const res = await fetch('/api/settings/locations')
                if (res.ok) {
                    const json = await res.json()
                    setLocations(json.data || [])
                }
            } catch (e) { }
        }
        fetchLocs()
    }, [])

    const onSubmit = async (values: any) => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/products/${productId}/variants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variant: values,
                    initial_quantity: values.initial_quantity,
                    location_id: values.location_id
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to add variant')
            }

            toast.success('Variant added successfully')
            if (onSuccess) onSuccess()
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU *</label>
                    <input
                        {...form.register('sku')}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white uppercase"
                    />
                    {form.formState.errors.sku && <p className="mt-1 text-sm text-red-500">{form.formState.errors.sku.message}</p>}
                </div>

                {/* Simplified for brevity, same fields as above */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price *</label>
                    <input
                        type="number" step="0.01" min="0" {...form.register('selling_price')}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                    {form.formState.errors.selling_price && <p className="mt-1 text-sm text-red-500">{form.formState.errors.selling_price.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location for Stock</label>
                    <select
                        {...form.register('location_id')}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    >
                        <option value="">Select Location</option>
                        {locations.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Qty</label>
                    <input
                        type="number" min="0" {...form.register('initial_quantity')}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Variant
                </button>
            </div>
        </form>
    )
}
