'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { ContextPanel } from './ContextPanel'
import { useBusinessContext } from '@/lib/hooks/useBusinessContext'
import { Loader2 } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
    const { isLoading, error } = useBusinessContext()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    Failed to load business context. Please try again.
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen">
                <main className="flex-1 pb-16 md:pb-0 relative max-h-screen overflow-y-auto">
                    {children}
                </main>
            </div>
            <ContextPanel />
            <MobileNav />
        </div>
    )
}
