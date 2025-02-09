"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useUserEmail } from "@/components/WithUserEmail";
import { createChannel, useChannels } from "@/lib/state";

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const email = useUserEmail();
  const currentChannel = pathname?.split("/").pop() || "general";
  const channels = useChannels();
  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        email={email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={createChannel}
      />
      <div className="flex-1 bg-[#151517]">{children}</div>
    </div>
  );
}
