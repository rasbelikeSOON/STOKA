'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { StockBadge } from '@/components/products/StockBadge'
import Link from 'next/link'

export function StockTable({ data, loading }: { data: any[], loading: boolean }) {
    const columns = [
        {
            accessorKey: 'product_name',
            header: 'Product',
            cell: (info: any) => (
                <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                    <Link href={`/app/products/${info.row.original.product_id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {info.getValue()}
                    </Link>
                </div>
            )
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: (info: any) => <span className="text-gray-500 dark:text-gray-400 font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{info.getValue()}</span>
        },
        {
            accessorKey: 'location_name',
            header: 'Location',
            cell: (info: any) => <div className="text-gray-600 dark:text-gray-300">{info.getValue()}</div>
        },
        {
            accessorKey: 'quantity',
            header: 'Stock Level',
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{info.getValue()}</span>
                    <StockBadge quantity={info.getValue()} threshold={info.row.original.reorder_threshold} />
                </div>
            )
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (loading && data.length === 0) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading stock data...</div>
    }

    return (
        <div className="overflow-x-auto text-sm bg-white dark:bg-[#0f1115] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-[#16191f]">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-800">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                                No inventory records found. Add stock to your products.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
