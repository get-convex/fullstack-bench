"use client";

import { Sidebar } from "@/components/Sidebar";
import { useLoggedInUser } from "@/lib/BackendContext";
import { createChannel, useChannels } from "@/lib/state";
import { usePathname } from "next/navigation";

export function WithSidebar(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useLoggedInUser();
  const currentChannel = pathname?.split("/").pop();
  const channels = useChannels();
  return (
    <div className="flex h-screen bg-[#151517]">
      <Sidebar
        email={user?.email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={createChannel}
      />
      <div className="flex-1 bg-[#151517]">{props.children}</div>
    </div>
  );
}
