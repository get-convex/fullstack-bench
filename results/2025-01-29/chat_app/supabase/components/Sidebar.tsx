'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/database';
import type { Channel } from '@/types/database';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { CreateChannel } from './CreateChannel';

interface SidebarProps {
  username?: string;
  currentChannel: string;
}

export function Sidebar({ username, currentChannel }: SidebarProps) {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of channels
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching channels:', error);
        return;
      }

      setChannels(data || []);
    };

    fetchChannels();

    // Subscribe to new channels
    const channel = supabase
      .channel('channels')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'channels',
        },
        (payload: RealtimePostgresInsertPayload<Channel>) => {
          setChannels((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleCreateChannel = async (name: string) => {
    const { error } = await supabase.from('channels').insert({ name });

    if (error) {
      console.error('Error creating channel:', error);
      return;
    }

    setIsCreatingChannel(false);
  };

  return (
    <div className="w-[280px] border-r border-[#26262b] bg-[#151517] text-[#E1E1E3] p-4">
      {username && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[#A1A1A3]">Welcome,</h2>
          <h1 className="text-lg font-medium text-white">{username}</h1>
        </div>
      )}

      <div className="flex justify-between items-center mb-3 group">
        <h2 className="text-sm font-medium text-[#A1A1A3] tracking-wide uppercase">Channels</h2>
        <button
          onClick={() => setIsCreatingChannel(true)}
          className="text-sm text-[#A1A1A3] hover:text-white hover:bg-[#26262b] w-6 h-6 rounded flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>

      {isCreatingChannel && (
        <CreateChannel
          channels={channels}
          createChannel={handleCreateChannel}
          setIsCreatingChannel={setIsCreatingChannel}
        />
      )}

      <ul className="space-y-0.5">
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link
              href={`/channels/${channel.id}`}
              className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${
                currentChannel === channel.id.toString()
                  ? "bg-[#26262b] text-white font-medium"
                  : "text-[#A1A1A3] hover:text-white hover:bg-[#1D1D1F]"
              }`}
            >
              <span className="text-[#A1A1A3] mr-2">#</span>
              {channel.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}