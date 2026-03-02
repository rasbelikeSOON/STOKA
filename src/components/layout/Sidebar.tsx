'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { MessageSquare, LayoutDashboard, Package, RotateCcw, Users, Building2, Settings } from 'lucide-react'

const navigation = [
    { name: 'Chat', href: '/app/chat', icon: MessageSquare },
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'Inventory', href: '/app/inventory', icon: RotateCcw },
    { name: 'Suppliers', href: '/app/suppliers', icon: Building2 },
    { name: 'Customers', href: '/app/customers', icon: Users },
    { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
                <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 border-b border-gray-800">
                    <Logo className="text-white" />
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                >
                                    <item.icon
                                        className={`${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                                            } mr-3 flex-shrink-0 h-5 w-5`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
}
