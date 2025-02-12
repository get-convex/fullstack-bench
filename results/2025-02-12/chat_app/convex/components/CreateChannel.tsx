"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCreateChannel } from "@/lib/hooks";

interface CreateChannelProps {
  channels: any[];
  setIsCreatingChannel: (isCreatingChannel: boolean) => void;
}

export function CreateChannel({ setIsCreatingChannel }: CreateChannelProps) {
  const router = useRouter();
  const [newChannelName, setNewChannelName] = useState("");
  const createChannel = useCreateChannel();

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const channelId = await createChannel({ name: newChannelName.trim() });
      toast.success("Channel created successfully");
      setNewChannelName("");
      setIsCreatingChannel(false);
      router.push(`/channels/${channelId}`);
    } catch (error) {
      toast.error(`Failed to create channel: ${error}`);
    }
  };

  return (
    <form onSubmit={handleCreateChannel}>
      <input
        type="text"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        placeholder="New channel name"
        className="w-full px-3 py-2 rounded bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:border-[#8D2676] focus:outline-none mb-4 text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-plum hover:bg-opacity-80 px-3 py-1.5 rounded text-sm font-medium text-white transition-colors"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => {
            setIsCreatingChannel(false);
            setNewChannelName("");
          }}
          className="flex-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-sm font-medium text-slate-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
