import Link from 'next/link'
import { Package } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Stoka</span>
                        </Link>
                        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                            The AI-powered conversational inventory management platform for modern retail and wholesale businesses.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition">Features</Link></li>
                            <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition">Pricing</Link></li>
                            <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition">Sign In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Stoka Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Social mockups */}
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
