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
      clear() // Clear Zustand state
      router.push('/login')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    // In a real app, this would trigger an email.
    toast.info("Password reset instructions would be sent to your email.")
  }

  if (!user) return <div className="p-8 text-center animate-pulse text-gray-500">Loading profile...</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal profile and security preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="h-20 w-20 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center text-3xl font-bold font-mono">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{role} Access</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2"><Key className="w-4 h-4 text-gray-500" /> Change Password</h4>
              <p className="text-sm text-gray-500 mt-1">Receive an email with instructions to update your password securely.</p>
            </div>
            <button
              onClick={handlePasswordReset}
              className="px-4 py-2 bg-white dark:bg-[#16191f] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition whitespace-nowrap"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#16191f] rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm p-6">
        <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ending your session will require you to log back in to access business data.</p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {loading ? 'Signing out...' : 'Sign Out completely'}
        </button>
      </div>
    </div>
  )
}
