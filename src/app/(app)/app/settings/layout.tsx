'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, MapPin, Users, UserCircle } from 'lucide-react'
import { RoleGate } from '@/components/auth/RoleGate'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const tabs = [
        { name: 'Business Identity', href: '/app/settings/business', icon: Building2, roles: ['owner'] },
        { name: 'Locations', href: '/app/settings/locations', icon: MapPin, roles: ['owner', 'manager'] },
        { name: 'Team & Roles', href: '/app/settings/team', icon: Users, roles: ['owner'] },
        { name: 'My Account', href: '/app/settings/account', icon: UserCircle, roles: ['owner', 'manager', 'staff'] },
    ]

    return (
        <div className="max-w-6xl mx-auto pb-12 flex flex-col md:flex-row gap-8">
            {/* Sidebar Nav */}
            <div className="w-full md:w-64 shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
                <nav className="flex flex-col space-y-1 relative">
                    {tabs.map(tab => {
                        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
                        return (
                            <RoleGate key={tab.href} allowed={tab.roles as any[]}>
                                <Link
                                    href={tab.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
                                    {tab.name}
                                </Link>
                            </RoleGate>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    )
}
