import { createClient } from '@/shared/lib/supabase/client';

export interface GymHour {
    id: string;
    label: string;
    title: string;
    schedule: string[];
    display_order: number;
    is_active: boolean;
}


import { SupabaseClient } from '@supabase/supabase-js';

export const hoursService = {
    async getGymHours(supabaseClient?: SupabaseClient) {
        const supabase = supabaseClient || createClient();
        const { data, error } = await supabase
            .from('gym_hours')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching gym hours:', error);
            // Return empty array on error to prevent crashing the page
            return [];
        }

        return data as GymHour[];
    },

    async updateGymHour(id: string, updates: Partial<GymHour>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('gym_hours')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
