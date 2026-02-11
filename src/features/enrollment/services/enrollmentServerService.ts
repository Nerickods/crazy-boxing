import { createClient } from '@/shared/lib/supabase/server';

export interface EnrollmentData {
    name: string;
    email: string;
    visit_date?: string;
    conversation_id?: string;
}

export interface SavedEnrollment extends EnrollmentData {
    id: string;
    status: string;
    source: string;
    created_at: string;
    preferred_schedule?: string | null;
    metadata?: Record<string, unknown>;
    contacted_by?: string | null;
    contacted_at?: string | null;
    redemption_token?: string | null;
}

export const enrollmentService = {
    /**
     * Save a new enrollment captured via chat
     * @param data Enrollment information from the AI assistant
     * @returns The saved enrollment record
     */
    async registerFromChat(data: EnrollmentData): Promise<SavedEnrollment> {
        const supabase = await createClient();

        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert([{
                name: data.name,
                email: data.email,
                preferred_schedule: data.visit_date || null,
                metadata: { conversation_id: data.conversation_id },
                source: 'chat_agent',
                status: 'new',
                redemption_token: Math.random().toString(36).substring(2, 8).toUpperCase(),
                token_status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error saving enrollment:', error);
            throw error;
        }

        console.log('✅ Enrollment saved successfully');
        return enrollment as SavedEnrollment;
    },

    /**
     * Save a new enrollment captured via web form
     */
    async registerFromWeb(data: EnrollmentData & { source?: string }): Promise<SavedEnrollment> {
        const supabase = await createClient();

        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert([{
                name: data.name,
                email: data.email,
                preferred_schedule: data.visit_date || null,
                metadata: { conversation_id: data.conversation_id },
                source: data.source || 'landing_form',
                status: 'new',
                redemption_token: Math.random().toString(36).substring(2, 8).toUpperCase(),
                token_status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error saving web enrollment:', error);
            throw error;
        }

        return enrollment as SavedEnrollment;
    },

    async getAllEnrollments(): Promise<SavedEnrollment[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching enrollments:', error);
            return [];
        }

        return data as SavedEnrollment[];
    },

    async getNewEnrollmentsCount(): Promise<number> {
        const supabase = await createClient();

        const { count, error } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new');

        if (error) {
            console.error('Error counting new enrollments:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Check if email already exists as enrollment
     */
    async isEmailRegistered(email: string): Promise<boolean> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('enrollments')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error('Error checking existing enrollment:', error);
            return false;
        }

        return !!data;
    },

    /**
     * Mark an enrollment as contacted
     * @param id Enrollment ID
     * @param contactedBy Name of the person who made contact
     * @returns Updated enrollment record
     */
    async markAsContacted(id: string, contactedBy: string): Promise<SavedEnrollment> {
        // Use admin client to bypass RLS for this admin operation
        const { createAdminClient } = await import('@/shared/lib/supabase/admin');
        const supabase = createAdminClient();

        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .update({
                status: 'contacted',
                contacted_by: contactedBy,
                contacted_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('❌ Error marking enrollment as contacted:', error);
            throw error;
        }

        console.log(`✅ Enrollment ${id} marked as contacted by ${contactedBy}`);
        return enrollment as SavedEnrollment;
    }
};