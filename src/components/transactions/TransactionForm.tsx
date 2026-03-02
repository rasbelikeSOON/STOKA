'use client'

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, TransactionFormValues } from '@/lib/validations/transaction'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

export function TransactionForm() {
    const router = useRouter()
    const { businessId } = useBusinessContext()
    const [locations, setLocations] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [customers, setCustomers] = useState<any[]>([])
    const [variants, setVariants] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema) as any,
        defaultValues: {
            location_id: '',
            type: 'sale',
            status: 'confirmed',
            supplier_id: '',
            customer_id: '',
            notes: '',
            items: [{ variant_id: '', quantity: 1, unit_price: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items'
    })

    const watchType = form.watch('type')
    const watchItems = form.watch('items')

    useEffect(() => {
        async function fetchDropdowns() {
            try {
                const [locRes, supRes, cusRes, prodRes] = await Promise.all([
                    fetch('/api/settings/locations'),
                    fetch('/api/suppliers'),
                    fetch('/api/customers'),
                    fetch('/api/products') // Gets products + variant info
                ])

                if (locRes.ok) {
                    const data = await locRes.json()
                    setLocations(data.data || [])
                    if (data.data?.length === 1) form.setValue('location_id', data.data[0].id)
                }
                if (supRes.ok) {
                    const data = await supRes.json()
                    setSuppliers(data.data || [])
                }
                if (cusRes.ok) {
                    const data = await cusRes.json()
                    setCustomers(data.data || [])
                }
                if (prodRes.ok) {
                    const data = await prodRes.json()
                    const allVars = data.data?.flatMap((p: any) =>
                        p.product_variants.map((v: any) => ({
                            id: v.id,
                            name: `${p.name} - ${v.sku}`,
                            price: v.selling_price
                        }))
                    ) || []
                    setVariants(allVars)
                }
            } catch (e) {
                console.error("Failed to fetch dropdowns", e)
            }
        }
        if (businessId) fetchDropdowns()
    }, [businessId, form])

    const onSubmit: SubmitHandler<TransactionFormValues> = async (values) => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to record transaction')
            }

            toast.success('Transaction recorded successfully')
            router.push('/app/transactions')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calculate Subtotal dynamically
    const subtotal = watchItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0)

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Transaction Details */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f]">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Transaction Details</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                        <select
                            {...form.register('type')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="sale">Sale (Outbound)</option>
                            <option value="purchase">Purchase (Inbound)</option>
                            <option value="adjustment">Adjustment (Correction)</option>
                            <option value="return">Return (Inbound)</option>
                            <option value="transfer">Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                        <select
                            {...form.register('location_id')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="">Select Location</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                        {form.formState.errors.location_id && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.location_id.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                        <select
                            {...form.register('status')}
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                            <option value="confirmed">Confirmed (Updates Stock)</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {(watchType === 'purchase' || watchType === 'return') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier (Optional)</label>
                            <select
                                {...form.register('supplier_id')}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            >
                                <option value="">None</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}

                    {(watchType === 'sale') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer (Optional)</label>
                            <select
                                {...form.register('customer_id')}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            >
                                <option value="">None</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Line Items Section */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f] flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Line Items</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Products included in this transaction</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ variant_id: '', quantity: 1, unit_price: 0 })}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800/50">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Variant *</label>
                                <select
                                    {...form.register(`items.${index}.variant_id`)}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        form.setValue(`items.${index}.variant_id`, val)
                                        const selectedVar = variants.find(v => v.id === val)
                                        if (selectedVar && watchType === 'sale') {
                                            form.setValue(`items.${index}.unit_price`, selectedVar.price)
                                        }
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="">Select Variant</option>
                                    {variants.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {form.formState.errors.items?.[index]?.variant_id && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{form.formState.errors.items[index]?.variant_id?.message}</p>
                                )}
                            </div>

                            <div className="w-full sm:w-24">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Qty *</label>
                                <input
                                    type="number" min="1"
                                    {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                                />
                            </div>

                            <div className="w-full sm:w-32">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit Price *</label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-2 text-gray-500 dark:text-gray-400 text-sm">₦</span>
                                    <input
                                        type="number" step="0.01" min="0"
                                        {...form.register(`items.${index}.unit_price`, { valueAsNumber: true })}
                                        className="w-full pl-6 pr-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-auto mt-5 sm:mt-0 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {form.formState.errors.items?.root && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{form.formState.errors.items.root.message}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea
                        {...form.register('notes')}
                        rows={4}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Optional notes or references..."
                    />
                </div>

                <div className="w-full md:w-72 bg-gray-50 dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total Amount</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white shrink-0">
                        ₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save
                        </button>
                    </div>
                </div>
            </div>

        </form>
    )
}
