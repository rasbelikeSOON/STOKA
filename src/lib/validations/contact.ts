import * as z from 'zod'

export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
