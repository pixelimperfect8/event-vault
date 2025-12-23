const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listPendingBugs() {
    const { data, error } = await supabase
        .from('bugs')
        .select('id, description, status')
        .eq('status', 'PENDING');

    if (error) {
        console.error('Error fetching bugs:', error);
        return;
    }

    console.log(`Found ${data.length} pending bugs:`);
    data.forEach(bug => {
        console.log('--- BUG START ---');
        console.log(JSON.stringify(bug, null, 2));
        console.log('--- BUG END ---');
    });
}

listPendingBugs();
