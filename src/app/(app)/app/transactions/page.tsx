'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Download } from 'lucide-react'
import Link from 'next/link'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { RoleGate } from '@/components/auth/RoleGate'
import { exportToCSV } from '@/lib/utils/export'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[--text-primary] tracking-tight">Transactions</h1>
          <p className="mt-1 text-[--text-muted] font-medium">View sales, purchases, and other stock movements</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => exportToCSV(txs, `stoka-transactions-${new Date().toISOString().split('T')[0]}`)}
            className="hidden sm:inline-flex h-11 px-6 bg-white border-[--border]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <RoleGate allowed={['owner', 'manager']}>
            <Link href="/app/transactions/new">
              <Button className="h-11 px-6 shadow-lg shadow-[--brand-primary]/20">
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
            </Link>
          </RoleGate>
        </div>
      </div>

      <TransactionTable data={txs} loading={loading} />

      {hasMore && !loading && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => fetchTxs(false)}
            className="text-[--brand-primary] font-bold"
          >
            Load Older Transactions
          </Button>
        </div>
      )}
    </div>
  )
}
