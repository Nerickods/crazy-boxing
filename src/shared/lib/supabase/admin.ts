import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates an admin Supabase client that bypasses RLS.
 * Use this ONLY for admin operations where RLS should not apply.
 * 
 * IMPORTANT: Never expose this client to the browser/client-side code.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Add it to .env.local');
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
