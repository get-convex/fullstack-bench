'use client';

export interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  channel: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages
        .map((message) => (
          <div key={message.id} className="group">
            <div className="flex items-baseline mb-1">
              <span className="font-medium text-white">{message.user}</span>
              <span className="text-xs text-[#A1A1A3] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {message.timestamp}
              </span>
            </div>
            <p className="text-[#E1E1E3] text-sm leading-relaxed">{message.content}</p>
          </div>
        ))}
    </div>
  );
}