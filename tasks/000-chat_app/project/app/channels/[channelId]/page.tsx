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
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center">
          <span className="text-[#A1A1A3] mr-2">#</span>
          <h2 className="text-lg font-medium text-white">{channel?.name}</h2>
        </div>
      </div>
      <MessageList messages={messagesWithUserEmail} />
      <MessageInput channel={channel} onSendMessage={handleSendMessage} />
    </div>
  );
}
