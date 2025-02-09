"use client";

import { use } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { useUserByEmail } from "@/lib/state";
import { sendMessage, useMessages, useChannel } from "@/lib/state";
import { notFound } from "next/navigation";
import { useUserEmail } from "@/components/WithUserEmail";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = use(params);
  const messages = useMessages(resolvedParams.channelId);
  const email = useUserEmail();
  const user = useUserByEmail(email);
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
      <MessageList messages={messages} />
      <MessageInput
        channelId={resolvedParams.channelId}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
