'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

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

  const supabase = createClient();

  const [user, setUser] = useState<undefined | null | User>(undefined);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    void getUser();
  }, [supabase]);

  const [channels, setChannels] = useState<Channel[]>([
    { id: "general", name: "general" },
    { id: "random", name: "random" },
  ]);

  const currentChannel = pathname?.split('/').pop() || 'general';

  const handleCreateChannel = (id: string, channelName: string) => {
    setChannels([...channels, { id, name: channelName }]);
  };

  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        username={user?.email || undefined}
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