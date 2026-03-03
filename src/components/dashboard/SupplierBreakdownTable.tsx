'use client'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

export function SupplierBreakdownTable({ data }: { data: any[] }) {
    const columns = [
        {
            accessorKey: 'name',
            header: 'Supplier',
            cell: (info: any) => (
                <div className="flex flex-col">
                    <span className="font-black text-[--text-primary] tracking-tight">{info.getValue()}</span>
                </div>
            )
        },
        {
            accessorKey: 'total_spent',
            header: 'Spent Value',
            cell: (info: any) => (
                <div className="font-black text-[--text-primary]">
                    ₦{(info.getValue() as number).toLocaleString()}
                </div>
            )
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

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
                        <tr key={row.id} className="hover:bg-[--surface-muted]/50 transition-colors group">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="py-5 px-6 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-[11px] font-bold text-[--text-muted] uppercase tracking-widest">
                                No supplier data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
