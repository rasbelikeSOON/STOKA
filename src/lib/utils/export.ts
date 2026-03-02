export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) return

    const headers = ['Date', 'Type', 'Status', 'Location', 'Entity', 'Total Amount', 'Items']
    const csvRows = [
        headers.join(','),
        ...data.map(row => {
            const date = new Date(row.created_at).toLocaleDateString()
            const type = row.type
            const status = row.status
            const location = row.locations?.name || 'N/A'
            const entity = row.suppliers?.name || row.customers?.name || 'N/A'
            const amount = row.total_amount
            const items = row.transaction_items?.map((i: any) =>
                `${i.product_variants?.products?.name || ''} (${i.quantity})`
            ).join('; ')

            return [
                date,
                type,
                status,
                `"${location}"`,
                `"${entity}"`,
                amount,
                `"${items}"`
            ].join(',')
        })
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
