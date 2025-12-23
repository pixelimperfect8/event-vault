
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    require('dotenv').config({ path: '.env' });
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    const email = 'casetest@example.com';
    console.log(`Attempting to update user: ${email}`);

    const { data, error } = await supabase
        .from('users')
        .update({
            hasCompletedOnboarding: true,
            workspaceName: 'Test Workspace'
        })
        .eq('email', email)
        .select();

    if (error) {
        console.error("UPDATE ERROR:", JSON.stringify(error, null, 2));
    } else {
        console.log("UPDATE SUCCESS:", data);
    }
}

testUpdate();
