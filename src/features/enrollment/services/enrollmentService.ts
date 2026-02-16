import { createClient } from '@/shared/lib/supabase/client';
import { EnrollmentData } from '../types';

export const enrollmentService = {
    /**
     * Check if a phone number is already registered (client-side check via anon key).
     * Uses a count query to avoid exposing row data.
     */
    async isPhoneRegistered(phone: string): Promise<boolean> {
        const supabase = createClient();
        const normalized = phone.replace(/\D/g, '');

        const { count, error } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('phone', normalized);

        if (error) {
            console.error('Error checking phone:', error);
            return false; // Fail open — let the insert try; DB constraint will catch if needed
        }

        return (count ?? 0) > 0;
    },

    async submitEnrollment(data: EnrollmentData) {
        const supabase = createClient();

        // 1. Validate phone is not already registered
        const phoneExists = await this.isPhoneRegistered(data.phone);
        if (phoneExists) {
            return {
                success: false,
                error: 'Este número de teléfono ya está registrado. Si necesitas ayuda, contáctanos por WhatsApp.'
            };
        }

        // 2. Validate visit date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const visitDate = new Date(data.visit_date + 'T00:00:00');

        if (visitDate < today) {
            return {
                success: false,
                error: 'No puedes agendar una fecha que ya pasó. Selecciona una fecha futura.'
            };
        }

        // 3. Validate visit date is not a Sunday
        if (visitDate.getDay() === 0) {
            return {
                success: false,
                error: 'Los domingos estamos cerrados. Selecciona otro día.'
            };
        }

        // 4. Generate a 6-character alphanumeric token
        const generateToken = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let token = '';
            for (let i = 0; i < 6; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return token;
        };

        const redemptionToken = generateToken();

        try {
            const { error } = await supabase
                .from('enrollments')
                .insert([{
                    name: data.name,
                    phone: data.phone.replace(/\D/g, ''),
                    preferred_schedule: data.visit_date,
                    source: data.source || 'web_form',
                    status: 'new',
                    redemption_token: redemptionToken,
                    token_status: 'pending'
                }]);

            if (error) throw error;

            return { success: true, token: redemptionToken };
        } catch (error: any) {
            console.error('Error submitting enrollment:', error);
            return { success: false, error: error.message };
        }
    }
};
