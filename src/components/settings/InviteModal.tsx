'use client'

import { useState } from 'react'
import { X, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'

interface InviteModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function InviteModal({ isOpen, onClose, onSuccess }: InviteModalProps) {
    const { businessId } = useBusinessContext()
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'manager' | 'staff'>('staff')
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !businessId) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role, businessId })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send invite')

            toast.success(`Invitation sent to ${email}`)
            setEmail('')
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#16191f] rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invite Team Member</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="teammate@example.com"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        >
                            <option value="staff">Staff (View & Entry)</option>
                            <option value="manager">Manager (Full Access)</option>
                        </select>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Managers can manage products and view reports. Staff can record transactions and view stock.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Invitation
                    </button>
                </form>
            </div>
        </div>
    )
}
