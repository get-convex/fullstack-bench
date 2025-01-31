'use client';

import { use } from 'react';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { SignOutButton } from '@/components/SignOutButton';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
  const resolvedParams = use(params);
  const channelIdOrName = resolvedParams.channelId;

  // Place all hooks at the top level
  const channels = useQuery(api.channels.list) ?? [];
  const user = useQuery(api.auth.getLoggedInUser);
  const sendMessage = useMutation(api.messages.send);

  // Find the channel either by ID or name
  const channel = channels.find(
    (c) => c._id === channelIdOrName || c.name === channelIdOrName
  );

  // Always call useQuery, but with a null channelId if we haven't found the channel yet
  const messages = useQuery(
    api.messages.list,
    channel ? { channelId: channel._id } : "skip"
  ) ?? [];

  const handleSendMessage = async (content: string) => {
    if (!user || !channel) {
      return;
    }
    await sendMessage({
      channelId: channel._id,
      body: content,
    });
  };

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-[#A1A1A3] mr-2">#</span>
            <h2 className="text-lg font-medium text-white">{channel.name}</h2>
          </div>
          <SignOutButton />
        </div>
      </div>

      <MessageList messages={messages} />
      <MessageInput channelId={channelIdOrName} onSendMessage={handleSendMessage} />
    </div>
  );
}