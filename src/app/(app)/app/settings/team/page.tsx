'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Shield, Trash, Mail, Users } from 'lucide-react'
import { toast } from 'sonner'
import { RoleGate } from '@/components/auth/RoleGate'
import { format } from 'date-fns'
import { InviteModal } from '@/components/settings/InviteModal'

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

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
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">Team & Roles</h2>
          <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-2">
            Access control & member management
          </p>
        </div>
        <RoleGate allowed={['owner']}>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="h-12 px-8 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </RoleGate>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={fetchTeam}
      />

      <div className="bg-white rounded-3xl border border-[--border] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[--surface-muted] border-b border-[--border]">
                <th className="py-4 px-6 text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Member</th>
                <th className="py-4 px-6 text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Role</th>
                <th className="py-4 px-6 text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Joined</th>
                <RoleGate allowed={['owner']}>
                  <th className="py-4 px-6"></th>
                </RoleGate>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center">
                  <div className="space-y-4">
                    <div className="h-10 w-10 border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Loading Team...</p>
                  </div>
                </td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={4} className="py-20 text-center">
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-[--surface-muted] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[--border]">
                      <Users className="w-6 h-6 text-[--text-muted]" />
                    </div>
                    <p className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest">No team members yet</p>
                  </div>
                </td></tr>
              ) : members.map(m => (
                <tr key={m.id} className="hover:bg-[--surface-muted]/30 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[--brand-primary]/10 text-[--brand-primary] rounded-full flex items-center justify-center text-sm font-black">
                        {(m.auth_users?.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-black text-[--text-primary] tracking-tight">
                        {m.auth_users?.email || 'Unknown Email'}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <RoleGate allowed={['owner']} fallback={
                      <div className="flex items-center gap-2 text-[11px] font-black text-[--text-secondary] uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" /> {m.role}
                      </div>
                    }>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="px-4 py-2 bg-[--surface-muted] border border-[--border] rounded-xl text-sm font-bold focus:ring-2 focus:ring-[--brand-primary] outline-none capitalize text-[--text-primary]"
                      >
                        <option value="owner">Owner</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </RoleGate>
                  </td>
                  <td className="py-5 px-6 text-[11px] font-bold text-[--text-muted]">
                    {format(new Date(m.created_at), 'MMM d, yyyy')}
                  </td>
                  <RoleGate allowed={['owner']}>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 text-[--text-muted] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
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
