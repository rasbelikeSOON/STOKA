'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { currencyLocationSchema, type CurrencyLocationInput } from '@/lib/validations/onboarding'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function StepCurrencyLocation({ onNext, data }: { onNext: () => void, data: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const { register, handleSubmit, formState: { errors } } = useForm<CurrencyLocationInput>({
        resolver: zodResolver(currencyLocationSchema) as any,
        defaultValues: {
            currency: 'NGN'
        }
    })

    async function onSubmit(formData: CurrencyLocationInput) {
        setIsLoading(true)

        try {
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    ...formData
                })
            })

            const result = await response.json()

            if (!response.ok) throw new Error(result.error || 'Failed to complete onboarding')

            toast.success('Business space created!')
            onNext() // Go to Step 3
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Store Defaults</h2>
                <p className="mt-2 text-sm text-gray-600">Set your primary location and currency</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="locationName">Primary Location Name</label>
                    <input
                        id="locationName"
                        type="text"
                        {...register('locationName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. Main Store, Downtown Branch"
                    />
                    {errors.locationName && <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        {...register('currency')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                    >
                        <option value="NGN">NGN (₦) - Nigerian Naira</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="KES">KES (KSh) - Kenyan Shilling</option>
                        <option value="ZAR">ZAR (R) - South African Rand</option>
                    </select>
                    {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Complete Setup'}
                </button>
            </form>
        </div>
    )
}
