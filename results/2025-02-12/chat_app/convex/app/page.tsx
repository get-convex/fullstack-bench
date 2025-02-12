"use client";

import { Spinner } from "@/components/Spinner";
import { useChannels } from "@/lib/state";
import { redirect } from "next/navigation";

export default function Home() {
  const channels = useChannels();
  if (channels === undefined) {
    return <Spinner />;
  }
  if (channels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="p-8 text-center text-slate-400">Create a channel!</div>
      </div>
    );
  } else {
    const channelId = channels[0].id;
    redirect(`/channels/${channelId}`);
  }
}
