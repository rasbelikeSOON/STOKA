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
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {info.getValue()}
                </div>
            )
        },
        {
            accessorKey: 'total_spent',
            header: 'Total Spent',
            cell: (info: any) => (
                <div className="font-medium text-gray-900 dark:text-white">
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
        <div className="overflow-x-auto text-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="pb-3 pt-2 px-4 font-medium text-gray-500 dark:text-gray-400">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="py-3 px-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                No purchase data found for this period.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
