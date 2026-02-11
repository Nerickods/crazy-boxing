export interface Profile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'user' | 'admin'
    created_at: string
    updated_at: string
}

export interface Agent {
    id: string
    name: string
    system_prompt: string
    model_id: string
    is_active: boolean
    created_at: string
}

export interface Conversation {
    id: string
    agent_id: string
    visitor_id: string
    created_at: string
}

export interface Message {
    id: string
    conversation_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    created_at: string
}

export interface ConversationSession {
    id: string
    conversation_id: string
    agent_id: string
    first_message_at: string
    last_message_at: string
    message_count: number
    transcript: string | null
    classification: ConversationClassification | null
    classified_at: string | null
    created_at: string
}

export interface ConversationClassification {
    topics: string[]
    intent: 'learning' | 'troubleshooting' | 'exploration' | 'onboarding' | 'feedback'
    quality: 'high' | 'medium' | 'low' | 'spam'
    summary: string
    flags: {
        frustration_detected: boolean
        escalation_needed: boolean
        bug_reported: boolean
        resolved: boolean
    }
}

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Omit<Profile, 'created_at' | 'updated_at'>
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>
            }
            agents: {
                Row: Agent
                Insert: Omit<Agent, 'id' | 'created_at'>
                Update: Partial<Omit<Agent, 'id' | 'created_at'>>
            }
            conversations: {
                Row: Conversation
                Insert: Omit<Conversation, 'id' | 'created_at'>
                Update: Partial<Omit<Conversation, 'id' | 'created_at'>>
            }
            messages: {
                Row: Message
                Insert: Omit<Message, 'id' | 'created_at'>
                Update: Partial<Omit<Message, 'id' | 'created_at'>>
            }
            conversation_sessions: {
                Row: ConversationSession
                Insert: Omit<ConversationSession, 'id' | 'created_at'>
                Update: Partial<Omit<ConversationSession, 'id' | 'created_at'>>
            }
        }
    }
}
