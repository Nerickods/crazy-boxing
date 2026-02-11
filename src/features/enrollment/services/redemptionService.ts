import { createClient } from '@/shared/lib/supabase/client';

export const redemptionService = {
    async validateToken(token: string) {
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('name, email, token_status, token_redeemed_at, preferred_schedule')
                .eq('redemption_token', token)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    async redeemToken(token: string) {
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from('enrollments')
                .update({
                    token_status: 'redeemed',
                    token_redeemed_at: new Date().toISOString(),
                    status: 'confirmed'
                })
                .eq('redemption_token', token)
                .neq('token_status', 'redeemed') // Prevent double redemption
                .select(); // Get updated rows

            if (error) throw error;

            // If no rows updated, it means token was not found, already redeemed, or RLS blocked it
            if (!data || data.length === 0) {
                return { success: false, error: 'El token ya fue canjeado o no es válido.' };
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
