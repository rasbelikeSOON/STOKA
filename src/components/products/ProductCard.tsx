import Link from 'next/link'
import { StockBadge } from './StockBadge'
import { Package } from 'lucide-react'

export function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/app/products/${product.id}`} className="block bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-500 dark:text-gray-400">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">{product.category || 'Uncategorized'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.priceRange}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{product.totalStock} in stock</span>
                    <StockBadge quantity={product.totalStock} />
                </div>
            </div>
        </Link>
    )
}
