'use server';

import { revalidatePath } from 'next/cache';
import { scheduleService } from '../services/scheduleServerService';
import { ClassSchedule } from '../types';

export async function createClassAction(data: Omit<ClassSchedule, 'id' | 'created_at'>) {
    try {
        await scheduleService.createClass(data);
        revalidatePath('/admin/disciplines');
        revalidatePath('/'); // Revalidate landing page too
        return { success: true };
    } catch (error) {
        console.error('Failed to create class:', error);
        return { success: false, error: 'Failed to create class' };
    }
}

export async function updateClassAction(id: string, data: Partial<ClassSchedule>) {
    try {
        await scheduleService.updateClass(id, data);
        revalidatePath('/admin/disciplines');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update class:', error);
        return { success: false, error: 'Failed to update class' };
    }
}

export async function deleteClassAction(id: string) {
    try {
        await scheduleService.deleteClass(id);
        revalidatePath('/admin/disciplines');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete class:', error);
        return { success: false, error: 'Failed to delete class' };
    }
}
