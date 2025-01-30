'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

interface Channel {
  id: string;
  name: string;
}

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>([
    { id: "general", name: "general" },
    { id: "random", name: "random" },
  ]);

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/');
    } else {
      setUsername(storedUsername);
    }
  }, [router]);

  const currentChannel = pathname?.split('/').pop() || 'general';

  const handleCreateChannel = (id: string, channelName: string) => {
    setChannels([...channels, { id, name: channelName }]);
  };

  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        username={username}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={handleCreateChannel}
      />
      <div className="flex-1 bg-[#151517]">
        {children}
      </div>
    </div>
  );
}