"use client";

import { useMessages } from "@/lib/hooks";
import { Id } from "@/convex/_generated/dataModel";

interface MessageListProps {
  channelId: Id<"channels">;
}

export function MessageList({ channelId }: MessageListProps) {
  const messages = useMessages(channelId);

  if (!messages) return null;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {messages.map((message) => (
        <div key={message._id} className="group">
          <div className="flex items-baseline">
            <span className="text-sm font-medium text-slate-300">
              {message.userEmail}
            </span>
            <span className="text-slate-400 text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(message._creationTime).toLocaleTimeString()}
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
