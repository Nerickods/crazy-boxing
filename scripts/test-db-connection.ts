
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Try to load .env.local manually for the script
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function testSupabase() {
    console.log('🔍 Testing Supabase Connection...');

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error('❌ ERROR: Missing Supabase credentials.');
        console.log('URL:', url ? 'Set' : 'Missing');
        console.log('Key:', key ? 'Set' : 'Missing');
        return;
    }

    console.log('✅ Credentials found.');
    const supabase = createClient(url, key);

    try {
        // 1. Test Read
        console.log('📡 Testing READ on chat_conversations...');
        const { data: readData, error: readError } = await supabase
            .from('chat_conversations')
            .select('count')
            .limit(1)
            .single();

        if (readError && readError.code !== 'PGRST116') { // PGRST116 is "no rows", which is fine for connection test
            console.error('❌ READ Failed:', readError.message);
        } else {
            console.log('✅ READ Successful.');
        }

        // 2. Test Write (Create a dummy conversation)
        console.log('📝 Testing WRITE (Insert dummy conversation)...');
        const { data: insertData, error: insertError } = await supabase
            .from('chat_conversations')
            .insert([{ metadata: { test: 'debug_script' } }])
            .select()
            .single();

        if (insertError) {
            console.error('❌ WRITE Failed:', insertError.message);
            console.error('Hint: Check RLS policies.');
            return;
        }

        const convId = insertData.id;
        console.log(`✅ WRITE Successful. Created ID: ${convId}`);

        // 3. Clean up
        console.log('🧹 Cleaning up...');
        const { error: deleteError } = await supabase
            .from('chat_conversations')
            .delete()
            .eq('id', convId);

        if (deleteError) console.error('⚠️ Cleanup failed (permissions?):', deleteError.message);
        else console.log('✅ Cleanup successful.');

    } catch (err: any) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

testSupabase();
