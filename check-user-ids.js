const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserIds() {
    const { data, error } = await supabase.from('users').select('id, email, name').limit(5);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Users:', JSON.stringify(data, null, 2));
    }
}

checkUserIds();
