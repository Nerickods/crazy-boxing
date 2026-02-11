import { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/shared/utils/cn'; // Assuming cn utility exists in shared
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {message.content}
                </span>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex w-full gap-2 mb-4",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                isUser ? "bg-zinc-800 border-zinc-700" : "bg-[var(--accent)] border-none text-black"
            )}>
                {isUser ? <User size={14} className="text-zinc-400" /> : <Bot size={16} />}
            </div>

            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                isUser
                    ? "bg-zinc-800 text-white rounded-tr-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm shadow-sm"
            )}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // Bold: Gold/Accent color for emphasis
                        strong: ({ node, ...props }: any) => <span className="font-bold text-[var(--accent)]" {...props} />,
                        // Lists: Proper spacing and markers
                        ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 space-y-1 mt-2 mb-2" {...props} />,
                        ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 space-y-1 mt-2 mb-2" {...props} />,
                        li: ({ node, ...props }: any) => <li className="marker:text-[var(--accent)]" {...props} />,
                        // Paragraphs: Spacing between blocks
                        p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
                        // Links: Accent color and underline
                        a: ({ node, ...props }: any) => <a className="text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
