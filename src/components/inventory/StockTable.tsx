'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { StockBadge } from '@/components/products/StockBadge'
import Link from 'next/link'
import { MapPin, ArrowRight, Box } from 'lucide-react'

export function StockTable({ data, loading }: { data: any[], loading: boolean }) {
    const columns = [
        {
            accessorKey: 'product_name',
            header: 'Product',
            cell: (info: any) => (
                <div className="flex flex-col">
                    <Link
                        href={`/app/products/${info.row.original.product_id}`}
                        className="font-bold text-[--text-primary] hover:text-[--brand-primary] transition-colors leading-tight"
                    >
                        {info.getValue()}
                    </Link>
                    <span className="text-[10px] text-[--text-muted] font-medium uppercase tracking-tight mt-0.5">
                        SKU: {info.row.original.sku || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'location_name',
            header: 'Storage Location',
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-[--text-secondary]">
                        {info.getValue() || 'Primary Warehouse'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'quantity',
            header: 'Stock Levels',
            cell: (info: any) => (
                <div className="flex items-center gap-4">
                    <span className="text-[--text-primary] font-black text-lg min-w-[30px]">{info.getValue()}</span>
                    <StockBadge quantity={info.getValue()} threshold={info.row.original.reorder_threshold} />
                </div>
            )
        },
        {
            id: 'actions',
            cell: (info: any) => (
                <Link
                    href={`/app/products/${info.row.original.product_id}`}
                    className="p-2 text-gray-400 hover:text-[--brand-primary] rounded-xl hover:bg-[--surface-muted] transition-all inline-flex items-center justify-center"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>
            )
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
                Syncing inventory data...
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
                                    <th key={header.id} className="py-4 px-6 text-[11px] font-black text-[--text-muted] uppercase tracking-widest whitespace-nowrap">
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
                                        <div className="h-12 w-12 bg-[--surface-muted] text-[--brand-primary] rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <Box className="w-6 h-6" />
                                        </div>
                                        <p className="font-bold text-[--text-primary] text-lg mb-1">Inventory is clean</p>
                                        <p className="text-sm">Available stock across your locations will be itemized here.</p>
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
