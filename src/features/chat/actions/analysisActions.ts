'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/shared/lib/supabase/server'
import { analysisService } from '../services/analysisService'


/**
 * Server Action to analyze all unprocessed chat sessions in batches.
 * Following SaaS Factory Golden Path.
 */
export async function analyzeUnprocessedAction() {
    try {
        // 1. Auth Check (Admin Only)
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        // 2. Execute Batch Analysis
        // We use 10 as requested by the user
        const result = await analysisService.analyzeBatch(10)

        // 3. Revalidate Admin Pages
        revalidatePath('/admin')
        revalidatePath('/admin/conversations')

        return {
            success: true,
            data: result,
            message: result.processed > 0 
                ? `Se han analizado ${result.processed} conversaciones exitosamente.` 
                : 'No hay conversaciones nuevas para analizar.'
        }
    } catch (error: any) {
        console.error('Action Error:', error)
        return {
            success: false,
            error: error.message || 'Error al procesar las conversaciones.'
        }
    }
}

/**
 * Toggle the seen status of a chat session.
 */
export async function toggleSeenAction(sessionId: string, currentStatus: boolean) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('chat_sessions')
            .update({ is_seen: !currentStatus })
            .eq('id', sessionId)

        if (error) throw error

        revalidatePath('/admin')
        revalidatePath('/admin/conversations')
        revalidatePath(`/admin/conversations/${sessionId}`)

        return { success: true }
    } catch (error: any) {
        console.error('Toggle Seen Error:', error)
        return { success: false, error: error.message }
    }
}
