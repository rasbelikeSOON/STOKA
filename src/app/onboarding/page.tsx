'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Globe, MessageSquare, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'retail',
        currency: 'NGN',
        timezone: 'Africa/Lagos',
        locationName: 'Main Store',
    })

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    async function handleComplete() {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Create business
            const { data: business, error: bError } = await supabase
                .from('businesses')
                .insert({
                    name: formData.businessName,
                    business_type: formData.businessType,
                    currency: formData.currency,
                    timezone: formData.timezone,
                    owner_id: user.id
                })
                .select()
                .single()

            if (bError) throw bError

            // 2. Add user as owner/member
            const { error: mError } = await supabase
                .from('business_members')
                .insert({
                    business_id: business.id,
                    user_id: user.id,
                    role: 'owner',
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    email: user.email,
                    joined_at: new Date().toISOString()
                })

            if (mError) throw mError

            // 3. Create default location
            const { error: lError } = await supabase
                .from('locations')
                .insert({
                    business_id: business.id,
                    name: formData.locationName,
                    is_default: true
                })

            if (lError) throw lError

            toast.success('Business set up successfully!')
            router.push('/app/chat')
        } catch (error: any) {
            toast.error(error.message)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[--surface-muted] flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full">
                {/* Stepper Header */}
                <div className="mb-8 flex justify-between items-center px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s ? 'bg-[--brand-primary] text-white' : 'bg-white text-[--text-muted] border border-[--border]'
                                }`}>
                                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                            </div>
                            {s < 3 && <div className={`h-0.5 w-12 sm:w-24 ${step > s ? 'bg-[--brand-primary]' : 'bg-[--border]'}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-2xl">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="h-12 w-12 bg-blue-100 text-[--brand-primary] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Tell us about your business</h2>
                                        <p className="text-[--text-muted]">This helps Stoka customize your experience.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Business Name</label>
                                            <Input
                                                placeholder="e.g. Lagos Beauty Hub"
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Business Type</label>
                                            <select
                                                className="w-full h-11 rounded-xl border border-[--border] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-primary]"
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            >
                                                <option value="retail">Retail Store</option>
                                                <option value="pharmacy">Pharmacy</option>
                                                <option value="restaurant">Restaurant</option>
                                                <option value="wholesale">Wholesale</option>
                                                <option value="beauty">Beauty Supply</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-11 mt-4"
                                        disabled={!formData.businessName}
                                        onClick={nextStep}
                                    >
                                        Next step <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="h-12 w-12 bg-emerald-100 text-[--brand-accent] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Location & Currency</h2>
                                        <p className="text-[--text-muted]">Where should Stoka track your stock?</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Currency</label>
                                            <select
                                                className="w-full h-11 rounded-xl border border-[--border] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand-primary]"
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                <option value="NGN">Nigerian Naira (₦)</option>
                                                <option value="USD">US Dollar ($)</option>
                                                <option value="KES">Kenyan Shilling (KSh)</option>
                                                <option value="GHS">Ghanaian Cedi (GH₵)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Default Location Name</label>
                                            <Input
                                                placeholder="e.g. Lagos Main Store"
                                                value={formData.locationName}
                                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="ghost" className="flex-1 h-11" onClick={prevStep}>
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button className="flex-[2] h-11" onClick={nextStep}>
                                            Almost done! <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 text-center">
                                    <div className="h-12 w-12 bg-purple-100 text-[--brand-purple] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Ready to chat?</h2>
                                    <p className="text-[--text-muted]">
                                        Your dashboard will be ready as soon as you say "Hi".
                                        You can start by recording your first purchase or sale.
                                    </p>

                                    <div className="bg-[--surface-muted] p-4 rounded-xl text-left italic text-sm text-[--text-secondary] border border-dashed border-[--border]">
                                        "Sold 5 units of Aorta Shampoo to a walk-in customer for ₦2,500 total"
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="ghost" className="flex-1 h-11" onClick={prevStep} disabled={isLoading}>
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-[2] h-11 bg-[--brand-accent] hover:bg-emerald-600"
                                            onClick={handleComplete}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Setting up...' : 'Get Started →'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
