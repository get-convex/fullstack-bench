"use client";

import { MessageInput } from "@/components/MessageInput";
import { Message, MessageList } from "@/components/MessageList";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Channel({ user, channelId }: { user: User, channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: Date.now(),
      user: user.email ?? "Anonymous",
      content: content,
      timestamp: new Date().toLocaleTimeString(),
      channel: channelId,
    };
    setMessages([...messages, message]);
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center">
          <span className="text-[#A1A1A3] mr-2">#</span>
          <h2 className="text-lg font-medium text-white">{channelId}</h2>
        </div>
      </div>
      <MessageList
        messages={messages.filter((msg) => msg.channel === channelId)}
      />
      <MessageInput channelId={channelId} onSendMessage={handleSendMessage} />
    </div>
  );
}
