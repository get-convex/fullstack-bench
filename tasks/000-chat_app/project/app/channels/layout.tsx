"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useLoggedInUser } from "@/lib/BackendContext";
import { createChannel, useChannels } from "@/lib/state";

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useLoggedInUser();
  const currentChannel = pathname?.split("/").pop() || "general";
  const channels = useChannels();
  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        email={user.email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={createChannel}
      />
      <div className="flex-1 bg-[#151517]">{children}</div>
    </div>
  );
}
