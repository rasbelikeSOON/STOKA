'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormValues } from '@/lib/validations/contact'
import { useState, useEffect } from 'react'
import { Loader2, X } from 'lucide-react'

export function ContactForm({
    initialData,
    onSave,
    onCancel,
    title
}: {
    initialData?: any,
    onSave: (data: ContactFormValues) => Promise<void>,
    onCancel: () => void,
    title: string
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema) as any,
        defaultValues: {
            name: '', email: '', phone: '', address: '', notes: ''
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                notes: initialData.notes || '',
            })
        } else {
            form.reset()
        }
    }, [initialData, form])

    const onSubmit = async (values: ContactFormValues) => {
        setIsSubmitting(true)
        try {
            await onSave(values)
            form.reset()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#16191f] rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                            <input
                                {...form.register('name')}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                            {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                {...form.register('email')}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                            {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                {...form.register('phone')}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <textarea
                                {...form.register('address')}
                                rows={2}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                            <textarea
                                {...form.register('notes')}
                                rows={2}
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button" onClick={onCancel}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
