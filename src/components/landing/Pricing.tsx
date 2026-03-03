'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'

const tiers = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Every great business starts small. We\'re here to help you get off the ground with no pressure.',
        features: [
            'Up to 100 products',
            'AI Chat Assistant',
            'Basic Insights',
            '1 Location',
            '100 transactions/mo'
        ],
        cta: 'Start for free',
        highlight: false
    },
    {
        name: 'Growth',
        price: '₦15,000',
        period: '/mo',
        description: 'For busy shops that need a dedicated partner to handle the complexity of scaling.',
        features: [
            'Unlimited products',
            'Priority Support',
            'Profit Margin Analysis',
            'Up to 5 locations',
            'Advanced Team Roles',
            'Custom Reorder Thresholds'
        ],
        cta: 'Grow with us',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Tailored solutions for large operations that need deep, personalized inventory control.',
        features: [
            'White-glove setup',
            'Custom AI Training',
            'Multi-warehouse Sync',
            'Dedicated Partner Manager',
            'Custom API Access'
        ],
        cta: 'Talk to a human',
        highlight: false
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Simple, transparent pricing</h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">No hidden fees. Scale as your business grows.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`rounded-3xl p-8 ring-1 transition-all ${tier.highlight
                                ? 'ring-blue-600 bg-white shadow-2xl scale-105 z-10'
                                : 'ring-gray-200 bg-gray-50'
                                }`}
                        >
                            <h3 className={`text-xl font-bold ${tier.highlight ? 'text-blue-600' : 'text-gray-900'}`}>{tier.name}</h3>
                            <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-black tracking-tight text-gray-900">{tier.price}</span>
                                {tier.period && <span className="text-sm font-semibold leading-6 text-gray-600">{tier.period}</span>}
                            </p>
                            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                {tier.features.map(feature => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/register"
                                className={`mt-8 block w-full rounded-full px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all ${tier.highlight
                                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400'
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
