'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Truck, Download, Filter } from 'lucide-react'
import { ContactTable } from '@/components/contacts/ContactTable'
import { ContactForm } from '@/components/contacts/ContactForm'
import { RoleGate } from '@/components/auth/RoleGate'
import { toast } from 'sonner'
import { ContactFormValues } from '@/lib/validations/contact'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/suppliers', window.location.origin)
      if (search) url.searchParams.set('q', search)
      const res = await fetch(url)
      const data = await res.json()
      setSuppliers(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuppliers()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [search, fetchSuppliers])

  const handleSave = async (values: ContactFormValues) => {
    try {
      const url = editingItem ? `/api/suppliers/${editingItem.id}` : '/api/suppliers'
      const method = editingItem ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error("Failed to save supplier")
      toast.success(`Supplier ${editingItem ? 'updated' : 'created'}`)
      setIsFormOpen(false)
      setEditingItem(null)
      fetchSuppliers()
    } catch (e: any) {
      toast.error(e.message)
      throw e
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Supplier deleted")
      setSuppliers(prev => prev.filter(s => s.id !== id))
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[--brand-primary] uppercase tracking-[0.2em] mb-3">
            <Truck className="w-3 h-3" />
            Logistics Partners
          </div>
          <h1 className="text-4xl font-black text-[--text-primary] tracking-tight">Suppliers</h1>
          <p className="mt-2 text-[--text-muted] font-medium max-w-xl text-sm leading-relaxed">
            Manage your network of distributors, wholesalers, and product vendors.
            Track communication details and procurement terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 bg-white border-[--border] text-[11px] font-black uppercase tracking-widest hidden md:flex">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <RoleGate allowed={['owner', 'manager']}>
            <Button
              onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
              className="h-12 px-8 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[--brand-primary]/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </RoleGate>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted] group-focus-within:text-[--brand-primary] transition-colors" />
          <input
            type="text"
            placeholder="Search suppliers by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-[--border] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[--brand-primary]/5 focus:border-[--brand-primary] outline-none transition-all placeholder:text-[--text-muted]/50"
          />
        </div>
        <Button variant="outline" className="h-[58px] px-6 bg-white border-[--border]">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ContactTable
          data={suppliers}
          loading={loading}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {isFormOpen && (
        <ContactForm
          title={editingItem ? "Update Supplier" : "Partner Onboarding"}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
        />
      )}
    </div>
  )
}
