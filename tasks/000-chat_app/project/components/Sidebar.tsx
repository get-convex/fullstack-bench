"use client";

import { useState } from "react";
import Link from "next/link";
import { CreateChannel } from "./CreateChannel";

interface Channel {
  id: string;
  name: string;
}

interface SidebarProps {
  email: string;
  currentChannel: string;
  channels: Channel[];
  onCreateChannel: (
    name: string
  ) => Promise<
    { type: "success"; channelId: string } | { type: "error"; message: string }
  >;
}

export function Sidebar({
  email,
  currentChannel,
  channels,
  onCreateChannel,
}: SidebarProps) {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  return (
    <div className="w-[280px] border-r border-slate-800 bg-slate-950 text-slate-200 p-4">
      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-400">Welcome,</h2>
        <h1 className="text-lg font-medium text-white">{email}</h1>
      </div>

      <div className="flex justify-between items-center mb-3 group">
        <h2 className="text-sm font-medium text-slate-400 tracking-wide uppercase">
          Channels
        </h2>
        <button
          onClick={() => setIsCreatingChannel(true)}
          className="text-sm text-slate-400 hover:text-white hover:bg-slate-800 w-6 h-6 rounded flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>

      {isCreatingChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-lg w-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">Create Channel</h2>
              <button
                onClick={() => setIsCreatingChannel(false)}
                className="text-slate-400 hover:text-white font-lg"
              >
                ✕
              </button>
            </div>
            <CreateChannel
              channels={channels}
              createChannel={onCreateChannel}
              setIsCreatingChannel={setIsCreatingChannel}
            />
          </div>
        </div>
      )}

      <ul className="space-y-0.5">
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link
              href={`/channels/${channel.id}`}
              className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${
                currentChannel === channel.id
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <span className="text-slate-400 mr-1">#</span>
              {channel.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
