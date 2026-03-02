import * as z from 'zod'

export const transactionItemSchema = z.object({
    variant_id: z.string().uuid("Please select a variant"),
    quantity: z.preprocess((v) => Number(v), z.number().int().min(1, "Quantity must be at least 1")),
    unit_price: z.preprocess((v) => Number(v), z.number().min(0, "Unit price cannot be negative")),
})

export const transactionSchema = z.object({
    location_id: z.string().uuid("Please select a valid location"),
    type: z.enum(['purchase', 'sale', 'adjustment', 'return', 'transfer']),
    status: z.enum(['confirmed', 'pending', 'cancelled']).default('confirmed'),
    supplier_id: z.string().uuid().optional().or(z.literal('')),
    customer_id: z.string().uuid().optional().or(z.literal('')),
    notes: z.string().optional(),
    items: z.array(transactionItemSchema).min(1, "At least one item is required")
})

export const updateTransactionStatusSchema = z.object({
    status: z.enum(['confirmed', 'pending', 'cancelled'])
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
export type TransactionItemFormValues = z.infer<typeof transactionItemSchema>
