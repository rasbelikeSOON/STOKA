'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, MapPin, Users, UserCircle, CreditCard, Settings } from 'lucide-react'
import { RoleGate } from '@/components/auth/RoleGate'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const tabs = [
        { name: 'Business Identity', href: '/app/settings/business', icon: Building2, roles: ['owner'], desc: 'Company profile' },
        { name: 'Locations', href: '/app/settings/locations', icon: MapPin, roles: ['owner', 'manager'], desc: 'Storefronts & warehouses' },
        { name: 'Team & Roles', href: '/app/settings/team', icon: Users, roles: ['owner'], desc: 'Access control' },
        { name: 'Billing', href: '/app/settings/billing', icon: CreditCard, roles: ['owner'], desc: 'Plans & invoices' },
        { name: 'My Account', href: '/app/settings/account', icon: UserCircle, roles: ['owner', 'manager', 'staff'], desc: 'Profile & security' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-10">
            {/* Sidebar Nav */}
            <div className="w-full md:w-72 shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-black text-[--brand-primary] uppercase tracking-[0.2em] mb-3">
                    <Settings className="w-3 h-3" />
                    Configuration
                </div>
                <h1 className="text-4xl font-black text-[--text-primary] tracking-tight mb-8">Settings</h1>
                <nav className="flex flex-col space-y-1.5">
                    {tabs.map(tab => {
                        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
                        return (
                            <RoleGate key={tab.href} allowed={tab.roles as any[]}>
                                <Link
                                    href={tab.href}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${isActive
                                        ? 'bg-white shadow-sm border border-[--border] text-[--text-primary]'
                                        : 'text-[--text-muted] hover:bg-white/50 hover:text-[--text-primary]'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-[--brand-primary]/10 text-[--brand-primary]' : 'bg-[--surface-muted] text-[--text-muted] group-hover:text-[--brand-primary]'}`}>
                                        <tab.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div>{tab.name}</div>
                                        <div className="text-[10px] font-bold text-[--text-muted] uppercase tracking-widest mt-0.5">{tab.desc}</div>
                                    </div>
                                </Link>
                            </RoleGate>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {children}
            </div>
        </div>
    )
}
