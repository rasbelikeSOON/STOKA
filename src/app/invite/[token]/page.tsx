'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function InvitePage() {
    const { token } = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        async function checkInvite() {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    // For a real app, we would preserve the token somewhere logic could read after auth.
                    return router.push(`/signup?invite=${token}`)
                }

                const response = await fetch('/api/invitations/accept', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                })

                const result = await response.json()

                if (!response.ok) throw new Error(result.error)

                toast.success('Invitation accepted!')
                router.push('/app/chat')
            } catch (err: any) {
                setError(err.message || 'Failed to accept invitation')
            } finally {
                setIsLoading(false)
            }
        }

        if (token) {
            checkInvite()
        }
    }, [token, router, supabase])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="text-red-500 mb-4 flex justify-center">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invitation Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }

    return null
}
