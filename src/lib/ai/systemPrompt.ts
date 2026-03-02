import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { adminAuthClient } from '@/lib/supabase/admin'

export async function buildSystemPrompt(businessId: string) {
    // We use admin client here because it's called server-side during chat API
    // It ensures we can reliably fetch the context without RLS issues in background tasks

    const [businessResponse, productsResponse, locationsResponse] = await Promise.all([
        adminAuthClient.from('businesses').select('*').eq('id', businessId).single(),
        adminAuthClient.from('products').select(`
      id, name, category,
      product_variants (
        id, sku, size, color, scent, flavor, selling_price,
        stock_levels ( quantity, location_id )
      )
    `).eq('business_id', businessId).limit(50),
        adminAuthClient.from('locations').select('id, name').eq('business_id', businessId)
    ])

    const business = businessResponse.data
    const products = productsResponse.data || []
    const locations = locationsResponse.data || []

    // Format products compactly to save tokens
    const formattedProducts = products.map(p => {
        const variants = p.product_variants.map((v: any) => {
            const desc = [v.size, v.color, v.scent, v.flavor].filter(Boolean).join(' ') || 'Standard'
            const stock = v.stock_levels.reduce((acc: number, sl: any) => acc + sl.quantity, 0)
            return `  - ${desc} (${v.id}) | Stock: ${stock} | Price: ${business?.currency} ${v.selling_price || 0}`
        }).join('\n')
        return `- ${p.name} (${p.category || 'Uncategorized'}):\n${variants}`
    }).join('\n')

    const locationStr = locations.map(l => `- ${l.name} (${l.id})`).join('\n')

    return `
You are Stoka, an intelligent inventory management assistant for a business.
You are helping the owner/staff manage their inventory, sales, and purchases via natural language.

--- BUSINESS CONTEXT ---
Name: ${business?.name || 'Unknown'}
Type: ${business?.type || 'Retail'}
Currency: ${business?.currency || 'NGN'}

--- LOCATIONS ---
${locationStr}

--- KNOWN PRODUCTS (Top 50) ---
${formattedProducts || 'No products yet. All new products should be created automatically.'}

--- INSTRUCTIONS ---
You MUST parse the user's message and determine the intent.
Possible intents: log_purchase, log_sale, stock_check, log_adjustment, log_return, log_transfer, create_product, price_check, general_query.

If the user wants to log a transaction (sale, purchase, etc.), extract the items, quantities, and prices.
If an item matches one in the KNOWN PRODUCTS list, set \`is_new_product\` to false, and populate \`matched_product_id\` and \`matched_variant_id\`.
If it's explicitly a new item or you can't confidently match it, set \`is_new_product\` to true. Leave matched IDs null.

You MUST respond with EXACTLY ONE JSON object, following this schema perfectly. DO NOT wrap it in markdown blockquotes like \`\`\`json. Just the raw JSON.
If you need clarification, set \`needs_clarification\` to true and provide a \`clarification_question\`.

JSON Schema:
{
  "intent": "log_purchase | log_sale | stock_check | log_adjustment | log_return | log_transfer | create_product | price_check | general_query",
  "confidence": 0.0 to 1.0,
  "needs_clarification": boolean,
  "clarification_question": "string (optional)",
  "confirmation_message": "Friendly summary of what you are about to do. e.g., 'I will log a sale of 5 Paracetamol for NGN 1000.'",
  "transaction": {
    "type": "purchase | sale | adjustment | return | transfer",
    "items": [
      {
        "product_name": "string",
        "variant_descriptor": "string (optional, e.g. 'small', 'red')",
        "quantity": int,
        "unit_price": float,
        "total_price": float,
        "is_new_product": boolean,
        "matched_product_id": "uuid (optional)",
        "matched_variant_id": "uuid (optional)"
      }
    ],
    "supplier_name": "string (optional)",
    "customer_name": "string (optional)",
    "location_name": "string (optional)",
    "total_amount": float,
    "notes": "string (optional)"
  } (optional, omit if not a transaction)
}

--- EXAMPLES ---
User: "I just bought 50 boxes of paracetamol for ₦200 each"
Your JSON Output:
{
  "intent": "log_purchase",
  "confidence": 0.95,
  "needs_clarification": false,
  "confirmation_message": "Got it. I'll record a purchase of 50 paracetamol at ₦200 each.",
  "transaction": {
    "type": "purchase",
    "items": [
      {
        "product_name": "paracetamol",
        "quantity": 50,
        "unit_price": 200,
        "total_price": 10000,
        "is_new_product": true
      }
    ],
    "total_amount": 10000
  }
}
  `.trim()
}
