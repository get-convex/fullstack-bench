'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const currentChannel = pathname?.split('/').pop() || '1';

  // Don't render anything until we know the user's auth state
  if (user === undefined) {
    return null;
  }

  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        username={user?.email || undefined}
        currentChannel={currentChannel}
      />
      <div className="flex-1 bg-[#151517]">
        {children}
      </div>
    </div>
  );
}