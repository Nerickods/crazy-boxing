import { SavedEnrollment } from '../services/enrollmentServerService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface EmailTemplate {
    subject: string;
    body: string;
}

const LEGAL_LINKS = {
    terminos: '/legal/terminos',
    privacidad: '/legal/privacidad',
    reglamento: '/legal/reglamento',
} as const;

/**
 * Formats the preferred schedule date for display in email
 */
function formatScheduleDate(schedule: string | null | undefined): string {
    if (!schedule) return 'próximamente';

    // Try to parse as date
    const date = new Date(schedule);
    if (!isNaN(date.getTime())) {
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
    }

    // Return as-is if not a valid date (e.g., "mañana", "tarde")
    return schedule;
}

/**
 * Generates personalized email template for AI chat agent leads
 */
function generateChatAgentEmail(enrollment: SavedEnrollment, baseUrl: string): EmailTemplate {
    const formattedDate = formatScheduleDate(enrollment.preferred_schedule);

    const subject = `¡Hola ${enrollment.name}! Confirmación de tu cita en Crazy Boxing MMA`;

    const body = `Hola ${enrollment.name},

¡Gracias por agendar tu visita con nuestro asistente virtual! Confirmamos tu cita para el ${formattedDate}.

Te esperamos en nuestras instalaciones. Recuerda traer ropa cómoda para tu primera experiencia de entrenamiento.

Antes de tu visita, te recomendamos revisar la siguiente información:

📋 Términos de uso: ${baseUrl}${LEGAL_LINKS.terminos}
🔒 Política de privacidad: ${baseUrl}${LEGAL_LINKS.privacidad}
📜 Reglamento del gimnasio: ${baseUrl}${LEGAL_LINKS.reglamento}

Si tienes alguna pregunta, no dudes en responder a este correo.

¡Nos vemos pronto!

—
Equipo Crazy Boxing MMA
🥊 Tu transformación comienza aquí`;

    return { subject, body };
}

/**
 * Generates personalized email template for web form leads
 */
function generateWebFormEmail(enrollment: SavedEnrollment, baseUrl: string): EmailTemplate {
    const formattedDate = formatScheduleDate(enrollment.preferred_schedule);

    const subject = `¡Bienvenido a Crazy Boxing MMA, ${enrollment.name}!`;

    const body = `Hola ${enrollment.name},

Hemos recibido tu solicitud de visita${enrollment.preferred_schedule ? ` para el ${formattedDate}` : ''}. ¡Excelente decisión!

Un miembro de nuestro equipo se comunicará contigo pronto para confirmar los detalles de tu primera clase de prueba.

Mientras tanto, te invitamos a conocer más sobre nosotros:

📋 Términos de uso: ${baseUrl}${LEGAL_LINKS.terminos}
🔒 Política de privacidad: ${baseUrl}${LEGAL_LINKS.privacidad}
📜 Reglamento del gimnasio: ${baseUrl}${LEGAL_LINKS.reglamento}

¡Prepárate para comenzar tu transformación!

—
Equipo Crazy Boxing MMA
🥊 El camino del guerrero te espera`;

    return { subject, body };
}

/**
 * Determines if the enrollment source is from the AI chat agent
 */
function isChatAgentSource(source: string): boolean {
    return source === 'chat_agent';
}

/**
 * Generates a personalized email template based on enrollment source
 * @param enrollment The enrollment record
 * @param baseUrl The base URL of the site (e.g., 'http://localhost:3000' or production URL)
 * @returns EmailTemplate with subject and body
 */
export function generateEmailForEnrollment(
    enrollment: SavedEnrollment,
    baseUrl: string = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
): EmailTemplate {
    if (isChatAgentSource(enrollment.source)) {
        return generateChatAgentEmail(enrollment, baseUrl);
    }

    return generateWebFormEmail(enrollment, baseUrl);
}

/**
 * Returns the full email text (subject + body) ready for copying
 */
export function getFullEmailText(template: EmailTemplate): string {
    return `Asunto: ${template.subject}\n\n${template.body}`;
}
