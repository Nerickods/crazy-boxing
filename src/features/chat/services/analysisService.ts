import { createAdminClient } from '@/shared/lib/supabase/admin'
import OpenAI from 'openai'

const getOpenAIClient = () => {
    return new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "LinkedIn Strategist Admin",
        }
    })
}

const ANALYSIS_MODEL = 'google/gemini-2.0-flash-001'

export const analysisService = {
    async analyzeSession(sessionId: string) {
        try {
            const admin = await createAdminClient()
            
            // 1. Fetch messages
            const { data: messages, error: fetchError } = await admin
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })

            if (fetchError || !messages || messages.length === 0) {
                throw new Error('No se encontraron mensajes para analizar.')
            }

            // 2. Generate Transcript
            const transcript = messages
                .filter(m => m.role !== 'system')
                .map(m => `${m.role.toUpperCase()}: ${m.content || '[Acción Técnica]'}`)
                .join('\n\n')

            // 3. AI Analysis
            const openai = getOpenAIClient()
            const prompt = `Analiza la siguiente conversación entre un usuario y un Asistente Estratega de LinkedIn.
            Extrae información clave para el administrador.
            Responde ÚNICAMENTE con un objeto JSON válido.

            JSON Schema:
            {
              "summary": string, // Resumen de 1 frase del objetivo del usuario
              "topics": string[], // Temas detectados: ["Personal Branding", "Lead Gen", "LinkedIn Ads", "Content Strategy", "Other"]
              "sentiment": "positive" | "neutral" | "negative",
              "quality": "high" | "medium" | "low", // Calidad del lead
              "pain_point": string, // Cuál es el mayor problema del usuario
              "next_step": string // Recomendación de acción para el administrador
            }

            TRANSCRIPCIÓN:
            ${transcript}`

            const response = await openai.chat.completions.create({
                model: ANALYSIS_MODEL,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            } as any)

            const analysisText = response.choices[0].message.content || '{}'
            const analysis = JSON.parse(analysisText.replace(/```json\n?|\n?```/g, '').trim())

            // 4. Update Database
            await admin
                .from('chat_sessions')
                .update({
                    analysis,
                    transcript,
                    analyzed_at: new Date().toISOString(),
                    is_processed: true
                })
                .eq('id', sessionId)

            return analysis
        } catch (error) {
            console.error('Analysis Error:', error)
            throw error
        }
    },

    async analyzeBatch(limit = 10) {
        try {
            const admin = await createAdminClient()
            
            // 1. Fetch sessions not processed
            const { data: sessions, error: fetchError } = await admin
                .from('chat_sessions')
                .select('id')
                .eq('is_processed', false)
                .limit(limit)

            if (fetchError || !sessions || sessions.length === 0) {
                return { processed: 0, total: 0 }
            }

            // 2. Process all concurrently
            const results = await Promise.allSettled(
                sessions.map(s => this.analyzeSession(s.id))
            )

            const processedCount = results.filter(r => r.status === 'fulfilled').length
            
            return {
                processed: processedCount,
                total: sessions.length,
                success: processedCount > 0
            }
        } catch (error) {
            console.error('Batch Analysis Error:', error)
            throw error
        }
    }
}
