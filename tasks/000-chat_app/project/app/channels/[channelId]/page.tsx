"use client";

import { use } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import {
  useChannel,
  sendMessage,
  useMessages,
  useUsersById,
} from "@/lib/state";
import { notFound } from "next/navigation";
import { useLoggedInUser } from "@/lib/BackendContext";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = use(params);
  const messages = useMessages(resolvedParams.channelId);
  const usersById = useUsersById(messages.map((message) => message.userId));
  const messagesWithUserEmail = messages.map((message) => ({
    ...message,
    userEmail: usersById[message.userId].email,
  }));
  const user = useLoggedInUser();
  const channel = useChannel(resolvedParams.channelId);
  if (!channel || !user) {
    notFound();
  }

  const handleSendMessage = (content: string) => {
    void sendMessage(user.id, content, resolvedParams.channelId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="flex items-center text-2xl">
          <span className="text-slate-400 mr-1">#</span>
          <h2 className="text-white font-bold">{channel?.name}</h2>
        </div>
      </div>
      <MessageList messages={messagesWithUserEmail} />
      <MessageInput channel={channel} onSendMessage={handleSendMessage} />
    </div>
  );
}
