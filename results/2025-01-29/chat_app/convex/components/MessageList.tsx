'use client';

import { useEffect, useRef } from "react";
import { Doc } from "@/convex/_generated/dataModel";

export type Message = Doc<"messages">;

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages
        .map((message) => (
          <div key={message._id} className="group">
            <div className="flex items-baseline mb-1">
              <span className="font-medium text-white">{message.author}</span>
              <span className="text-xs text-[#A1A1A3] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(message._creationTime).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-[#E1E1E3] text-sm leading-relaxed">{message.body}</p>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}