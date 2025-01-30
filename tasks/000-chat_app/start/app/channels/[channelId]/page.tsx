'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { MessageList, Message } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';

export default function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: Date.now(),
      user: username,
      content: content,
      timestamp: new Date().toLocaleTimeString(),
      channel: resolvedParams.channelId,
    };
    setMessages([...messages, message]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center">
          <span className="text-[#A1A1A3] mr-2">#</span>
          <h2 className="text-lg font-medium text-white">{resolvedParams.channelId}</h2>
        </div>
      </div>

      <MessageList messages={messages.filter((msg) => msg.channel === resolvedParams.channelId)} />
      <MessageInput channelId={resolvedParams.channelId} onSendMessage={handleSendMessage} />
    </div>
  );
}