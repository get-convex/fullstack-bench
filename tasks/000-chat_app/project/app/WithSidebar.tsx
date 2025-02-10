"use client";

import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import { createChannel, useChannels } from "@/lib/state";
import { usePathname } from "next/navigation";

export function WithSidebar(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useLoggedInUser();
  const currentChannel = pathname?.split("/").pop();
  const channels = useChannels();
  if (!channels) {
    return <Spinner />;
  }
  return (
    <div className="h-screen flex bg-slate-950">
      <Sidebar
        email={user?.email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={createChannel}
      />
      <div className="flex-1 bg-slate-950">{props.children}</div>
    </div>
  );
}
