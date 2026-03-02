'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { RoleGate } from '@/components/auth/RoleGate'

export default function TransactionsPage() {
  const [txs, setTxs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchTxs = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      const url = new URL('/api/transactions', window.location.origin)
      if (!reset && cursor) url.searchParams.set('cursor', cursor)

      const res = await fetch(url)
      const data = await res.json()

      if (reset) {
        setTxs(data.data || [])
      } else {
        setTxs(prev => [...prev, ...(data.data || [])])
      }
      setCursor(data.next_cursor)
      setHasMore(!!data.next_cursor)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [cursor])

  useEffect(() => {
    fetchTxs(true)
  }, []) // Initial fetch

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View sales, purchases, and other stock movements</p>
        </div>

        <RoleGate allowed={['owner', 'manager']}>
          <Link
            href="/app/transactions/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Manual Entry
          </Link>
        </RoleGate>
      </div>

      <TransactionTable data={txs} loading={loading} />

      {hasMore && !loading && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchTxs(false)}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Load More Previous
          </button>
        </div>
      )}
    </div>
  )
}
