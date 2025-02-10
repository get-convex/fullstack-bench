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
    return <div>No channels found</div>;
  } else {
    const channelId = channels[0].id;
    redirect(`/channels/${channelId}`);
  }
}
