"use client";

import { use } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { notFound } from "next/navigation";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";
import {
  initialChannels,
  initialMessages,
  initialUsers,
} from "@/lib/exampleData";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = use(params);
  const channel =
    initialChannels.find((c) => c.id === resolvedParams.channelId) ?? null;
  const messages = initialMessages
    .filter((message) => message.channelId === resolvedParams.channelId)
    .map((message) => {
      const messageUser = initialUsers.find((u) => u.id === message.userId);
      if (!messageUser) {
        throw new Error("User not found");
      }
      return {
        ...message,
        userEmail: messageUser.email,
      };
    });

  if (channel === undefined || messages === undefined) {
    return <Spinner />;
  }
  if (channel === null) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="flex items-center text-2xl">
          <span className="text-slate-400 mr-1">#</span>
          <h2 className="text-white font-bold">{channel?.name}</h2>
        </div>
      </div>
      <MessageList messages={messages} />
      <MessageInput
        channel={channel}
        onSendMessage={() => {
          throw new Error("Not implemented");
        }}
      />
    </div>
  );
}
