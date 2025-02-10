"use client";

import { useChannel } from "@/lib/state";
import React, { useState } from "react";

interface MessageInputProps {
  channelId: string;
  onSendMessage: (content: string) => void;
}

export function MessageInput({ channelId, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const channel = useChannel(channelId);
  if (!channel) {
    throw new Error("Channel not found");
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="px-6 py-4 border-t border-slate-800">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-4 py-2 rounded-l text-sm border border-plum focus:outline-none border-r-0"
            placeholder={`Message #${channel.name}`}
          />
          <button
            type="submit"
            className="bg-plum hover:bg-opacity-80 text-white px-6 py-2 rounded-r text-sm font-bold transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
