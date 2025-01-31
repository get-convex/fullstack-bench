'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentChannel = pathname?.split('/').pop() || 'general';
  const user = useQuery(api.auth.getLoggedInUser);
  const ensureDefaultChannels = useMutation(api.channels.ensureDefaultChannels);

  useEffect(() => {
    if (user) {
      ensureDefaultChannels();
    }
  }, [user, ensureDefaultChannels]);

  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        username={user?.name ?? user?.email}
        currentChannel={currentChannel}
      />
      <div className="flex-1 bg-[#151517]">
        {children}
      </div>
    </div>
  );
}