"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
interface Channel {
  id: string;
  name: string;
}

interface CreateChannelProps {
  channels: Channel[];
  createChannel: (
    channelName: string
  ) => Promise<
    { type: "success"; channelId: string } | { type: "error"; message: string }
  >;
  setIsCreatingChannel: (isCreatingChannel: boolean) => void;
}

export function CreateChannel(props: CreateChannelProps) {
  const router = useRouter();
  const [newChannelName, setNewChannelName] = useState("");

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      // Add new channel
      const result = await props.createChannel(newChannelName.trim());
      if (result.type === "error") {
        toast.error(result.message);
        return;
      }
      toast.success("Channel created successfully");
      setNewChannelName("");
      props.setIsCreatingChannel(false);

      // Navigate to the new channel
      router.push(`/channels/${result.channelId}`);
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
            props.setIsCreatingChannel(false);
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
