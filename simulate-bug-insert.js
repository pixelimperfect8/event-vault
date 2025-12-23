const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Inserting into events table to verify permissions...');
const eventInsert = await supabase.from('events').insert({
    userId: userId,
    name: 'Schema Verification Event',
    clientName: 'Test Client',
    type: 'Other',
    status: 'PLANNING',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
}).select();

if (eventInsert.error) {
    console.log('Events Insert Failed:', eventInsert.error.message, eventInsert.error.code);
} else {
    console.log('Events Insert OK');
}
}

simulateInsert();
