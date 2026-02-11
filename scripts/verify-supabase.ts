
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEnrollment() {
    console.log('\n🔍 Verifying Enrollments Table...');
    const testData = {
        name: 'Test User Verification',
        email: 'test.verification@example.com',
        phone: '1234567890',
        preferred_schedule: 'mañana',
        source: 'verification_script'
    };

    // 1. INSERT
    console.log('   Attempting INSERT...');
    const { data: insertData, error: insertError } = await supabase
        .from('enrollments')
        .insert([testData]);

    if (insertError) {
        console.error('   ❌ INSERT Failed:', insertError.message);
        return false;
    }
    console.log('   ✅ INSERT Success (Write-Only)');

    // 2. DELETE (Cleanup) - Skip or try blind delete
    console.log('   ℹ️ Skipping DELETE verification (Write-Only mode)');
    return true;
}

async function verifyChat() {
    console.log('\n🔍 Verifying Chat Tables...');

    // 1. Create Conversation
    console.log('   Attempting create Conversation...');
    const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .insert([{ metadata: { test: true } }])
        .select()
        .single();

    if (convError) {
        console.error('   ❌ Create Conversation Failed:', convError.message);
        return false;
    }
    console.log('   ✅ Conversation Created:', convData.id);

    // 2. Create Message
    console.log('   Attempting create Message...');
    const { data: msgData, error: msgError } = await supabase
        .from('chat_messages')
        .insert([{
            conversation_id: convData.id,
            role: 'user',
            content: 'Test message from verification script'
        }])
        .select()
        .single();

    if (msgError) {
        console.error('   ❌ Create Message Failed:', msgError.message);
        return false;
    }
    console.log('   ✅ Message Created:', msgData.id);

    return true;
}

async function main() {
    console.log('🚀 Starting Supabase Verification...');
    console.log('   URL:', supabaseUrl);

    const enrollSuccess = await verifyEnrollment();
    const chatSuccess = await verifyChat();

    if (enrollSuccess && chatSuccess) {
        console.log('\n✅✅ ALL SYSTEMS GO! Database is correctly configured.');
    } else {
        console.log('\n❌ some verifications failed.');
        process.exit(1);
    }
}

main();
