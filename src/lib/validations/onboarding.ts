import { z } from 'zod'

export const businessInfoSchema = z.object({
    name: z.string().min(2, 'Business name must be at least 2 characters'),
    type: z.enum(['retail', 'pharmacy', 'restaurant', 'wholesale', 'beauty', 'other']),
})

export const currencyLocationSchema = z.object({
    currency: z.string().min(3).max(3),
    locationName: z.string().min(2, 'Location name is required'),
    address: z.string().optional(),
})

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>
export type CurrencyLocationInput = z.infer<typeof currencyLocationSchema>
