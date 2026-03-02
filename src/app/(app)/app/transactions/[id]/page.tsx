'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { TransactionDetail } from '@/components/transactions/TransactionDetail'
import { StatusBadge, TypeBadge } from '@/components/transactions/StatusBadge'
import { RoleGate } from '@/components/auth/RoleGate'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function TransactionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tx, setTx] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transactions/${id}`)
        if (res.ok) {
          const data = await res.json()
          setTx(data)
        } else {
          toast.error("Failed to load transaction")
          router.push('/app/transactions')
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  const updateStatus = async (status: 'confirmed' | 'cancelled') => {
    if (!confirm(`Are you sure you want to mark this transaction as ${status}?`)) return
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Transaction marked as ${status}`)
        setTx((prev: any) => ({ ...prev, status }))
      } else {
        const err = await res.json()
        throw new Error(err.error)
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update status")
    }
  }

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-400">Loading transaction details...</div>
  if (!tx) return null

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/app/transactions"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transactions
        </Link>

        <div className="flex gap-2">
          <RoleGate allowed={['owner', 'manager']}>
            {tx.status === 'pending' && (
              <>
                <button onClick={() => updateStatus('confirmed')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                  <CheckCircle className="w-4 h-4" /> Confirm
                </button>
                <button onClick={() => updateStatus('cancelled')} className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </RoleGate>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction #{tx.id.split('-')[0]}</h1>
            <TypeBadge type={tx.type} />
            <StatusBadge status={tx.status} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created on {format(new Date(tx.created_at), 'MMMM d, yyyy h:mm a')}
          </p>
        </div>

        {tx.suppliers && (
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Supplier</span>
            <span className="font-medium text-gray-900 dark:text-white">{tx.suppliers.name}</span>
          </div>
        )}
        {tx.customers && (
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Customer</span>
            <span className="font-medium text-gray-900 dark:text-white">{tx.customers.name}</span>
          </div>
        )}
      </div>

      <TransactionDetail tx={tx} />
    </div>
  )
}
