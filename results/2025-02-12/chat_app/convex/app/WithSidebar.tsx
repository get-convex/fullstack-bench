"use client";

import { Sidebar } from "@/components/Sidebar";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/Spinner";

interface WithSidebarProps {
  children: React.ReactNode;
  currentChannel?: Id<"channels">;
}

export function WithSidebar({ children, currentChannel }: WithSidebarProps) {
  const user = useLoggedInUser();

  if (user === undefined) return <Spinner />;

  if (user === null)
    return <div className="p-4 text-white">Please sign in</div>;

  return (
    <div className="h-screen flex bg-slate-950">
      <Sidebar currentChannel={currentChannel} />
      <div className="flex-1 bg-slate-950">{children}</div>
    </div>
  );
}
