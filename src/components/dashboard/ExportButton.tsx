'use client'

import { Download } from 'lucide-react'
import Papa from 'papaparse'

export function ExportButton({ data, filename }: { data: any[], filename: string }) {

    const handleExport = () => {
        if (!data || data.length === 0) return
        const csv = Papa.unparse(data)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
        </button>
    )
}
