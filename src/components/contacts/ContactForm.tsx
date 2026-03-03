'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormValues } from '@/lib/validations/contact'
import { useState, useEffect } from 'react'
import { Loader2, X, User, Phone, Mail, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[--text-primary]/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-8 border-b border-[--border]">
                    <div>
                        <h2 className="text-2xl font-black text-[--text-primary] tracking-tight">{title}</h2>
                        <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest mt-1">Contact Details & Identity</p>
                    </div>
                    <button onClick={onCancel} className="p-2 text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-muted] rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 overflow-y-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Full Name *
                            </label>
                            <Input
                                {...form.register('name')}
                                placeholder="e.g. John Doe Enterprises"
                            />
                            {form.formState.errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email Address
                            </label>
                            <Input
                                type="email"
                                {...form.register('email')}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Phone Number
                            </label>
                            <Input
                                {...form.register('phone')}
                                placeholder="+234..."
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Physical Address
                            </label>
                            <textarea
                                {...form.register('address')}
                                rows={2}
                                className="w-full px-5 py-4 bg-[--surface-muted] border border-[--border] rounded-2xl focus:ring-2 focus:ring-[--brand-primary] text-[--text-primary] font-bold text-sm outline-none transition-all placeholder:text-[--text-muted]/50"
                                placeholder="Street, Building, City..."
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Additional Notes
                            </label>
                            <textarea
                                {...form.register('notes')}
                                rows={2}
                                className="w-full px-5 py-4 bg-[--surface-muted] border border-[--border] rounded-2xl focus:ring-2 focus:ring-[--brand-primary] text-[--text-primary] font-bold text-sm outline-none transition-all placeholder:text-[--text-muted]/50"
                                placeholder="Specific vendor terms, birthdays, etc."
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-4 border-t border-[--border]">
                        <Button
                            type="button" variant="ghost" onClick={onCancel}
                            className="h-12 px-8 text-[11px] font-black uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit" disabled={isSubmitting}
                            className="h-12 px-10 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[--brand-primary]/20"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Save Contact
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
