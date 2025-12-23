const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking bugs table schema...');

    // We can't directly check schema with anon key usually, but we can try to insert a dummy record and see error
    // Or we can try to query information_schema if we had a service role key, but we don't.
    // Let's try to list columns by selecting one row
    const { data, error } = await supabase.from('bugs').select('*').limit(1);

    if (error) {
        console.error('Error selecting from bugs:', error);
    } else {
        console.log('Successfully queried bugs table. Row:', data);
    }

    // Try a test insert with minimal data
    console.log('Attempting test insert...');
    const testInsert = await supabase.from('bugs').insert({
        description: 'Test Schema Check',
        elementSelector: 'body'
    }).select();

    if (testInsert.error) {
        console.error('Test Insert Failed:', JSON.stringify(testInsert.error, null, 2));
    } else {
        console.log('Test Insert Succeeded:', testInsert.data);
    }
}

checkSchema();
