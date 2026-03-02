'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Phone, Mail, MapPin, Notebook, ShoppingBag } from 'lucide-react'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { RoleGate } from '@/components/auth/RoleGate'
import { toast } from 'sonner'

export default function SupplierDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [supplier, setSupplier] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [supRes, txRes] = await Promise.all([
          fetch(`/api/suppliers/${id}`),
          fetch(`/api/transactions?supplierId=${id}&limit=10`)
        ])

        if (supRes.ok) {
          const supData = await supRes.json()
          setSupplier(supData)
        } else {
          toast.error("Supplier not found")
          router.push('/app/suppliers')
        }

        if (txRes.ok) {
          const txData = await txRes.json()
          setTransactions(txData.data || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-400">Loading supplier details...</div>
  if (!supplier) return null

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/app/suppliers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Suppliers
        </Link>
        <RoleGate allowed={['owner', 'manager']}>
          <button
            onClick={() => toast.info("Edit from the list page")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Edit className="w-4 h-4" />
            Edit Supplier
          </button>
        </RoleGate>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-5 rounded-2xl text-orange-600 dark:text-orange-400 shrink-0 w-fit">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="grow">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{supplier.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              {supplier.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {supplier.phone}
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {supplier.email}
                </div>
              )}
              {supplier.address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {supplier.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {supplier.notes && (
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Notebook className="w-4 h-4" />
              Supplier Notes
            </div>
            <p className="text-gray-700 dark:text-gray-300">{supplier.notes}</p>
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Purchases</h2>
        <TransactionTable data={transactions} loading={loading} />
        {transactions.length === 0 && !loading && (
          <div className="mt-4 p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 font-medium">
            No purchase history yet.
          </div>
        )}
      </div>
    </div>
  )
}
