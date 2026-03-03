const { z } = require('zod');

const TransactionItemSchema = z.object({
    product_name: z.string(),
    variant_descriptor: z.string().optional(),
    quantity: z.number().int().min(1).nullable().optional(),
    unit_price: z.number().min(0).nullable().optional(),
    total_price: z.number().min(0).nullable().optional(),
    is_new_product: z.boolean(),
    matched_product_id: z.string().uuid().nullable().optional(),
    matched_variant_id: z.string().uuid().nullable().optional(),
});

const AIResponseSchema = z.object({
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
        total_amount: z.number().min(0).nullable().optional(),
        notes: z.string().optional(),
    }).nullable().optional(),
});

const testInput = `{
  "intent": "log_purchase",
  "confidence": 0.9,
  "needs_clarification": true,
  "clarification_question": "...",
  "confirmation_message": "...",
  "transaction": {
    "type": "purchase",
    "items": [
      {
        "product_name": "rice",
        "quantity": 20,
        "unit_price": null,
        "total_price": null,
        "is_new_product": true
      }
    ],
    "total_amount": null
  }
}`;

try {
    const rawData = JSON.parse(testInput);
    const result = AIResponseSchema.parse(rawData);
    console.log("SUCCESS! Parsed:");
    // console.log(JSON.stringify(result, null, 2));
} catch (err) {
    console.error("FAIL:", err.errors);
}
