import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    return (
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start for free, upgrade when you need to grow your team and locations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-2xl font-semibold mb-2">Starter</h3>
                    <p className="text-gray-500 mb-6">Perfect for solo entrepreneurs.</p>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-gray-500">/ forever</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Unlimited products', 'AI Chat Assistant', 'Dashboard & Reports', '1 User Seat', '1 Location'].map(feature => (
                            <li key={feature} className="flex items-center gap-3 text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <Link href="/register" className="w-full py-3 px-4 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition text-center">
                        Get Started Free
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Popular
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
                    <p className="text-gray-400 mb-6">For growing businesses and teams.</p>
                    <div className="mb-8">
                        <span className="text-4xl font-bold text-white">$29</span>
                        <span className="text-gray-400">/ month</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Everything in Starter', 'Unlimited User Seats', 'Role-based access control', 'Multi-location support', 'Smart Reorder Insights', 'Priority Email Support'].map(feature => (
                            <li key={feature} className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <Link href="/register" className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition text-center shadow-lg shadow-blue-900/20">
                        Start 14-Day Free Trial
                    </Link>
                </div>
            </div>
        </div>
    )
}
