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
                <div className="flex flex-col">
                    <Link
                        href={`/app/products/${info.row.original.id}`}
                        className="font-bold text-[--text-primary] hover:text-[--brand-primary] transition-colors leading-tight"
                    >
                        {info.getValue()}
                    </Link>
                    <span className="text-[10px] text-[--text-muted] font-medium uppercase tracking-tight mt-0.5">
                        ID: {info.row.original.id.slice(0, 8)}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: (info: any) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[--surface-muted] text-[--brand-primary] border border-[--brand-primary]/10 uppercase tracking-wide">
                    {info.getValue() || 'Uncategorized'}
                </span>
            )
        },
        {
            accessorKey: 'priceRange',
            header: 'Price Range',
            cell: (info: any) => (
                <div className="font-bold text-[--text-primary]">
                    {info.getValue() || '₦0.00'}
                </div>
            )
        },
        {
            accessorKey: 'totalStock',
            header: 'Total Stock',
            cell: (info: any) => (
                <div className="flex items-center gap-3">
                    <span className="text-[--text-primary] font-black text-base">{info.getValue()}</span>
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
                            className="p-2 text-gray-400 hover:text-[--brand-primary] rounded-xl hover:bg-[--surface-muted] transition-all"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-[--border] z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link href={`/app/products/${id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[--text-secondary] hover:bg-[--surface-muted] hover:text-[--brand-primary] transition-colors">
                                    <Eye className="w-4 h-4" /> View Details
                                </Link>
                                <Link href={`/app/products/${id}/edit`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[--text-secondary] hover:bg-[--surface-muted] hover:text-[--brand-primary] transition-colors">
                                    <Edit className="w-4 h-4" /> Edit Product
                                </Link>
                                <div className="mx-2 my-1 border-t border-[--border]" />
                                <button
                                    onClick={() => onDelete(id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash className="w-4 h-4" /> Delete Product
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
        return (
            <div className="p-12 text-center text-[--text-muted] bg-white rounded-2xl border border-[--border] shadow-sm animate-pulse">
                Establishing data link...
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-[--border] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[--surface-muted]/30 border-b border-[--border]">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="py-4 px-6 text-[11px] font-black text-[--text-muted] uppercase tracking-widest">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-[--border]/50">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="group hover:bg-[--surface-muted]/10 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="py-4 px-6 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && !loading && (
                            <tr>
                                <td colSpan={columns.length} className="py-20 text-center text-[--text-muted]">
                                    <div className="max-w-xs mx-auto">
                                        <p className="font-bold text-[--text-primary] text-lg mb-1">Stock is empty</p>
                                        <p className="text-sm">Your product catalog is currently waiting for entries.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
