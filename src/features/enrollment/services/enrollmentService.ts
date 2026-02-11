import { createClient } from '@/shared/lib/supabase/client';
import { EnrollmentData } from '../types';

export const enrollmentService = {
    async submitEnrollment(data: EnrollmentData) {
        const supabase = createClient();

        // Generate a 6-character alphanumeric token
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
                    email: data.email,
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
