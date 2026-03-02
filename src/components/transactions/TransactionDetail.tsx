import { format } from 'date-fns'
import { StatusBadge, TypeBadge } from './StatusBadge'
import { AttributePills } from './AttributePills'
import { Store, User, CreditCard } from 'lucide-react'

export function TransactionDetail({ tx }: { tx: any }) {
    if (!tx) return null

    return (
        <div className="space-y-6">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#16191f] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                        <Store className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Location</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{tx.locations?.name || 'Unknown'}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#16191f] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Operator / User</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{tx.auth_users?.email || 'System'}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#16191f] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Source</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm">{tx.source}</p>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#16191f]">
                    <h3 className="font-medium text-gray-900 dark:text-white">Line Items</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#16191f] border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="py-3 px-4 font-medium">Product / SKU</th>
                                <th className="py-3 px-4 font-medium text-right">Quantity</th>
                                <th className="py-3 px-4 font-medium text-right">Unit Price</th>
                                <th className="py-3 px-4 font-medium text-right">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {tx.transaction_items?.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.product_variants?.products?.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-0.5">{item.product_variants?.sku}</div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{item.quantity}</td>
                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">₦{Number(item.unit_price).toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">₦{Number(item.total_price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals & Notes */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                        {tx.notes || <span className="italic text-gray-400">No additional notes attached.</span>}
                    </p>
                </div>

                <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal</span>
                        <span className="font-medium dark:text-gray-200">₦{Number(tx.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                        <span className="font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">₦{Number(tx.total_amount).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
