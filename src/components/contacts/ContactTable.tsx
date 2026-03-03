'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Edit, Trash, User, Mail, Phone } from 'lucide-react'
import { RoleGate } from '@/components/auth/RoleGate'

export function ContactTable({ data, loading, onEdit, onDelete }: { data: any[], loading: boolean, onEdit: (c: any) => void, onDelete: (id: string) => void }) {
    const columns = [
        {
            accessorKey: 'name',
            header: 'Contact',
            cell: (info: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[--surface-muted] flex items-center justify-center border border-[--border]">
                        <User className="w-5 h-5 text-[--text-muted]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[--text-primary] tracking-tight">{info.getValue()}</span>
                        <span className="text-[10px] font-bold text-[--text-muted] uppercase tracking-widest leading-none mt-1">
                            Individual
                        </span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'email',
            header: 'Communication',
            cell: (info: any) => (
                <div className="space-y-1">
                    {info.getValue() && (
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[--text-secondary]">
                            <Mail className="w-3 h-3 text-[--brand-primary]" />
                            {info.getValue()}
                        </div>
                    )}
                    {info.row.original.phone && (
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[--text-muted]">
                            <Phone className="w-3 h-3" />
                            {info.row.original.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'actions',
            header: '',
            cell: (info: any) => (
                <div className="flex gap-2 justify-end">
                    <RoleGate allowed={['owner', 'manager']}>
                        <button
                            onClick={() => onEdit(info.row.original)}
                            className="p-2 text-[--text-muted] hover:text-[--brand-primary] hover:bg-[--surface-muted] rounded-xl transition-all duration-300"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    </RoleGate>
                    <RoleGate allowed={['owner']}>
                        <button
                            onClick={() => onDelete(info.row.original.id)}
                            className="p-2 text-[--text-muted] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
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
        return (
            <div className="p-20 text-center space-y-4">
                <div className="h-10 w-10 border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Fetching Records...</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden border border-[--border] rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="bg-[--surface-muted] border-b border-[--border]">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="py-4 px-6 text-[10px] font-black text-[--text-muted] uppercase tracking-widest">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-[--border]">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-[--surface-muted]/30 transition-colors group">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="py-5 px-6 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && !loading && (
                        <tr>
                            <td colSpan={columns.length} className="py-20 text-center">
                                <div className="space-y-2">
                                    <div className="h-12 w-12 bg-[--surface-muted] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[--border]">
                                        <User className="w-6 h-6 text-[--text-muted]" />
                                    </div>
                                    <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">No matching contacts found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
