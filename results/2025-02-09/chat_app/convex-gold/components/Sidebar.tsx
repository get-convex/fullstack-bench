"use client";

import { useState } from "react";
import Link from "next/link";
import { CreateChannel } from "./CreateChannel";
import { Channel } from "@/lib/types";
import { Id } from "@/convex/_generated/dataModel";

interface SidebarProps {
  email: string;
  currentChannel?: string;
  channels: Channel[];
  onCreateChannel: (
    name: string
  ) => Promise<Id<"channels">>;
}

export function Sidebar({
  email,
  currentChannel,
  channels,
  onCreateChannel,
}: SidebarProps) {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  return (
    <div className="w-[280px] border-r border-[#26262b] bg-[#151517] text-[#E1E1E3] p-4">
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[#A1A1A3]">Welcome,</h2>
        <h1 className="text-lg font-medium text-white">{email}</h1>
      </div>

      <div className="flex justify-between items-center mb-3 group">
        <h2 className="text-sm font-medium text-[#A1A1A3] tracking-wide uppercase">
          Channels
        </h2>
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
          createChannel={onCreateChannel}
          setIsCreatingChannel={setIsCreatingChannel}
        />
      )}

      <ul className="space-y-0.5">
        {channels.map((channel) => (
          <li key={channel._id}>
            <Link
              href={`/channels/${channel._id}`}
              className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${
                currentChannel === channel._id
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
