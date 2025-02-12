"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { WithSidebar } from "@/app/WithSidebar";
import { Id } from "@/convex/_generated/dataModel";

export default function ChannelPage({
  params: { channelId },
}: {
  params: { channelId: Id<"channels"> };
}) {
  const channel = useQuery(api.channels.get, { id: channelId });

  if (!channel) return null;

  return (
    <WithSidebar currentChannel={channelId}>
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-lg font-medium text-white">#{channel.name}</h1>
        </div>
        <MessageList channelId={channelId} />
        <MessageInput channelId={channelId} channelName={channel.name} />
      </div>
    </WithSidebar>
  );
}
