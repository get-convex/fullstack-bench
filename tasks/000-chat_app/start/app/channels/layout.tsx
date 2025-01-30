'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

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

  const [channels, setChannels] = useState<Channel[]>([
    { id: "general", name: "general" },
    { id: "random", name: "random" },
  ]);
  const currentChannel = pathname?.split('/').pop() || 'general';

  const handleCreateChannel = (id: string, channelName: string) => {
    setChannels([...channels, { id, name: channelName }]);
  };

  const user = useQuery(api.auth.getLoggedInUser);

  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        username={user?.name ?? user?.email}
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