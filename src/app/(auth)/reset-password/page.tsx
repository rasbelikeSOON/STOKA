'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { updatePasswordSchema, type UpdatePasswordInput } from '@/lib/validations/auth'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdatePasswordInput>({
        resolver: zodResolver(updatePasswordSchema) as any,
    })

    async function onSubmit(data: UpdatePasswordInput) {
        setIsLoading(true)
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
            return
        }

        toast.success('Password updated successfully!')
        router.push('/app/chat')
    }

    return (
        <div>
            <h2 className="mt-2 text-center text-2xl font-semibold text-gray-900">Set new password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Please enter your new password below.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">New Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        {...register('password')}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating password...' : 'Update password'}
                    </button>
                </div>
            </form>
        </div>
    )
}
