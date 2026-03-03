'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { LogOut, User, Key, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, role, clear } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      clear()
      router.push('/signin')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    toast.info("Password reset instructions would be sent to your email.")
  }

  if (!user) return (
    <div className="p-20 text-center space-y-4">
      <div className="h-10 w-10 border-4 border-[--surface-muted] border-t-[--brand-primary] rounded-full animate-spin mx-auto" />
      <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">Loading Profile...</p>
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">My Account</h2>
        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-2">
          Personal profile & security preferences
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[--border] shadow-sm p-8 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[--border]">
          <div className="h-20 w-20 bg-[--brand-primary]/10 text-[--brand-primary] rounded-full flex items-center justify-center text-3xl font-black">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-black text-[--text-primary] tracking-tight">{user.email}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black text-[--text-muted] uppercase tracking-widest capitalize">{role} Access</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[--surface-muted] rounded-2xl border border-[--border]">
            <div>
              <h4 className="font-black text-[--text-primary] tracking-tight flex items-center gap-2"><Key className="w-4 h-4 text-[--text-muted]" /> Change Password</h4>
              <p className="text-[11px] font-bold text-[--text-muted] mt-1">Receive an email with instructions to update your password securely.</p>
            </div>
            <button
              onClick={handlePasswordReset}
              className="px-6 py-3 bg-white border border-[--border] text-[--text-primary] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[--surface-muted] transition whitespace-nowrap"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-8">
        <h4 className="font-black text-rose-600 tracking-tight mb-2">Danger Zone</h4>
        <p className="text-[11px] font-bold text-[--text-muted] mb-6">Ending your session will require you to log back in to access business data.</p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-black uppercase tracking-widest transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {loading ? 'Signing out...' : 'Sign Out Completely'}
        </button>
      </div>
    </div>
  )
}
