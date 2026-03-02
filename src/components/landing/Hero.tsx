'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, Zap, Sparkles } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-[#F0F0F0]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                        <span className="text-sm font-semibold text-gray-700">Now 10x faster with AI</span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-[#111827]">
                        Run your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Business</span> <br />
                        without the headache.
                    </h1>

                    <p className="mt-8 text-xl text-gray-600 max-w-lg leading-relaxed">
                        Finally, a way to manage stock that feels like sending a text. No complex tables, no late nights at the office—just you and your shop, in perfect harmony.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <Link
                            href="/signup"
                            className="bg-[#4F46E5] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#3730A3] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#demo"
                            className="bg-white text-[#111827] border-2 border-[#111827] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            Watch Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
                        <div>
                            <p className="text-3xl font-black text-[#111827]">99%</p>
                            <p className="text-sm text-gray-500 font-medium">Accuracy</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#111827]">2hrs</p>
                            <p className="text-sm text-gray-500 font-medium">Saved Daily</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#111827]">0</p>
                            <p className="text-sm text-gray-500 font-medium">Training</p>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="w-[320px] h-[640px] mx-auto bg-[#1A1A2E] rounded-[48px] border-[8px] border-[#0D0D0D] shadow-2xl overflow-hidden relative">
                        {/* Mock App Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                                    <Bot className="text-blue-500 w-6 h-6" />
                                </div>
                                <div className="h-4 w-24 bg-white/10 rounded-full" />
                            </div>

                            <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-4 text-sm ml-8 shadow-lg">
                                Just sold 15 Paracetamol boxes for NGN 500 each.
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="bg-white rounded-2xl p-5 shadow-xl border border-emerald-500"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sale Logged</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Item</span>
                                        <span className="text-xs font-bold">Paracetamol</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Qty</span>
                                        <span className="text-xs font-bold">15</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Total</span>
                                        <span className="text-xs font-bold">₦7,500</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Status bar */}
                        <div className="absolute bottom-0 w-full h-16 bg-[#0D0D0D]/50 backdrop-blur-xl border-t border-white/5 p-4">
                            <div className="w-full h-full bg-white/10 rounded-full" />
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Revenue</p>
                                <p className="text-lg font-black">+240%</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute bottom-12 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Stock Alerts</p>
                                <p className="text-lg font-black text-emerald-600">All Good</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
