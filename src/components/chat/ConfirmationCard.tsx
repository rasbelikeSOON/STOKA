'use client'

import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ConfirmationCard({
    data,
    messageId,
    onConfirm
}: {
    data: any,
    messageId: string,
    onConfirm?: () => void
}) {
    const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending')
    const [isLoading, setIsLoading] = useState(false)

    // Don't render if there isn't actually a transaction
    if (!data || !data.transaction || !data.transaction.items) return null

    const t = data.transaction

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/chat/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parsedData: data, messageId })
            })
            const result = await response.json()

            if (!response.ok) throw new Error(result.error)

            setStatus('confirmed')
            toast.success('Transaction logged successfully!')
            if (onConfirm) onConfirm()
        } catch (err: any) {
            toast.error(err.message || 'Failed to confirm transaction')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setStatus('cancelled')
        toast.info('Transaction cancelled')
    }

    return (
        <div className="w-full mt-2 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden text-sm">
            <div className={`px-4 py-2 flex items-center justify-between border-b border-gray-100 ${t.type === 'purchase' ? 'bg-blue-50 text-blue-700' :
                    t.type === 'sale' ? 'bg-green-50 text-green-700' :
                        t.type === 'return' ? 'bg-amber-50 text-amber-700' :
                            'bg-gray-50 text-gray-700'
                }`}>
                <span className="font-semibold capitalize">{t.type} Pending</span>
                <span className="font-bold">{t.total_amount?.toLocaleString(undefined, { style: 'currency', currency: 'NGN' })}</span>
            </div>

            <div className="p-4 space-y-3">
                {t.supplier_name && (
                    <div className="flex justify-between text-gray-600"><span className="text-gray-400">Supplier</span> <span>{t.supplier_name}</span></div>
                )}
                {t.customer_name && (
                    <div className="flex justify-between text-gray-600"><span className="text-gray-400">Customer</span> <span>{t.customer_name}</span></div>
                )}

                <div className="border-t border-gray-100 pt-2 pb-1 text-gray-400 font-medium text-xs uppercase tracking-wider">Items</div>
                <ul className="space-y-2">
                    {t.items.map((item: any, i: number) => (
                        <li key={i} className="flex justify-between items-start text-gray-800">
                            <div>
                                <span className="font-medium">{item.product_name}</span>
                                {item.variant_descriptor && <span className="ml-1 text-gray-500 text-xs text-wrap">- {item.variant_descriptor}</span>}
                                {item.is_new_product && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">New</span>}
                            </div>
                            <div className="text-right pl-4 whitespace-nowrap">
                                <div className="text-gray-900">{item.quantity} x {item.unit_price}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
                {status === 'pending' ? (
                    <>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirm</>}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        >
                            <X className="h-4 w-4" /> Cancel
                        </button>
                    </>
                ) : status === 'confirmed' ? (
                    <div className="w-full py-1.5 flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 rounded-lg border border-green-200">
                        <Check className="h-5 w-5" /> Confirmed & Saved
                    </div>
                ) : (
                    <div className="w-full py-1.5 flex items-center justify-center gap-2 text-gray-500 font-medium bg-gray-100 rounded-lg">
                        <X className="h-5 w-5" /> Cancelled
                    </div>
                )}
            </div>
        </div>
    )
}
