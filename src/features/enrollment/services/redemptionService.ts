import { createClient } from '@/shared/lib/supabase/client';

export const redemptionService = {
    async validateToken(token: string) {
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('name, phone, email, token_status, token_redeemed_at, preferred_schedule')
                .eq('redemption_token', token)
                .maybeSingle();

            if (error) throw error;
            if (!data) return { success: false, error: 'Token no encontrado' };
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    async validateByPhone(phone: string) {
        const supabase = createClient();
        const normalized = phone.replace(/\D/g, '');

        try {
            // Use a regular query (not .single()) to avoid PostgREST coercion errors
            const { data, error } = await supabase
                .from('enrollments')
                .select('name, phone, email, token_status, token_redeemed_at, preferred_schedule, redemption_token')
                .eq('phone', normalized)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;
            if (!data || data.length === 0) {
                return { success: false, error: 'No se encontró ningún registro con ese teléfono' };
            }
            return { success: true, data: data[0] };
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
                .neq('token_status', 'redeemed')
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                return { success: false, error: 'El token ya fue canjeado o no es válido.' };
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
