'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash, Store, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { RoleGate } from '@/components/auth/RoleGate'

export default function LocationsSettingsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/settings/locations')
      const data = await res.json()
      setLocations(data.data || [])
    } catch (e) {
      toast.error('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/settings/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, address: newAddress })
      })
      if (!res.ok) throw new Error("Failed to add location")
      toast.success("Location added")
      setNewName('')
      setNewAddress('')
      setIsAdding(false)
      fetchLocations()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (locations.length === 1) {
      toast.error("You must have at least one location.")
      return
    }
    if (!confirm("Delete this location? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/settings/locations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to delete location")
      toast.success("Location deleted")
      fetchLocations()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">Locations</h2>
          <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-2">
            Storefronts, warehouses & distribution centers
          </p>
        </div>
        <RoleGate allowed={['owner', 'manager']}>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="h-12 px-8 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'Add Location'}
          </button>
        </RoleGate>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 bg-white p-8 rounded-3xl border border-[--brand-primary]/20 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="text-[10px] font-black text-[--brand-primary] uppercase tracking-widest mb-1">New Location</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" required placeholder="Location Name (e.g. Main Store)" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full px-5 py-4 bg-[--surface-muted] border border-[--border] rounded-2xl focus:ring-2 focus:ring-[--brand-primary]/10 focus:border-[--brand-primary] text-sm font-bold text-[--text-primary] outline-none transition-all placeholder:text-[--text-muted]/50"
            />
            <input
              type="text" placeholder="Address (Optional)" value={newAddress} onChange={e => setNewAddress(e.target.value)}
              className="w-full px-5 py-4 bg-[--surface-muted] border border-[--border] rounded-2xl focus:ring-2 focus:ring-[--brand-primary]/10 focus:border-[--brand-primary] text-sm font-bold text-[--text-primary] outline-none transition-all placeholder:text-[--text-muted]/50"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="h-12 px-10 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Location
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="p-20 text-center space-y-4 bg-white rounded-3xl border border-[--border]">
            <div className="h-10 w-10 border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Loading Locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-[--border]">
            <div className="h-12 w-12 bg-[--surface-muted] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[--border]">
              <MapPin className="w-6 h-6 text-[--text-muted]" />
            </div>
            <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">No locations found</p>
          </div>
        ) : (
          locations.map(loc => (
            <div key={loc.id} className="bg-white rounded-3xl border border-[--border] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-[--surface-muted] rounded-2xl flex items-center justify-center text-[--text-muted] group-hover:text-[--brand-primary] transition-colors border border-[--border]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[--text-primary] tracking-tight">{loc.name}</h3>
                  {loc.address && (
                    <p className="text-[11px] font-bold text-[--text-muted] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3" /> {loc.address}
                    </p>
                  )}
                </div>
              </div>
              <RoleGate allowed={['owner']}>
                <button onClick={() => handleDelete(loc.id)} className="p-2.5 text-[--text-muted] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300">
                  <Trash className="w-4 h-4" />
                </button>
              </RoleGate>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
