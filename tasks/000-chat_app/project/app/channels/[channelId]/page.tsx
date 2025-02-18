"use client";

import { use } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { useChannel, sendMessage, useMessages } from "@/lib/state";
import { notFound } from "next/navigation";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = use(params);
  const messages = useMessages(resolvedParams.channelId);
  const user = useLoggedInUser();
  const channel = useChannel(resolvedParams.channelId);
  if (messages === undefined || channel === undefined) {
    return <Spinner />;
  }
  if (channel === null) {
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
      <MessageList messages={messages} />
      <MessageInput channel={channel} onSendMessage={handleSendMessage} />
    </div>
  );
}
