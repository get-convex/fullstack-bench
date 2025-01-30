'use client';

import React, { useState } from 'react';

interface MessageInputProps {
  channelId: string;
  onSendMessage: (content: string) => void;
}

export function MessageInput({ channelId, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="px-6 py-4 border-t border-[#26262b]">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-[#26262b] text-white placeholder-[#A1A1A3] px-4 py-2 rounded-l text-sm border border-[#363639] focus:border-[#8D2676] focus:outline-none"
            placeholder={`Message #${channelId}`}
          />
          <button
            type="submit"
            className="bg-[#8D2676] hover:bg-[#7A2065] text-white px-6 py-2 rounded-r text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}