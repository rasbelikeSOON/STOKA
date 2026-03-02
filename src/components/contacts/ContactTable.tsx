'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Edit, Trash } from 'lucide-react'
import { RoleGate } from '@/components/auth/RoleGate'

export function ContactTable({ data, loading, onEdit, onDelete }: { data: any[], loading: boolean, onEdit: (c: any) => void, onDelete: (id: string) => void }) {
    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info: any) => <div className="font-medium text-gray-900 dark:text-gray-100">{info.getValue()}</div>
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: (info: any) => <div className="text-gray-600 dark:text-gray-400">{info.getValue() || '-'}</div>
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: (info: any) => <div className="text-gray-600 dark:text-gray-400">{info.getValue() || '-'}</div>
        },
        {
            id: 'actions',
            cell: (info: any) => (
                <div className="flex gap-2 justify-end">
                    <RoleGate allowed={['owner', 'manager']}>
                        <button
                            onClick={() => onEdit(info.row.original)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    </RoleGate>
                    <RoleGate allowed={['owner']}>
                        <button
                            onClick={() => onDelete(info.row.original.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </RoleGate>
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
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading...</div>
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
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
