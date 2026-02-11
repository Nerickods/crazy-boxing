export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
    id: string;
    role: Role;
    content: string | null;
    tool_calls?: any[];
    tool_call_id?: string;
    created_at: string;
}

export interface ChatConversation {
    id: string;
    created_at: string;
    updated_at: string;
    messages: ChatMessage[];
}

export interface SendMessageRequest {
    message: string;
    conversationId?: string;
}

export interface SendMessageResponse {
    conversationId: string;
    message: ChatMessage;
}
