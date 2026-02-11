import { createClient } from '@/shared/lib/supabase/server';
import { ClassSchedule } from '../types';

export const scheduleService = {
    /**
     * Get all class schedules ordered by logical day/time
     */
    async getAllClasses(): Promise<ClassSchedule[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('class_schedule')
            .select('*');

        if (error) {
            console.error('Error fetching schedule:', error);
            return [];
        }

        return data as ClassSchedule[];
    },

    /**
     * Update a class schedule
     */
    async updateClass(id: string, updates: Partial<ClassSchedule>) {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('class_schedule')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new class
     */
    async createClass(newClass: Omit<ClassSchedule, 'id' | 'created_at'>) {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('class_schedule')
            .insert([newClass])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a class
     */
    async deleteClass(id: string) {
        const supabase = await createClient();
        const { error } = await supabase.from('class_schedule').delete().eq('id', id);
        if (error) throw error;
    }
};
