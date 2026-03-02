'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { StatusBadge, TypeBadge } from './StatusBadge'
import { Eye, ArrowRight } from 'lucide-react'

export function TransactionTable({ data, loading }: { data: any[], loading: boolean }) {
    const columns = [
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: (info: any) => <div className="text-gray-900 dark:text-gray-100 whitespace-nowrap">{format(new Date(info.getValue()), 'MMM d, yyyy')}</div>
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: (info: any) => <TypeBadge type={info.getValue()} />
        },
        {
            accessorKey: 'auth_users',
            header: 'By',
            cell: (info: any) => <div className="text-gray-600 dark:text-gray-400">{info.getValue()?.email || 'System'}</div>
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: (info: any) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    ₦{Number(info.getValue() || 0).toLocaleString()}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info: any) => <StatusBadge status={info.getValue()} />
        },
        {
            id: 'actions',
            cell: (info: any) => (
                <Link
                    href={`/app/transactions/${info.row.original.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                >
                    Detail <ArrowRight className="w-3 h-3" />
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
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading transactions...</div>
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
                                No transactions found. Records of sales, purchases, and limits will appear here.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
