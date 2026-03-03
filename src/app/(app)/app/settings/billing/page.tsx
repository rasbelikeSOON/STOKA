'use client'

import { Check, Zap, Crown, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For individuals getting started',
    features: ['1 Location', '500 Products', 'Basic AI Chat', 'Email Support'],
    isCurrent: true,
    icon: Zap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    name: 'Growth',
    price: '₦15,000',
    period: '/month',
    description: 'For growing businesses',
    features: ['5 Locations', 'Unlimited Products', 'Advanced AI Insights', 'Priority Support', 'Team Management', 'CSV Export'],
    isCurrent: false,
    icon: Crown,
    color: 'text-[--brand-primary]',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations',
    features: ['Unlimited Locations', 'API Access', 'Dedicated Account Manager', 'Custom AI Training', 'SLA Guarantee', 'Audit Logs'],
    isCurrent: false,
    icon: Sparkles,
    color: 'text-[--brand-purple]',
    bgColor: 'bg-purple-50',
  }
]

export default function BillingSettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">Plans & Billing</h2>
        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-2">
          Manage your subscription and payment details
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-[--brand-primary] to-[#3B82F6] rounded-3xl p-8 mb-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Current Plan</div>
          <h3 className="text-3xl font-black tracking-tight">Starter — Free</h3>
          <p className="text-sm font-medium opacity-80 mt-2 max-w-md">
            You&apos;re on the free plan. Upgrade to unlock advanced AI insights, team management, and multi-location support.
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`bg-white rounded-3xl border p-8 flex flex-col transition-all duration-300 hover:shadow-lg ${plan.isCurrent ? 'border-[--brand-primary] shadow-md ring-2 ring-[--brand-primary]/10' : 'border-[--border]'}`}
          >
            <div className={`h-12 w-12 ${plan.bgColor} ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
              <plan.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[--text-primary] tracking-tight">{plan.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-3xl font-black text-[--text-primary]">{plan.price}</span>
              {plan.period && <span className="text-sm font-bold text-[--text-muted]">{plan.period}</span>}
            </div>
            <p className="text-[11px] font-bold text-[--text-muted] mb-6">{plan.description}</p>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center gap-3 text-sm font-bold text-[--text-secondary]">
                  <Check className={`w-4 h-4 ${plan.color} shrink-0`} />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full h-12 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${plan.isCurrent
                ? 'bg-[--surface-muted] text-[--text-muted] cursor-default'
                : 'bg-[#1D4ED8] text-white hover:bg-[#1e40af] shadow-lg shadow-blue-500/20'
                }`}
              disabled={plan.isCurrent}
            >
              {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
