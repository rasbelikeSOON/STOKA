'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema) as any,
    })

    async function onSubmit(data: ResetPasswordInput) {
        setIsLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${location.origin}/reset-password`,
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
            return
        }

        setIsSubmitted(true)
        setIsLoading(false)
    }

    if (isSubmitted) {
        return (
            <div className="text-center">
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">Check your email</h2>
                <p className="mt-2 text-sm text-gray-600">
                    We sent a password reset link to your email.
                </p>
                <div className="mt-6">
                    <Link href="/signin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Return to sign in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="mt-2 text-center text-2xl font-semibold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email address and we will send you a link to reset your password.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending link...' : 'Send reset link'}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                        Return to sign in
                    </Link>
                </div>
            </form>
        </div>
    )
}
