'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Loader2 } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema) as any,
    })

    async function onSubmit(data: SignUpInput) {
        setIsLoading(true)
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
            return
        }

        toast.success('Account created! Please check your email to verify.')
        router.push('/onboarding')
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-[--text-primary]">Join Stoka</h2>
                <p className="text-sm text-[--text-muted]">
                    Create your account to start managing your inventory
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[--text-secondary]" htmlFor="email">Email address</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[--text-secondary]" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#1D4ED8] text-white font-bold text-sm hover:bg-[#1e40af] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? 'Creating account...' : 'Create free account'}
                </button>

                <p className="text-center text-xs text-[--text-muted] px-4">
                    By clicking continue, you agree to our{' '}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-[--brand-primary]">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-[--brand-primary]">Privacy Policy</Link>.
                </p>

                <p className="text-center text-sm text-[--text-muted]">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-[--brand-primary] hover:text-[--brand-primary-hover] transition-colors">
                        Sign in instead
                    </Link>
                </p>
            </form>
        </div>
    )
}
