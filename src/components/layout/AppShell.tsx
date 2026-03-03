'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { ContextPanel } from './ContextPanel'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'
import { Loader2 } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
    const { isLoading, error, user, businessId } = useBusinessContext()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && user && !businessId && pathname !== '/onboarding') {
            router.push('/onboarding')
        }
    }, [isLoading, user, businessId, pathname, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[--surface-muted]">
                <Loader2 className="h-10 w-10 animate-spin text-[--brand-primary] mb-4 opacity-70" />
                <p className="text-[--text-muted] font-medium animate-pulse">Initializing Stoka...</p>
            </div>
        )
    }

    if (error && pathname !== '/onboarding') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--surface-muted] p-4">
                <div className="bg-white p-8 rounded-2xl border border-[--border] shadow-xl max-w-md text-center animate-in zoom-in duration-300">
                    <div className="h-16 w-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[--text-primary] mb-2">Something went wrong</h2>
                    <p className="text-sm text-[--text-muted] mb-6 opacity-90">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full h-11 bg-[--brand-primary] text-white rounded-xl font-bold shadow-lg hover:shadow-[--brand-primary]/20 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Hide shell if we are redirecting to onboarding
    if (user && !businessId && pathname !== '/onboarding') {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen">
                <main className="flex-1 pb-16 md:pb-0 relative max-h-screen overflow-y-auto bg-gray-50/50">
                    {children}
                </main>
            </div>
            <ContextPanel />
            <MobileNav />
        </div>
    )
}
