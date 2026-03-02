import { z } from 'zod';

export const TransactionItemSchema = z.object({
    product_name: z.string(),
    variant_descriptor: z.string().optional(), // "lavender small size"
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
    total_price: z.number().positive(),
    is_new_product: z.boolean(),
    matched_product_id: z.string().uuid().nullable().optional(),
    matched_variant_id: z.string().uuid().nullable().optional(),
});

export const AIResponseSchema = z.object({
    intent: z.enum([
        'log_purchase', 'log_sale', 'stock_check',
        'log_adjustment', 'log_return', 'log_transfer',
        'create_product', 'price_check', 'general_query'
    ]),
    confidence: z.number().min(0).max(1),
    needs_clarification: z.boolean(),
    clarification_question: z.string().optional(),
    confirmation_message: z.string(),
    transaction: z.object({
        type: z.enum(['purchase', 'sale', 'adjustment', 'return', 'transfer']),
        items: z.array(TransactionItemSchema),
        supplier_name: z.string().optional(),
        customer_name: z.string().optional(),
        location_name: z.string().optional(),
        total_amount: z.number(),
        notes: z.string().optional(),
    }).optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
export type TransactionItem = z.infer<typeof TransactionItemSchema>;
