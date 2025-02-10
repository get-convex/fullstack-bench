"use client";

import { Message } from "@/lib/types";
import { useUsersById } from "@/lib/state";
interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const users = useUsersById(messages.map((message) => message.userId));
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="group">
          <div className="flex items-baseline mb-1">
            <span className="font-medium text-white">
              {users[message.userId].email}
            </span>
            <span className="text-xs text-slate-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
}
