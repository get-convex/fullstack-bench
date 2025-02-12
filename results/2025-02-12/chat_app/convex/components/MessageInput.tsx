"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useSendMessage } from "@/lib/hooks";

interface MessageInputProps {
  channelId: Id<"channels">;
  channelName: string;
}

export function MessageInput({ channelId, channelName }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage({
      channelId,
      content: newMessage.trim(),
    });
    setNewMessage("");
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
            placeholder={`Message #${channelName}`}
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
