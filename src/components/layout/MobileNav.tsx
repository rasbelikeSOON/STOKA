'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, LayoutDashboard, Package, Settings } from 'lucide-react'

const navigation = [
    { name: 'Chat', href: '/app/chat', icon: MessageSquare },
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe z-20">
            <div className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] sm:text-xs font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
