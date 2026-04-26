import type { UIMessage as SDKMessage } from 'ai';

/** Definición extendida de Mensaje para soportar contenido multimodal (Visión) en la UI */
export interface Message extends Omit<SDKMessage, 'parts'> {
  // Redefinimos parts de forma más permisiva para la UI si es necesario
  parts?: any[];
  experimental_attachments?: any[];
  // El SDK v6 puede no tener content en el tipo base si es puramente parts-based
  content?: string;
  metadata?: any;
}

/** Interfaz robusta para mensajes entrantes en las API Routes (Capa de Transporte) */
export interface IncomingMessage {
  role: 'user' | 'assistant' | 'system' | 'data' | 'tool';
  content?: string;
  parts?: Array<{
    type: 'text' | 'image' | 'file';
    text?: string;
    image?: string | Buffer | Uint8Array;
    mimeType?: string;
  }>;
  experimental_attachments?: any[];
}

/** Rol de un mensaje de chat */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

/** Datos del lead a registrar via herramienta register_lead */
export interface LeadData {
  name: string;
  email: string;
  company: string;
  employee_size?: '1-10' | '11-50' | '51-200' | '200+';
}

/** Resultado de la ejecución de una tool */
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Resultado específico del registro de lead */
export interface LeadRegistrationResult {
  success: boolean;
  lead_id?: string;
  error?: string;
}

/** Opciones del hook useChatStream */
export interface UseChatStreamOptions {
  sessionId: string | null;
}

/** Estado expuesto por useChatStream */
export interface ChatStreamState {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: (args: { text: string; attachments?: FileList | File[] }) => void;
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | undefined;
}
