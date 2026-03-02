'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VariantForm } from '@/components/products/VariantForm'
import { RoleGate } from '@/components/auth/RoleGate'

export default function NewVariantPage() {
    const { id } = useParams()

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Link
                href={`/app/products/${id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Product Details
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product Variant</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a new trackable SKU for this product.
                </p>
            </div>

            <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                <VariantForm productId={id as string} onSuccess={() => window.location.href = `/app/products/${id}`} />
            </div>
        </div>
    )
}
