"use client";

import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import { initialChannels } from "@/lib/exampleData";
import { usePathname } from "next/navigation";

export function WithSidebar(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useLoggedInUser();
  const currentChannel = pathname?.split("/").pop();
  const channels = initialChannels;
  if (channels === undefined) {
    return <Spinner />;
  }

  return (
    <div className="h-screen flex bg-slate-950">
      <Sidebar
        email={user?.email}
        currentChannel={currentChannel}
        channels={channels}
        onCreateChannel={async (name: string) => {
          throw new Error("Not implemented");
        }}
      />
      <div className="flex-1 bg-slate-950">{props.children}</div>
    </div>
  );
}
