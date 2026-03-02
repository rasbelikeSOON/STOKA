'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { StockBadge } from './StockBadge'
import { MoreHorizontal, Edit, Eye, Trash } from 'lucide-react'
import { useState } from 'react'

export function ProductTable({ data, loading, onDelete }: { data: any[], loading: boolean, onDelete: (id: string) => void }) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    const columns = [
        {
            accessorKey: 'name',
            header: 'Product Name',
            cell: (info: any) => (
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    <Link href={`/app/products/${info.row.original.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {info.getValue()}
                    </Link>
                </div>
            )
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: (info: any) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    {info.getValue() || 'Uncategorized'}
                </span>
            )
        },
        {
            accessorKey: 'priceRange',
            header: 'Price Range',
            cell: (info: any) => <div className="text-gray-500 dark:text-gray-400">{info.getValue()}</div>
        },
        {
            accessorKey: 'totalStock',
            header: 'Total Stock',
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">{info.getValue()}</span>
                    <StockBadge quantity={info.getValue()} />
                </div>
            )
        },
        {
            id: 'actions',
            cell: (info: any) => {
                const id = info.row.original.id
                const isOpen = openMenuId === id

                return (
                    <div className="relative flex justify-end">
                        <button
                            onClick={() => setOpenMenuId(isOpen ? null : id)}
                            onBlur={() => setTimeout(() => setOpenMenuId(null), 200)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1 font-medium text-sm">
                                <Link href={`/app/products/${id}`} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <Eye className="w-4 h-4" /> View Detail
                                </Link>
                                <Link href={`/app/products/${id}/edit`} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <Edit className="w-4 h-4" /> Edit Product
                                </Link>
                                <button onClick={() => onDelete(id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                                    <Trash className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (loading && data.length === 0) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading products...</div>
    }

    return (
        <div className="overflow-x-auto text-sm bg-white dark:bg-[#0f1115] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-[#16191f]">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-800">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="py-3 px-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && !loading && (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                No products found. Add your first product to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
