'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductWithFirstVariantSchema, CreateProductWithFirstVariantValues } from '@/lib/validations/product'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export function ProductForm() {
    const router = useRouter()
    const { businessId } = useBusinessContext()
    const [locations, setLocations] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateProductWithFirstVariantValues>({
        resolver: zodResolver(createProductWithFirstVariantSchema) as any,
        defaultValues: {
            product: { name: '', description: '', category: '', supplier_id: '' },
            variant: { sku: '', barcode: '', selling_price: 0, cost_price: 0, reorder_threshold: 5, expiry_date: '' },
            initial_quantity: 0,
            location_id: ''
        }
    })

    // Fetch locations and suppliers for dropdowns
    useEffect(() => {
        async function fetchDropdowns() {
            // In a real app we would create /api/settings/locations and /api/suppliers for this
            // We will assume they exist soon, but for now we'll fetch them directly if we must, 
            // or rely on those APIs after we build them.
            try {
                const [locRes, supRes] = await Promise.all([
                    fetch('/api/settings/locations'),
                    fetch('/api/suppliers')
                ])

                if (locRes.ok) {
                    const locData = await locRes.json()
                    setLocations(locData.data || [])
                    if (locData.data?.length === 1) {
                        form.setValue('location_id', locData.data[0].id)
                    }
                }
                if (supRes.ok) {
                    const supData = await supRes.json()
                    setSuppliers(supData.data || [])
                }
            } catch (e) {
                console.error("Failed to fetch dropdowns", e)
            }
        }
        if (businessId) fetchDropdowns()
    }, [businessId, form])

    const onSubmit = async (values: CreateProductWithFirstVariantValues) => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to create product')
            }

            toast.success('Product created successfully')
            router.push('/app/products')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Product Details Section */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f]">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Overview</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Basic details about the item</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
                        <input
                            {...form.register('product.name')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            placeholder="e.g. Vanilla Bean Candle"
                        />
                        {form.formState.errors.product?.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.product.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <input
                            {...form.register('product.category')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            placeholder="e.g. Candles"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier (Optional)</label>
                        <select
                            {...form.register('product.supplier_id')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            {...form.register('product.description')}
                            rows={3}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            placeholder="Brief product description..."
                        />
                    </div>
                </div>
            </div>

            {/* Initial Variant Section */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f]">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Initial Variant & Pricing</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU, costs, and selling price</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU *</label>
                        <input
                            {...form.register('variant.sku')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white uppercase"
                            placeholder="e.g. VBC-001"
                        />
                        {form.formState.errors.variant?.sku && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.variant.sku.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barcode (Optional)</label>
                        <input
                            {...form.register('variant.barcode')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">₦</span>
                            <input
                                type="number" step="0.01" min="0"
                                {...form.register('variant.selling_price')}
                                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        {form.formState.errors.variant?.selling_price && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.variant.selling_price.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">₦</span>
                            <input
                                type="number" step="0.01" min="0"
                                {...form.register('variant.cost_price')}
                                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Initial Stock Section */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f]">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Initial Stock</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Set opening balances</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                        <select
                            {...form.register('location_id')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="">Select Location</option>
                            {locations.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        {form.formState.errors.location_id && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.location_id.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity on Hand</label>
                        <input
                            type="number" min="0"
                            {...form.register('initial_quantity')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Product
                </button>
            </div>

        </form>
    )
}
