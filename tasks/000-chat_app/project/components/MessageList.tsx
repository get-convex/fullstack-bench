"use client";

import { Message } from "@/lib/types";
import { useUsersById } from "@/lib/state";
interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const users = useUsersById(messages.map((message) => message.userId));
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="group">
          <div className="flex items-baseline">
            <span className="text-sm font-medium text-slate-300">
              {users[message.userId].email}
            </span>
            <span className="text-slate-400 text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-white font-medium leading-relaxed">
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
}
