'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Channel {
  id: string;
  name: string;
}

interface CreateChannelProps {
  channels: Channel[];
  createChannel: (id: string, channelName: string) => void;
  setIsCreatingChannel: (isCreatingChannel: boolean) => void;
}

export function CreateChannel(props: CreateChannelProps) {
  const router = useRouter();
  const [newChannelName, setNewChannelName] = useState('');

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      // Create channel ID from name (lowercase, replace spaces with hyphens)
      const channelId = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');

      // Check if channel already exists
      if (props.channels.some(channel => channel.id === channelId)) {
        alert('A channel with this name already exists');
        return;
      }

      // Add new channel
      props.createChannel(channelId, newChannelName.trim());
      setNewChannelName('');
      props.setIsCreatingChannel(false);

      // Navigate to the new channel
      router.push(`/channels/${channelId}`);
    }
  };

  return (
    <form onSubmit={handleCreateChannel} className="mb-4">
      <input
        type="text"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        placeholder="New channel name"
        className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none mb-2 text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-[#8D2676] hover:bg-[#7A2065] px-3 py-1.5 rounded text-sm font-medium text-white transition-colors"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => {
            props.setIsCreatingChannel(false);
            setNewChannelName('');
          }}
          className="flex-1 bg-[#26262b] hover:bg-[#363639] px-3 py-1.5 rounded text-sm font-medium text-[#E1E1E3] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}