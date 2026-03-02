'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Shield, Trash, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { RoleGate } from '@/components/auth/RoleGate'
import { format } from 'date-fns'

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/settings/team')
      const data = await res.json()
      setMembers(data.data || [])
    } catch (e) {
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/settings/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      if (!res.ok) throw new Error("Failed to update role")
      toast.success("Role updated")
      fetchTeam()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this user from the business?")) return

    try {
      const res = await fetch(`/api/settings/team/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to remove user")
      toast.success("User removed")
      fetchTeam()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team & Roles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage who has access to your business and what they can do.
          </p>
        </div>
        <RoleGate allowed={['owner']}>
          <button
            onClick={() => toast.info('Invitations functionality would go here (requires email integration)')}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </RoleGate>
      </div>

      <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-[#16191f] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">User</th>
                <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Role</th>
                <th className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Joined Date</th>
                <RoleGate allowed={['owner']}>
                  <th className="py-3 px-4"></th>
                </RoleGate>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500 animate-pulse">Loading team...</td></tr>
              ) : members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 p-2 rounded-full">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {m.auth_users?.email || 'Unknown Email'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <RoleGate allowed={['owner']} fallback={
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 capitalize">
                        <Shield className="w-3.5 h-3.5" /> {m.role}
                      </div>
                    }>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none capitalize text-gray-900 dark:text-white"
                      >
                        <option value="owner">Owner</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </RoleGate>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {format(new Date(m.created_at), 'MMM d, yyyy')}
                  </td>
                  <RoleGate allowed={['owner']}>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </RoleGate>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
