import Link from 'next/link'
import { ArrowRight, Bot, BarChart3, PackageCheck, Zap } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-20 lg:py-32 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
                    <Zap className="w-4 h-4" /> Introducing Stoka AI
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                    Manage your inventory <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        simply by asking.
                    </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Stop navigating endless tables. Tell Stoka what you sold, ask for stock levels, and get intelligent reorder alerts—all through a powerful chat interface.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-600/20">
                        Start free trial <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="#demo" className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 text-lg">
                        See it in action
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section id="features" className="w-full py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to run your store</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Skip the spreadsheet headaches. Stoka handles the complex data structures while you just type what happened.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">AI assistant</h3>
                            <p className="text-gray-600 leading-relaxed">Log sales, record deliveries, and check stock by typing natural sentences. Stoka understands context across variants and locations.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
                            <p className="text-gray-600 leading-relaxed">Visual dashboards auto-generate real-time profit margins, revenue trends, and top performing products without any configuration.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                                <PackageCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Smart Reordering</h3>
                            <p className="text-gray-600 leading-relaxed">Stoka analyzes your sales velocity and alerts you when it's time to restock, making sure you never run out of bestsellers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="w-full py-24 bg-gray-900 text-white text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Ready to regain control of your inventory?</h2>
                    <p className="text-xl text-gray-400 mb-10">Join modern retail businesses saving hours every week with Stoka.</p>
                    <Link href="/register" className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition shadow-xl shadow-blue-900/20 text-lg">
                        Create your free account
                    </Link>
                </div>
            </section>
        </div>
    )
}
