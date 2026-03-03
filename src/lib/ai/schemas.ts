import { z } from 'zod';

const ItemSchema = z.object({
    product_name: z.string(),
    matched_product_id: z.string().nullable(),
    matched_variant_id: z.string().nullable(),
    is_new_product: z.boolean(),
    quantity: z.number().nullable(),
    unit_price: z.number().nullable(),
    total_price: z.number().nullable(),
    variant_attributes: z.object({
        size: z.string().nullable(),
        scent: z.string().nullable(),
        color: z.string().nullable(),
        flavor: z.string().nullable(),
        other: z.string().nullable(),
    }).default({ size: null, scent: null, color: null, flavor: null, other: null }),
    notes: z.string().nullable(),
});

export const AIResponseSchema = z.object({
    understood: z.boolean(),
    intent_summary: z.string(),
    action: z.object({
        type: z.enum([
            'RECORD_PURCHASE', 'RECORD_SALE', 'RECORD_ADJUSTMENT',
            'RECORD_RETURN_IN', 'RECORD_RETURN_OUT', 'RECORD_TRANSFER',
            'RECORD_STOCK_TAKE', 'UPDATE_PRICE', 'UPDATE_THRESHOLD',
            'SET_EXPIRY', 'CREATE_SUPPLIER', 'CREATE_CUSTOMER',
            'ANSWER_QUERY', 'RUN_ANALYSIS', 'GENERATE_REPORT',
            'MULTI_ACTION', 'CLARIFY', 'GENERAL_CHAT'
        ]).nullable(),
        items: z.array(ItemSchema).default([]),
        transaction_metadata: z.object({
            supplier_name: z.string().nullable(),
            customer_name: z.string().nullable(),
            transaction_date: z.string(),
            from_location: z.string().nullable(),
            to_location: z.string().nullable(),
            adjustment_reason: z.enum(['expired', 'damaged', 'lost', 'found', 'correction', 'other']).nullable(),
            payment_method: z.string().nullable(),
            notes: z.string().nullable(),
        }),
    }),
    query: z.object({
        type: z.string().nullable(),
        product_filter: z.string().nullable(),
        variant_filter: z.string().nullable(),
        period_start: z.string().nullable(),
        period_end: z.string().nullable(),
        period_label: z.string().nullable(),
        supplier_filter: z.string().nullable(),
        customer_filter: z.string().nullable(),
        comparison_target: z.string().nullable(),
    }),
    confirmation_card: z.object({
        show: z.boolean(),
        title: z.string(),
        summary_lines: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).default([]),
        uncertainty_flags: z.array(z.string()).default([]),
        confirm_button_label: z.string(),
        cancel_button_label: z.string(),
    }),
    response_message: z.string(),
    needs_clarification: z.boolean(),
    clarification_question: z.string().nullable(),
    clarification_context: z.string().nullable(),
    proactive_insight: z.object({
        show: z.boolean(),
        type: z.string().nullable(),
        message: z.string().nullable(),
    }),
    memory_candidates: z.array(z.object({
        type: z.string(),
        key: z.string(),
        value: z.string(),
        confidence: z.number(),
    })).default([]),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
export type ActionItem = z.infer<typeof ItemSchema>;
