const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
    // Attempt the same query that useBusinessContext does
    const { data, error } = await supabase
        .from('business_members')
        .select('business_id, role')
        .limit(1);

    if (error) {
        console.error('ERROR JSON:', JSON.stringify(error, null, 2));
        console.error('RAW ERROR:', error);
    } else {
        console.log('DATA:', data);
    }
}
run();
