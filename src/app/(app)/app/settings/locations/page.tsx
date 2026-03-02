'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash, Store } from 'lucide-react'
import { toast } from 'sonner'
import { RoleGate } from '@/components/auth/RoleGate'

export default function LocationsSettingsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Locations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage multiple storefronts or warehouses.
          </p>
        </div>
        <RoleGate allowed={['owner', 'manager']}>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </RoleGate>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text" required placeholder="Location Name (e.g. Main Store)" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <input
              type="text" placeholder="Address (Optional)" value={newAddress} onChange={e => setNewAddress(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 animate-pulse bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800"></div>
        ) : locations.length === 0 ? (
          <p className="text-gray-500">No locations found.</p>
        ) : (
          locations.map(loc => (
            <div key={loc.id} className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-lg text-gray-500 dark:text-gray-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{loc.name}</h3>
                  {loc.address && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5"><MapPin className="w-3 h-3" /> {loc.address}</p>}
                </div>
              </div>
              <RoleGate allowed={['owner']}>
                <button onClick={() => handleDelete(loc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
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
