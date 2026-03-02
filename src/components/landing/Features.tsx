'use client'

import { motion } from 'framer-motion'
import { Bot, BarChart3, PackageCheck, Zap, Shield, Search } from 'lucide-react'

const features = [
    {
        title: 'Your Digital Second-In-Command',
        description: 'Log sales and deliveries just by talking. Stoka remembers the details so you don\'t have to, freeing your mind for what matters.',
        icon: Bot,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        title: 'See the Whole Picture',
        description: 'No more guessing. Beautiful dashboards show you exactly where your profit is coming from, in a language you actually understand.',
        icon: BarChart3,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        title: 'Proactive Peace of Mind',
        description: 'Sleep better knowing Stoka is watching your shelves. Get a gentle nudge before you run out of your customers\' favorites.',
        icon: PackageCheck,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        title: 'Your Data, Safe and Sound',
        description: 'We treat your business data like it\'s our own. Encrypted, isolated, and always available whenever you need it.',
        icon: Shield,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        title: 'Find Anything Instantly',
        description: 'Stop digging through ledgers. Recall any sale or supplier in a heartbeat. It\'s like having a photographic memory for your store.',
        icon: Search,
        color: 'text-pink-600',
        bg: 'bg-pink-50'
    },
    {
        title: 'Ready Whenever You Are',
        description: 'Works on your phone like a real app. Even when the internet is slow, Stoka stays by your side.',
        icon: Zap,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Built for modern business</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto italic">"The spreadsheet is dead. AI is the new interface for commerce."</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className={`w-14 h-14 ${feature.bg} rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
