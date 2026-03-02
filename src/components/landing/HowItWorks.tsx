'use client'

import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle2, TrendingUp } from 'lucide-react'

const steps = [
    {
        title: 'Share the update',
        description: 'Just text Stoka like a friend. "I just sold 10 boxes of paracetamol" or "Just received 50 units of Shampoo from Mike."',
        icon: MessageSquare,
        color: 'bg-blue-500'
    },
    {
        title: 'We handle the math',
        description: 'Stoka figures out the quantities, costs, and totals for you. Just a quick double-check and you\'re done.',
        icon: CheckCircle2,
        color: 'bg-emerald-500'
    },
    {
        title: 'Relax and Grow',
        description: 'Your stock updates, your charts grow, and you get to spend more time with your family and customers.',
        icon: TrendingUp,
        color: 'bg-purple-500'
    }
]

export function HowItWorks() {
    return (
        <section id="demo" className="py-24 bg-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-7xl lg:text-9xl font-black text-white/5 tracking-tighter absolute left-1/2 -translate-x-1/2 -mt-10 select-none">SYSTEM</h2>
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-4">How it Works</h2>
                    <p className="text-lg text-gray-400">Inventory management that feels like magic.</p>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 hidden lg:block -translate-y-1/2" />

                    <div className="grid lg:grid-cols-3 gap-12 relative">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/50 z-10`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
