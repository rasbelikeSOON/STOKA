'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { ContactTable } from '@/components/contacts/ContactTable'
import { ContactForm } from '@/components/contacts/ContactForm'
import { RoleGate } from '@/components/auth/RoleGate'
import { toast } from 'sonner'
import { ContactFormValues } from '@/lib/validations/contact'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/customers', window.location.origin)
      if (search) url.searchParams.set('q', search)
      const res = await fetch(url)
      const data = await res.json()
      setCustomers(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [search, fetchCustomers])

  const handleSave = async (values: ContactFormValues) => {
    try {
      const url = editingItem ? `/api/customers/${editingItem.id}` : '/api/customers'
      const method = editingItem ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error("Failed to save customer")
      toast.success(`Customer ${editingItem ? 'updated' : 'created'}`)
      setIsFormOpen(false)
      setEditingItem(null)
      fetchCustomers()
    } catch (e: any) {
      toast.error(e.message)
      throw e
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Customer deleted")
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your business clients and buyers</p>
        </div>

        <RoleGate allowed={['owner', 'manager']}>
          <button
            onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </RoleGate>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#16191f] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <ContactTable
        data={customers}
        loading={loading}
        onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <ContactForm
          title={editingItem ? "Edit Customer" : "Add Customer"}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
        />
      )}
    </div>
  )
}
