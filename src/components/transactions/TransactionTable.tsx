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
            header: 'Date & Time',
            cell: (info: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[--text-primary]">
                        {format(new Date(info.getValue()), 'MMM d, yyyy')}
                    </span>
                    <span className="text-[10px] text-[--text-muted] font-medium uppercase tracking-tight">
                        {format(new Date(info.getValue()), 'hh:mm a')}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'type',
            header: 'Activity',
            cell: (info: any) => <TypeBadge type={info.getValue()} />
        },
        {
            accessorKey: 'auth_users',
            header: 'Originator',
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[--surface-muted] border border-[--border] flex items-center justify-center text-[10px] font-bold text-[--brand-primary]">
                        {(info.getValue()?.email || 'S')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[--text-secondary]">
                        {info.getValue()?.email?.split('@')[0] || 'System'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'total_amount',
            header: 'Value',
            cell: (info: any) => (
                <div className="font-black text-[--text-primary] text-sm">
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
                Retrieving transaction logs...
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
                                        <p className="font-bold text-[--text-primary] text-lg mb-1">No movement recorded</p>
                                        <p className="text-sm">Activity logs for sales and purchases will appear here.</p>
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
