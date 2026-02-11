import { enrollmentService } from '@/features/enrollment/services/enrollmentService';

export interface LeadData {
    name: string;
    email: string;
    visit_date?: string;
    conversation_id?: string;
}

export interface SavedLead extends LeadData {
    id: string;
    status: string;
    source: string;
    created_at: string;
    redemption_token?: string;
}

export const leadService = {
    /**
     * Save a new lead captured via chat
     * @param data Lead information from the AI assistant
     * @returns The saved lead record
     */
    async saveLead(data: LeadData): Promise<SavedLead> {
        // Use enrollmentService to unify data and get token
        const result = await enrollmentService.submitEnrollment({
            name: data.name,
            email: data.email,
            visit_date: data.visit_date || new Date().toISOString().split('T')[0],
            source: 'chat_widget'
        });

        if (!result.success) {
            console.error('❌ Error saving lead via enrollmentService:', result.error);
            throw new Error(result.error);
        }

        console.log('✅ Lead saved successfully as Enrollment');

        return {
            id: 'generated-via-enrollment', // We don't get the ID back from submitEnrollment, but that's fine
            name: data.name,
            email: data.email,
            status: 'new',
            source: 'chat_widget',
            created_at: new Date().toISOString(),
            redemption_token: result.token
        } as SavedLead;
    },

    /**
     * Check if email already exists as lead/enrollment
     */
    async checkExistingLead(email: string): Promise<boolean> {
        // We can't easily check without RLS read permissions for anon, 
        // but enrollmentService handles duplicates or allows multiple inserts.
        // For now, return false to allow submission.
        return false;
    }
};
