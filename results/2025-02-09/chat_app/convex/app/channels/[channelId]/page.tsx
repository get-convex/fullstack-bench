"use client";

import { use } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = use(params);
  const channelId = resolvedParams.channelId as Id<"channels">;
  const messages = useQuery(api.messages.listMessages, {
    channelId,
  });
  const channel = useQuery(api.channels.getChannel, {
    channelId,
  });
  const sendMessage = useMutation(api.messages.createMessage);
  const handleSendMessage = (content: string) => {
    void sendMessage({
      content,
      channelId,
    });
  };
  if (messages === undefined || channel === undefined) {
    return (<div className="min-h-screen flex items-center justify-center bg-[#151517]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8D2676] border-t-transparent" />
        </div>)
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center">
          <span className="text-[#A1A1A3] mr-2">#</span>
          <h2 className="text-lg font-medium text-white">{channel.name}</h2>
        </div>
      </div>
      <MessageList messages={messages} />
      <MessageInput
        channel={channel}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
