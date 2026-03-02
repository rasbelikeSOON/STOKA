import * as z from 'zod'

export const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    category: z.string().optional(),
    supplier_id: z.string().uuid().optional().or(z.literal('')),
})

export const variantSchema = z.object({
    sku: z.string().min(2, "SKU is required"),
    barcode: z.string().optional(),
    attributes: z.record(z.string(), z.string()).optional(), // e.g., {"size": "M", "color": "Red"}
    cost_price: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0).optional()),
    selling_price: z.preprocess((v) => Number(v), z.number().min(0, "Selling price cannot be negative")),
    reorder_threshold: z.preprocess((v) => (v === '' ? 5 : Number(v)), z.number().int().min(0).optional().default(5)),
    expiry_date: z.string().optional().or(z.literal('')),
})

// Unified form schema for creating a product WITH its first initial variant
export const createProductWithFirstVariantSchema = z.object({
    product: productSchema,
    variant: variantSchema,
    initial_quantity: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().int().min(0).default(0)),
    location_id: z.string().uuid("Please select a valid location for initial stock")
})

export type ProductFormValues = z.infer<typeof productSchema>
export type VariantFormValues = z.infer<typeof variantSchema>
export type CreateProductWithFirstVariantValues = z.infer<typeof createProductWithFirstVariantSchema>
