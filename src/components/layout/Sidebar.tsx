'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import {
    MessageSquare,
    LayoutDashboard,
    Package,
    RotateCcw,
    Users,
    Building2,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const navigation = [
    { name: 'Chat AI', href: '/app/chat', icon: MessageSquare, color: 'text-blue-500' },
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'Stock Levels', href: '/app/inventory', icon: RotateCcw },
    { name: 'Suppliers', href: '/app/suppliers', icon: Building2 },
    { name: 'Customers', href: '/app/customers', icon: Users },
    { name: 'Insights', href: '/app/insights', icon: Sparkles, color: 'text-purple-500' },
]

export function Sidebar() {
    const pathname = usePathname()
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/signin')
        router.refresh()
    }

    return (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
            <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-[--border]">
                <div className="flex items-center h-20 flex-shrink-0 px-6 mt-2">
                    <Logo className="h-8 w-auto text-[--brand-primary]" />
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4">
                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-[--surface-muted] text-[--brand-primary] shadow-sm"
                                            : "text-[--text-secondary] hover:bg-gray-50 hover:text-[--text-primary]"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                                            isActive ? (item.color || "text-[--brand-primary]") : "text-gray-400 group-hover:text-gray-600"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-auto pt-10 pb-6 space-y-2">
                        <Link
                            href="/app/settings"
                            className={cn(
                                "group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                                pathname.startsWith('/app/settings')
                                    ? "bg-[--surface-muted] text-[--brand-primary]"
                                    : "text-[--text-secondary] hover:bg-gray-50 hover:text-[--text-primary]"
                            )}
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                            Settings
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="group flex items-center px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 w-full"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
