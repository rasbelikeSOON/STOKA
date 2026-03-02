import Link from 'next/link'
import { Package } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Stoka</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Features</Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Pricing</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition hidden sm:block">
                            Sign In
                        </Link>
                        <Link href="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm shadow-blue-600/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
