
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearPromotions() {
    console.log('Clearing promotions...');
    // Delete all promotions
    const { error } = await supabase.from('promotions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        console.error('Error clearing promotions:', error);
    } else {
        console.log('Promotions cleared.');
    }
}

clearPromotions();
