'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessInfoSchema, type BusinessInfoInput } from '@/lib/validations/onboarding'

export function StepBusinessInfo({ onNext }: { onNext: (data: BusinessInfoInput) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm<BusinessInfoInput>({
        resolver: zodResolver(businessInfoSchema) as any,
    })

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Let's get to know your business</h2>
                <p className="mt-3 text-gray-600 leading-relaxed">We're excited to help you grow. First, what should we call your workspace?</p>
            </div>

            <form onSubmit={handleSubmit(onNext)} className="space-y-6 pt-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">Business Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-gray-900"
                        placeholder="e.g. Acme Pharmacy"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">Business Type</label>
                    <select
                        id="type"
                        {...register('type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                    >
                        <option value="">Select a type</option>
                        <option value="retail">Retail</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="restaurant">Restaurant / Cafe</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="beauty">Beauty / Salon</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Continue
                </button>
            </form>
        </div>
    )
}
