import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AIResponse } from './schemas'

export async function executeQuery(query: AIResponse['query'], businessId: string) {
    if (!query.type) return { text: "I'm not sure what you're asking. Could you clarify?", format: 'text' };

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            }
        }
    )

    switch (query.type) {
        case 'STOCK_LEVEL': {
            let dbQuery = supabase
                .from('products')
                .select('name, product_variants(size, color, stock_levels(quantity))')
                .eq('business_id', businessId);

            if (query.product_filter) {
                dbQuery = dbQuery.ilike('name', `%${query.product_filter}%`);
            }

            const { data } = await dbQuery;
            if (!data || data.length === 0) return { text: `I couldn't find any stock matching "${query.product_filter}".`, format: 'text' };

            let total = 0;
            const details = data.map(p => {
                const pTotal = p.product_variants.reduce((sum: number, v: any) =>
                    sum + v.stock_levels.reduce((s: number, sl: any) => s + sl.quantity, 0)
                    , 0);
                total += pTotal;
                return `${p.name}: ${pTotal} units`;
            }).join('\\n');

            return {
                text: query.product_filter ? `You have ${total} units of ${query.product_filter} left.` : `Here are your stock levels:\\n${details}`,
                data,
                format: 'text'
            };
        }

        case 'LOW_STOCK': {
            const { data } = await supabase.rpc('get_low_stock', { p_business_id: businessId });
            return {
                text: data?.length ? `I found ${data.length} items running low.` : "All your stock is healthy!",
                data: data || [],
                format: data?.length ? 'table' : 'text'
            };
        }

        // Add additional cases (SALES_TOTAL, REVENUE) as they are requested or scoped

        default:
            return { text: "I'm sorry, I can't generate that specific report just yet.", format: 'text' };
    }
}

export function formatQueryResponse(responseMessage: string, queryResult: any) {
    // If the LLM already wrote a phenomenal response, we can just return it, 
    // or we can append the data if it needs a table.
    return {
        text: responseMessage || queryResult.text,
        data: queryResult.data,
        format: queryResult.format
    }
}
