"use client";

import { Sidebar } from "@/components/Sidebar";
import { useLoggedInUser } from "@/lib/BackendContext";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { usePathname } from "next/navigation";

export function WithSidebar({ children }: { children: React.ReactNode }) {
  const user = useLoggedInUser();
  const channels = useQuery(api.channels.listChannels) ?? [];
  const createChannel = useMutation(api.channels.createChannel);
  const pathname = usePathname();
  const currentChannel = pathname?.split("/").pop();
  return (
    <div className="h-screen flex bg-[#151517]">
      <Sidebar
        email={user.email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={async (name) => createChannel({ name })}
      />
      <div className="flex-1 bg-[#151517]">{children}</div>
    </div>
  );
}